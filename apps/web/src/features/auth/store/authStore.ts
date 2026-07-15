import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthResponse, AuthState, UserResponse } from '../types/auth.types'

/**
 * Auth store — global state for the authenticated user.
 *
 * Uses Zustand's 'persist' middleware to save state to localStorage.
 * This means if the user refreshes the page, they stay logged in.
 *
 * What is persisted:
 * - accessToken  → sent on every API request
 * - refreshToken → used to get new access tokens
 * - user         → displayed in the navbar and dashboard
 *
 * What is NOT persisted:
 * - isLoading → always starts as false on page load
 */

interface AuthActions {
  setAuth: (response: AuthResponse) => void
  setUser: (user: UserResponse) => void
  clearAuth: () => void
  setLoading: (loading: boolean) => void
}

type AuthStore = AuthState & AuthActions

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialState,

      /**
       * Called after successful login or registration.
       * Stores all auth data and marks user as authenticated.
       */
      setAuth: (response: AuthResponse) =>
        set({
          user: response.user,
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          isAuthenticated: true,
          isLoading: false,
        }),

      /**
       * Updates just the user object (e.g., after profile update).
       */
      setUser: (user: UserResponse) =>
        set({ user }),

      /**
       * Called on logout or when tokens expire and cannot be refreshed.
       * Clears all auth data and marks user as unauthenticated.
       */
      clearAuth: () =>
        set({
          ...initialState,
        }),

      setLoading: (loading: boolean) =>
        set({ isLoading: loading }),
    }),
    {
      name: 'algovision-auth', // localStorage key
      partialize: (state) => ({
        // Only persist these fields — not isLoading
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)