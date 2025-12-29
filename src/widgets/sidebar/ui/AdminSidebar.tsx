"use client"

import { Sidebar, SidebarRail } from "@/shared/ui/sidebar"
import { SidebarHeaderContent } from "./SidebarHeaderContent"
import { SidebarNavContent } from "./SidebarNavContent"
import { SidebarFooterContent } from "./SidebarFooterContent"

export function AdminSidebar() {
    return (
        <Sidebar collapsible="icon" className="p-1">
            <SidebarHeaderContent />
            <SidebarNavContent />
            <SidebarFooterContent />
            <SidebarRail />
        </Sidebar>
    )
}
