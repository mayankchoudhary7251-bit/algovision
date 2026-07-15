import axios from 'axios'
import { useAuthStore } from '@/features/auth/store/authStore'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10_000,
})

// Request interceptor — attach JWT token from Zustand store
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor — handle token refresh on 401
let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (error: unknown) => void
}> = []

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error)
    } else {
      promise.resolve(token!)
    }
  })
  failedQueue = []
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue the request until refresh completes
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return apiClient(originalRequest)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      const { refreshToken, setAuth, clearAuth } = useAuthStore.getState()

      if (!refreshToken) {
        clearAuth()
        return Promise.reject(error)
      }

      try {
        // Call refresh endpoint directly (not through apiClient to avoid infinite loop)
        const response = await axios.post(
          `${apiClient.defaults.baseURL}/auth/refresh`,
          { refreshToken }
        )
        const authResponse = response.data
        setAuth(authResponse)

        processQueue(null, authResponse.accessToken)
        originalRequest.headers.Authorization = `Bearer ${authResponse.accessToken}`
        return apiClient(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        clearAuth()
        window.location.href = '/auth/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient