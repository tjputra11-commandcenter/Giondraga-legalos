'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import DashboardLayout from '@/components/layout/DashboardLayout'
import AgentCard from '@/components/agents/AgentCard'
import AgentStatusPanel from '@/components/agents/AgentStatusPanel'
import AgentPerformanceChart from '@/components/agents/AgentPerformanceChart'
import StatusBadge from '@/components/ui/StatusBadge'
import { cn } from '@/lib/utils'
import {
  Plus,
  Search,
  Filter,
  Bot,
  Activity,
  Zap,
  Settings,
  CheckCircle,
  BarChart3,
  ArrowUpDown,
} from 'lucide-react'

const typeFilters = [
  { value: 'all', label: 'All Agents', icon: Bot },
  { value: 'legal', label: 'Legal', icon: Activity },
  { value: 'research', label: 'Research', icon: Zap },
  { value: 'it', label: 'IT Security', icon: Settings },
  { value: 'compliance', label: 'Compliance', icon: CheckCircle },
  { value: 'executive', label: 'Executive', icon: BarChart3 },
]

const statusFilters = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'idle', label: 'Idle' },
  { value: 'offline', label: 'Offline' },
  { value: 'error', label: 'Error' },
]

export default function AgentsPage() {
  const { agents } = useStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('name')

  const filteredAgents = agents
    .filter((agent) => {
      const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesType = typeFilter === 'all' || agent.type === typeFilter
      const matchesStatus = statusFilter === 'all' || agent.status === statusFilter
      return matchesSearch && matchesType && matchesStatus
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'tasks') return b.tasksCompleted - a.tasksCompleted
      if (sortBy === 'accuracy') return b.accuracy - a.accuracy
      if (sortBy === 'status') return a.status.localeCompare(b.status)
      return 0
    })

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary mb-1">AI Agents</h1>
          <p className="text-sm text-text-muted">Monitor and manage your specialized AI agents</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Deploy Agent
        </button>
      </div>

      {/* Agent Status Overview */}
      <div className="mb-6">
        <AgentStatusPanel />
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search agents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-dark w-full pl-10"
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Type Filter */}
          <div className="flex items-center gap-1 bg-surface-elevated border border-border rounded-lg p-1">
            {typeFilters.map((filter) => {
              const Icon = filter.icon
              return (
                <button
                  key={filter.value}
                  onClick={() => setTypeFilter(filter.value)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all',
                    typeFilter === filter.value
                      ? 'bg-primary-500/10 text-primary-400'
                      : 'text-text-muted hover:text-text-secondary'
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{filter.label}</span>
                </button>
              )
            })}
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-dark text-sm py-1.5"
          >
            {statusFilters.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-dark text-sm py-1.5"
          >
            <option value="name">Sort by Name</option>
            <option value="tasks">Sort by Tasks</option>
            <option value="accuracy">Sort by Accuracy</option>
            <option value="status">Sort by Status</option>
          </select>
        </div>
      </div>

      {/* Agent Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {filteredAgents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>

      {filteredAgents.length === 0 && (
        <div className="text-center py-12">
          <Bot className="w-12 h-12 text-text-muted mx-auto mb-4" />
          <p className="text-text-muted">No agents found matching your criteria</p>
        </div>
      )}

      {/* Performance Chart */}
      <div className="mb-6">
        <AgentPerformanceChart />
      </div>
    </DashboardLayout>
  )
}
