'use client'

import { useAuthStore } from '@/features/auth'

export default function DashboardPage() {
  const { user } = useAuthStore()

  return (
    <div className="p-8">
      <p className="text-lg">환영합니다, {user?.name}님!</p>
    </div>
  )
}
