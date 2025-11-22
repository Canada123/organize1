import { DataProvider } from '@/contexts/DataContext'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DataProvider>
      <div className="min-h-screen bg-bg-secondary">
        <header className="bg-white border-b border-border-primary">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-semibold text-text-primary">
              Invoice Approval Analytics
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              Process standardization insights across regions
            </p>
          </div>
        </header>
        <main className="p-6">
          {children}
        </main>
      </div>
    </DataProvider>
  )
}