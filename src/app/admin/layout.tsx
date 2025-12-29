import HeaderAdmin from "@/widgets/header/ui/HeaderAdmin"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <HeaderAdmin />
      <div className="container mx-auto px-4">
        {children}
      </div>
    </div>
  )
}
