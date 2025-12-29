import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AdminUser, AuthState, LoginCredentials } from './types'
import { authenticate } from '../lib/auth-service'

interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<boolean>
  logout: () => void
  clearError: () => void
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null })

        const result = await authenticate(credentials)

        if (result.success && result.user) {
          set({
            user: result.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
          return true
        }

        set({
          isLoading: false,
          error: result.error || '로그인에 실패했습니다.',
        })
        return false
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        })
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'admin-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
