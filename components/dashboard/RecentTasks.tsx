'use client'

import { useStore } from '@/lib/store'
import { formatRelativeTime, truncateText } from '@/lib/utils'
import StatusBadge from '../ui/StatusBadge'
import Link from 'next/link'

export default function RecentTasks() {
  const { tasks } = useStore()
  const recentTasks = tasks.slice(0, 5)

  return (
    <div className="glass-panel p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-text-primary">Recent Tasks</h3>
        <Link href="/tasks" className="text-xs text-primary-400 hover:text-primary-300 transition-colors">
          View all
        </Link>
      </div>
      <div className="space-y-2">
        {recentTasks.map((task) => (
          <Link key={task.id} href={`/tasks/${task.id}`}>
            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-surface-hover transition-colors group cursor-pointer">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-text-primary truncate group-hover:text-primary-400 transition-colors">
                    {truncateText(task.title, 50)}
                  </p>
                  <StatusBadge status={task.status} />
                </div>
                <div className="flex items-center gap-3 text-xs text-text-muted">
                  <span>{task.agentName}</span>
                  <span>•</span>
                  <span>{formatRelativeTime(task.createdAt)}</span>
                </div>
              </div>
              <StatusBadge status={task.priority} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
