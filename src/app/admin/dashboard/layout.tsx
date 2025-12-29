import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/shared/ui/sidebar"
import { AdminSidebar } from "@/widgets/sidebar"
import { Separator } from "@/shared/ui/separator"

export default function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-background">
            <SidebarProvider>
                <AdminSidebar />
                <SidebarInset>
                    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 md:hidden">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <span className="font-semibold">Admin</span>
                    </header>
                    <div className="container mx-auto px-4 flex-1 overflow-y-auto">
                        {children}
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </div>
    )
}
