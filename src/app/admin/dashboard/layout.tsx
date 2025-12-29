import { SidebarProvider, SidebarInset } from "@/shared/ui/sidebar"
import { AdminSidebar } from "@/widgets/sidebar"
import HeaderAdmin from "@/widgets/header/ui/HeaderAdmin"

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
                    <HeaderAdmin />
                    <div className="container mx-auto px-4 flex-1 overflow-y-auto">
                        {children}
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </div>
    )
}
