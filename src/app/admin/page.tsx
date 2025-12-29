'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LoginForm, useAuthStore } from '@/features/auth'

export default function AdminPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/admin/dashboard')
    }
  }, [isAuthenticated, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoginForm />
    </div>
  )
}
