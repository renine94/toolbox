"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarRail,
    SidebarTrigger
} from "@/shared/ui/sidebar"
import { adminNavigation } from "../config/navigation"

export function AdminSidebar() {
    const pathname = usePathname()

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <div className="flex items-center gap-3 px-2 py-2 justify-between group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
                    <div className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-linear-to-br from-violet-500 to-purple-600 font-bold text-white">
                            T
                        </div>
                        <span className="font-semibold">관리자</span>
                    </div>
                    <SidebarTrigger />
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarMenu className="group-data-[collapsible=icon]:items-center">
                    {adminNavigation.map((item) => (
                        <SidebarMenuItem key={item.url}>
                            <SidebarMenuButton
                                asChild
                                isActive={pathname === item.url}
                                tooltip={item.title}
                            >
                                <Link href={item.url}>
                                    <item.icon />
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>

            <SidebarRail />
        </Sidebar>
    )
}
