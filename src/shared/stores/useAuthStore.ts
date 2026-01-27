import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthState, AuthActions, LoginCredentials, AdminUser } from '../types/auth'

// 하드코딩된 샘플 관리자 데이터 (추후 API로 대체)
const ADMIN_CREDENTIALS = {
  email: 'admin@example.com',
  password: 'admin123',
}

const ADMIN_USER: AdminUser = {
  email: 'admin@example.com',
  name: 'Administrator',
  role: 'admin',
}

async function authenticate(
  credentials: LoginCredentials
): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
  // 네트워크 지연 시뮬레이션
  await new Promise((resolve) => setTimeout(resolve, 500))

  if (
    credentials.email === ADMIN_CREDENTIALS.email &&
    credentials.password === ADMIN_CREDENTIALS.password
  ) {
    return { success: true, user: ADMIN_USER }
  }

  return { success: false, error: '이메일 또는 비밀번호가 올바르지 않습니다.' }
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
