import type { LoginCredentials, AdminUser } from '../model/types'

// 하드코딩된 샘플 관리자 데이터
const ADMIN_CREDENTIALS = {
  email: 'admin@example.com',
  password: 'admin123',
}

const ADMIN_USER: AdminUser = {
  email: 'admin@example.com',
  name: 'Administrator',
  role: 'admin',
}

export async function authenticate(
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
