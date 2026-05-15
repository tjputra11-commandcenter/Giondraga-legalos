'use client'

import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  Bot,
  FileText,
  ClipboardList,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
  BarChart3,
  LogOut,
  Building2,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { id: 'clients', label: 'Clients', icon: Users, href: '/clients' },
  { id: 'agents', label: 'AI Agents', icon: Bot, href: '/agents' },
  { id: 'tasks', label: 'Tasks', icon: ClipboardList, href: '/tasks' },
  { id: 'documents', label: 'Documents', icon: FileText, href: '/documents' },
  { id: 'reports', label: 'Reports', icon: BarChart3, href: '/reports' },
  { id: 'notifications', label: 'Notifications', icon: Bell, href: '/notifications' },
  { id: 'settings', label: 'Settings', icon: Settings, href: '/settings' },
]

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar, user, logout } = useStore()
  const pathname = usePathname()

  const unreadCount = useStore((state) => state.notifications.filter((n) => !n.read).length)

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen bg-surface border-r border-border flex flex-col transition-all duration-300 z-40',
        sidebarOpen ? 'w-64' : 'w-16'
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-border">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-violet flex items-center justify-center flex-shrink-0">
            <Shield className="w-4 h-4 text-white" />
          </div>
          {sidebarOpen && (
            <div className="animate-fade-in">
              <h1 className="text-sm font-bold text-text-primary whitespace-nowrap">GIONDRAGA</h1>
              <p className="text-[10px] text-text-muted whitespace-nowrap">AI Command Center</p>
            </div>
          )}
        </div>
        <button
          onClick={toggleSidebar}
          className="ml-auto p-1 rounded-lg hover:bg-surface-hover text-text-muted hover:text-text-primary transition-colors"
        >
          {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
          const Icon = item.icon
          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative',
                isActive
                  ? 'bg-primary-500/10 text-primary-400 border-r-2 border-primary-500'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
              )}
            >
              <Icon className={cn('w-5 h-5 flex-shrink-0', isActive && 'text-primary-400')} />
              {sidebarOpen && (
                <span className="text-sm font-medium whitespace-hidden overflow-hidden text-ellipsis">
                  {item.label}
                </span>
              )}
              {item.id === 'notifications' && unreadCount > 0 && (
                <span className={cn(
                  'bg-accent-rose text-white text-[10px] font-bold rounded-full flex items-center justify-center',
                  sidebarOpen ? 'ml-auto px-1.5 py-0.5 min-w-[18px]' : 'absolute -top-1 -right-1 w-4 h-4'
                )}>
                  {unreadCount}
                </span>
              )}
              {!sidebarOpen && isActive && (
                <div className="absolute left-14 bg-surface-elevated border border-border px-2 py-1 rounded-lg text-xs text-text-primary whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
                  {item.label}
                </div>
              )}
            </Link>
          )
        })}
      </nav>

      {/* User Profile */}
      <div className="p-3 border-t border-border">
        <div className={cn('flex items-center gap-3', !sidebarOpen && 'justify-center')}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-cyan to-primary-500 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-white">{user?.name?.charAt(0) || 'U'}</span>
          </div>
          {sidebarOpen && (
            <div className="flex-1 min-w-0 animate-fade-in">
              <p className="text-sm font-medium text-text-primary truncate">{user?.name}</p>
              <p className="text-xs text-text-muted truncate">{user?.role}</p>
            </div>
          )}
          {sidebarOpen && (
            <button
              onClick={logout}
              className="p-1.5 rounded-lg hover:bg-accent-rose/10 text-text-muted hover:text-accent-rose transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
        {sidebarOpen && user?.organization && (
          <div className="mt-2 flex items-center gap-2 px-1">
            <Building2 className="w-3 h-3 text-text-muted" />
            <span className="text-[10px] text-text-muted truncate">{user.organization}</span>
          </div>
        )}
      </div>
    </aside>
  )
}
