'use client'

import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { Bell, Search, Command, Menu } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'

export default function Header() {
  const { sidebarOpen, toggleSidebar, notifications } = useStore()
  const [searchOpen, setSearchOpen] = useState(false)

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <header className={cn(
      'fixed top-0 right-0 h-16 bg-surface/80 backdrop-blur-xl border-b border-border flex items-center px-6 z-30 transition-all duration-300',
      sidebarOpen ? 'left-64' : 'left-16'
    )}>
      <div className="flex items-center gap-4 flex-1">
        {!sidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-surface-hover text-text-muted hover:text-text-primary transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Search */}
        <div className="relative max-w-md w-full">
          <div
            className={cn(
              'flex items-center gap-2 bg-surface-elevated border border-border rounded-lg px-3 py-2 transition-all duration-200',
              searchOpen && 'border-primary-500/50 ring-1 ring-primary-500/20'
            )}
          >
            <Search className="w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search agents, tasks, documents..."
              className="bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none w-full"
              onFocus={() => setSearchOpen(true)}
              onBlur={() => setSearchOpen(false)}
            />
            <div className="flex items-center gap-1 text-text-muted">
              <Command className="w-3 h-3" />
              <span className="text-xs">K</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        <Link
          href="/notifications"
          className="relative p-2 rounded-lg hover:bg-surface-hover text-text-muted hover:text-text-primary transition-colors"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-accent-rose text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Link>

        <div className="h-6 w-px bg-border" />

        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent-emerald animate-pulse-slow" />
          <span className="text-xs text-text-muted">System Online</span>
        </div>
      </div>
    </header>
  )
}
