'use client'

import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import Sidebar from './Sidebar'
import Header from './Header'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { sidebarOpen } = useStore()

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Header />
      <main
        className={cn(
          'pt-16 min-h-screen transition-all duration-300',
          sidebarOpen ? 'pl-64' : 'pl-16'
        )}
      >
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
