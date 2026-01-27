export interface LoginCredentials {
  email: string
  password: string
}

export interface AdminUser {
  email: string
  name: string
  role: 'admin'
}

export interface AuthState {
  user: AdminUser | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<boolean>
  logout: () => void
  clearError: () => void
}
