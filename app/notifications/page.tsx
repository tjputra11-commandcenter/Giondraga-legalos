'use client'

import { useStore } from '@/lib/store'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { formatRelativeTime } from '@/lib/utils'
import { cn } from '@/lib/utils'
import {
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  AlertTriangle,
  CheckCheck,
  Trash2,
  ArrowRight,
  Clock,
} from 'lucide-react'

const typeConfig: Record<string, { icon: typeof Info; color: string; bgColor: string }> = {
  success: { icon: CheckCircle, color: 'text-accent-emerald', bgColor: 'bg-accent-emerald/10' },
  error: { icon: AlertCircle, color: 'text-accent-rose', bgColor: 'bg-accent-rose/10' },
  warning: { icon: AlertTriangle, color: 'text-accent-amber', bgColor: 'bg-accent-amber/10' },
  info: { icon: Info, color: 'text-primary-400', bgColor: 'bg-primary-500/10' },
}

export default function NotificationsPage() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useStore()

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary mb-1">Notifications</h1>
          <p className="text-sm text-text-muted">
            {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={markAllNotificationsRead}
            className="btn-secondary flex items-center gap-2 text-sm"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all read
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="glass-panel overflow-hidden">
        <div className="divide-y divide-border">
          {notifications.map((notification) => {
            const config = typeConfig[notification.type] || typeConfig.info
            const Icon = config.icon

            return (
              <div
                key={notification.id}
                onClick={() => markNotificationRead(notification.id)}
                className={cn(
                  'notification-item group',
                  !notification.read && 'bg-primary-500/5'
                )}
              >
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', config.bgColor)}>
                  <Icon className={cn('w-5 h-5', config.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className={cn(
                        'text-sm font-medium',
                        !notification.read ? 'text-text-primary' : 'text-text-secondary'
                      )}>
                        {notification.title}
                      </p>
                      <p className="text-xs text-text-muted mt-0.5">{notification.message}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-text-muted">{formatRelativeTime(notification.createdAt)}</span>
                      {!notification.read && (
                        <div className="w-2 h-2 rounded-full bg-primary-500" />
                      )}
                    </div>
                  </div>
                </div>
                <button
                  className="p-1.5 rounded-lg hover:bg-accent-rose/10 text-text-muted hover:text-accent-rose transition-colors opacity-0 group-hover:opacity-100"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )
          })}
        </div>
        {notifications.length === 0 && (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-text-muted mx-auto mb-4" />
            <p className="text-text-muted">No notifications</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
