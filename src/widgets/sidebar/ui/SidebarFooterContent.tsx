"use client"

import Link from "next/link"
import { ChevronUp, LogOut, Moon, Settings, Sun } from "lucide-react"

import {
    SidebarFooter,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/shared/ui/sidebar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"
import { useSidebarAuth } from "../model/useSidebarAuth"
import { useSidebarTheme } from "../model/useSidebarTheme"

export function SidebarFooterContent() {
    const { user, handleLogout } = useSidebarAuth()
    const { isDark, themeLabel, toggleTheme } = useSidebarTheme()

    return (
        <SidebarFooter>
            <SidebarMenu className="group-data-[collapsible=icon]:items-center">
                {/* 테마 토글 */}
                <SidebarMenuItem>
                    <SidebarMenuButton onClick={toggleTheme} tooltip={themeLabel}>
                        {isDark ? (
                            <Sun className="text-amber-500" />
                        ) : (
                            <Moon className="text-slate-600" />
                        )}
                        <span>{themeLabel}</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>

                {/* 사용자 메뉴 */}
                {user && (
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton tooltip={user.email}>
                                    <div className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                                        {user.email?.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="truncate">{user.email}</span>
                                    <ChevronUp className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="top"
                                align="start"
                                className="w-[--radix-dropdown-menu-trigger-width] min-w-56"
                            >
                                <DropdownMenuItem asChild>
                                    <Link href="/admin/settings" className="flex items-center gap-2">
                                        <Settings className="size-4" />
                                        설정
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 text-destructive"
                                >
                                    <LogOut className="size-4" />
                                    로그아웃
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                )}
            </SidebarMenu>
        </SidebarFooter>
    )
}
