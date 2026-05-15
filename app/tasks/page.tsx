'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import DashboardLayout from '@/components/layout/DashboardLayout'
import StatusBadge from '@/components/ui/StatusBadge'
import { formatRelativeTime, truncateText } from '@/lib/utils'
import { cn } from '@/lib/utils'
import {
  Plus,
  Search,
  Filter,
  ClipboardList,
  Clock,
  CheckCircle,
  AlertTriangle,
  Loader2,
  XCircle,
  ArrowUpDown,
  Bot,
  Eye,
  Play,
  Pause,
  RotateCcw,
} from 'lucide-react'

const statusFilters = [
  { value: 'all', label: 'All', color: '' },
  { value: 'pending', label: 'Pending', color: 'text-accent-amber' },
  { value: 'running', label: 'Running', color: 'text-primary-400' },
  { value: 'completed', label: 'Completed', color: 'text-accent-emerald' },
  { value: 'failed', label: 'Failed', color: 'text-accent-rose' },
]

const priorityFilters = [
  { value: 'all', label: 'All Priorities' },
  { value: 'critical', label: 'Critical' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
]

export default function TasksPage() {
  const { tasks, agents } = useStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [sortBy, setSortBy] = useState('createdAt')

  const filteredTasks = tasks
    .filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter
      return matchesSearch && matchesStatus && matchesPriority
    })
    .sort((a, b) => {
      if (sortBy === 'createdAt') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      if (sortBy === 'priority') {
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      }
      if (sortBy === 'status') return a.status.localeCompare(b.status)
      return 0
    })

  const statusCounts = {
    pending: tasks.filter((t) => t.status === 'pending').length,
    running: tasks.filter((t) => t.status === 'running').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
    failed: tasks.filter((t) => t.status === 'failed').length,
  }

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary mb-1">Tasks</h1>
          <p className="text-sm text-text-muted">Manage and monitor AI task executions</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Task
        </button>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statusFilters.slice(1).map((filter) => (
          <button
            key={filter.value}
            onClick={() => setStatusFilter(statusFilter === filter.value ? 'all' : filter.value)}
            className={cn(
              'glass-panel p-4 text-left card-hover transition-all',
              statusFilter === filter.value && 'border-primary-500/50 ring-1 ring-primary-500/20'
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-text-muted uppercase tracking-wider">{filter.label}</span>
              <StatusBadge status={filter.value} />
            </div>
            <p className={cn('text-2xl font-bold', filter.color)}>
              {statusCounts[filter.value as keyof typeof statusCounts] || 0}
            </p>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-dark w-full pl-10"
          />
        </div>
        <div className="flex items-center gap-3">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="input-dark text-sm py-1.5"
          >
            {priorityFilters.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-dark text-sm py-1.5"
          >
            <option value="createdAt">Sort by Date</option>
            <option value="priority">Sort by Priority</option>
            <option value="status">Sort by Status</option>
          </select>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Agent</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Created</th>
                <th>Duration</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr key={task.id}>
                  <td>
                    <div>
                      <p className="font-medium text-text-primary">{truncateText(task.title, 40)}</p>
                      <p className="text-xs text-text-muted mt-0.5">{truncateText(task.description, 50)}</p>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Bot className="w-4 h-4 text-text-muted" />
                      <span className="text-sm">{task.agentName}</span>
                    </div>
                  </td>
                  <td><StatusBadge status={task.status} /></td>
                  <td><StatusBadge status={task.priority} /></td>
                  <td className="text-xs">{formatRelativeTime(task.createdAt)}</td>
                  <td>
                    {task.duration ? (
                      <span className="text-xs text-text-muted">{Math.round(task.duration / 60)}m</span>
                    ) : (
                      <span className="text-xs text-text-muted">—</span>
                    )}
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-surface-hover text-text-muted hover:text-text-primary transition-colors" title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                      {task.status === 'pending' && (
                        <button className="p-1.5 rounded-lg hover:bg-primary-500/10 text-text-muted hover:text-primary-400 transition-colors" title="Start">
                          <Play className="w-4 h-4" />
                        </button>
                      )}
                      {task.status === 'running' && (
                        <button className="p-1.5 rounded-lg hover:bg-accent-amber/10 text-text-muted hover:text-accent-amber transition-colors" title="Pause">
                          <Pause className="w-4 h-4" />
                        </button>
                      )}
                      {task.status === 'failed' && (
                        <button className="p-1.5 rounded-lg hover:bg-accent-emerald/10 text-text-muted hover:text-accent-emerald transition-colors" title="Retry">
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <ClipboardList className="w-12 h-12 text-text-muted mx-auto mb-4" />
            <p className="text-text-muted">No tasks found matching your criteria</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
