import { ActivityLog as ActivityLogType } from '@/types'
import { formatRelativeTime } from '@/lib/utils'
import { Bot, FileText, ClipboardList, User, BarChart3, AlertCircle, CheckCircle, Info } from 'lucide-react'

interface ActivityLogProps {
  logs: ActivityLogType[]
  maxItems?: number
}

const entityIcons: Record<string, typeof Bot> = {
  agent: Bot,
  task: ClipboardList,
  document: FileText,
  user: User,
  report: BarChart3,
  system: Info,
}

const severityColors: Record<string, string> = {
  info: 'text-primary-400',
  warning: 'text-accent-amber',
  error: 'text-accent-rose',
}

const severityIcons: Record<string, typeof Info> = {
  info: Info,
  warning: AlertCircle,
  error: AlertCircle,
}

export default function ActivityLog({ logs, maxItems = 10 }: ActivityLogProps) {
  const displayLogs = logs.slice(0, maxItems)

  return (
    <div className="space-y-1">
      {displayLogs.map((log) => {
        const EntityIcon = entityIcons[log.entityType] || Info
        const SeverityIcon = severityIcons[log.severity] || Info
        const severityColor = severityColors[log.severity]

        return (
          <div key={log.id} className="log-entry group">
            <div className={cn('p-1.5 rounded-lg bg-surface-hover', severityColor)}>
              <SeverityIcon className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm text-text-primary font-medium">{log.action}</span>
                <span className="text-xs text-text-muted">{formatRelativeTime(log.timestamp)}</span>
              </div>
              <p className="text-xs text-text-muted mt-0.5 truncate">
                {log.entityName} by {log.userName}
              </p>
            </div>
            <EntityIcon className="w-4 h-4 text-text-muted flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        )
      })}
    </div>
  )
}

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}
