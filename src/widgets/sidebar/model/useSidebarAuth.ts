"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useAuthStore } from "@/shared/stores/useAuthStore"

export function useSidebarAuth() {
    const router = useRouter()
    const { user, logout } = useAuthStore()

    const handleLogout = () => {
        logout()
        toast.success("로그아웃 되었습니다.")
        router.push("/admin/login")
    }

    return {
        user,
        handleLogout,
    }
}
