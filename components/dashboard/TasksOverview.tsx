'use client'

import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { CheckCircle, Clock, AlertTriangle, XCircle, Loader2 } from 'lucide-react'

export default function TasksOverview() {
  const { metrics } = useStore()

  const statusConfig = [
    { status: 'completed', label: 'Completed', count: metrics.tasksByStatus.find(s => s.status === 'completed')?.count || 0, icon: CheckCircle, color: 'text-accent-emerald', bgColor: 'bg-accent-emerald/10' },
    { status: 'running', label: 'Running', count: metrics.tasksByStatus.find(s => s.status === 'running')?.count || 0, icon: Loader2, color: 'text-primary-400', bgColor: 'bg-primary-500/10' },
    { status: 'pending', label: 'Pending', count: metrics.tasksByStatus.find(s => s.status === 'pending')?.count || 0, icon: Clock, color: 'text-accent-amber', bgColor: 'bg-accent-amber/10' },
    { status: 'failed', label: 'Failed', count: metrics.tasksByStatus.find(s => s.status === 'failed')?.count || 0, icon: XCircle, color: 'text-accent-rose', bgColor: 'bg-accent-rose/10' },
  ]

  return (
    <div className="glass-panel p-5">
      <h3 className="text-sm font-semibold text-text-primary mb-4">Tasks Overview</h3>
      <div className="space-y-3">
        {statusConfig.map((item) => {
          const Icon = item.icon
          const total = metrics.totalTasks
          const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0

          return (
            <div key={item.status} className="flex items-center gap-3">
              <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', item.bgColor)}>
                <Icon className={cn('w-4 h-4', item.color)} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-text-secondary">{item.label}</span>
                  <span className="text-sm font-semibold text-text-primary">{item.count}</span>
                </div>
                <div className="progress-bar">
                  <div
                    className={cn('progress-bar-fill', item.color.replace('text-', 'bg-'))}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
