import apiClient from '@/shared/lib/apiClient'
import type {
  AuthResponse,
  ForgotPasswordRequest,
  LoginRequest,
  RefreshTokenRequest,
  RegisterRequest,
  ResetPasswordRequest,
  UserResponse,
} from '../types/auth.types'

/**
 * Auth API functions — each function maps to one backend endpoint.
 * These are called by the Zustand store actions, never directly from components.
 */

export const authApi = {
  register: (data: RegisterRequest): Promise<AuthResponse> =>
    apiClient.post('/auth/register', data).then((res) => res.data),

  login: (data: LoginRequest): Promise<AuthResponse> =>
    apiClient.post('/auth/login', data).then((res) => res.data),

  refresh: (data: RefreshTokenRequest): Promise<AuthResponse> =>
    apiClient.post('/auth/refresh', data).then((res) => res.data),

  logout: (): Promise<void> =>
    apiClient.post('/auth/logout').then(() => undefined),

  me: (): Promise<UserResponse> =>
    apiClient.get('/auth/me').then((res) => res.data),

  forgotPassword: (data: ForgotPasswordRequest): Promise<{ message: string }> =>
    apiClient.post('/auth/forgot-password', data).then((res) => res.data),

  resetPassword: (data: ResetPasswordRequest): Promise<{ message: string }> =>
    apiClient.post('/auth/reset-password', data).then((res) => res.data),

  verifyEmail: (token: string): Promise<{ message: string }> =>
    apiClient.get(`/auth/verify-email?token=${token}`).then((res) => res.data),
}