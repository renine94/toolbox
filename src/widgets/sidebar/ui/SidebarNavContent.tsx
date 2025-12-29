"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import {
    SidebarContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/shared/ui/sidebar"
import { adminNavigation } from "../model/navigation"

export function SidebarNavContent() {
    const pathname = usePathname()

    return (
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
    )
}
