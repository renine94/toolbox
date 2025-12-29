"use client"

import {
    SidebarHeader,
    SidebarTrigger,
} from "@/shared/ui/sidebar"

export function SidebarHeaderContent() {
    return (
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
    )
}
