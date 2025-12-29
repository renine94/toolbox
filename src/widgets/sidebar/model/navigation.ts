import { Home, Settings, LucideIcon } from "lucide-react"

export interface NavItem {
    title: string
    url: string
    icon: LucideIcon
}

export const adminNavigation: NavItem[] = [
    { title: "대시보드", url: "/admin/dashboard", icon: Home },
    { title: "설정", url: "/admin/settings", icon: Settings },
]
