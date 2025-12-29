"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

export function useSidebarTheme() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark")
    }

    const isDark = mounted && theme === "dark"
    const themeLabel = isDark ? "라이트 모드" : "다크 모드"

    return {
        mounted,
        isDark,
        themeLabel,
        toggleTheme,
    }
}
