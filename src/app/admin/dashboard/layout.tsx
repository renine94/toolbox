import HeaderAdmin from "@/widgets/header/ui/HeaderAdmin"

export default function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-background">
            <div className="flex h-screen">
                <aside className="w-64 bg-secondary">hi</aside>
                <main className="flex flex-col flex-1">
                    <HeaderAdmin />
                    <div className="container mx-auto px-4 flex-1 overflow-y-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
