export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4">
        {children}
      </div>
    </div>
  )
}
