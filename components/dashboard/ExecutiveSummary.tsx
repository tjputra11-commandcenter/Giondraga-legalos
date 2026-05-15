'use client'

import { useStore } from '@/lib/store'
import { TrendingUp, TrendingDown, Minus, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SummaryItem {
  label: string
  value: string
  change: string
  changeType: 'positive' | 'negative' | 'neutral'
  description: string
}

export default function ExecutiveSummary() {
  const { metrics, agents, tasks, documents } = useStore()

  const summaryItems: SummaryItem[] = [
    {
      label: 'System Uptime',
      value: `${metrics.systemUptime}%`,
      change: '+0.3%',
      changeType: 'positive',
      description: 'All critical systems operational',
    },
    {
      label: 'Task Completion Rate',
      value: `${Math.round((metrics.completedTasks / metrics.totalTasks) * 100)}%`,
      change: '+5.2%',
      changeType: 'positive',
      description: `${metrics.completedTasks} of ${metrics.totalTasks} tasks completed`,
    },
    {
      label: 'Avg Response Time',
      value: `${metrics.avgResponseTime}s`,
      change: '-0.3s',
      changeType: 'positive',
      description: 'Performance optimized this week',
    },
    {
      label: 'Document Processing',
      value: `${Math.round((metrics.processedDocuments / metrics.totalDocuments) * 100)}%`,
      change: '+8.1%',
      changeType: 'positive',
      description: `${metrics.processedDocuments} documents processed`,
    },
    {
      label: 'Active AI Agents',
      value: `${metrics.activeAgents}/${metrics.totalAgents}`,
      change: '0',
      changeType: 'neutral',
      description: `${metrics.activeAgents} agents currently active`,
    },
    {
      label: 'Token Usage',
      value: `${(metrics.tokenUsage / 1000000).toFixed(1)}M`,
      change: '+12%',
      changeType: 'negative',
      description: `Est. cost: $${metrics.costEstimate.toFixed(2)}`,
    },
  ]

  return (
    <div className="glass-panel p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-text-primary">Executive Summary</h3>
          <p className="text-xs text-text-muted mt-0.5">Real-time system health and performance</p>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-accent-emerald/10 border border-accent-emerald/20">
          <div className="w-1.5 h-1.5 rounded-full bg-accent-emerald animate-pulse" />
          <span className="text-xs font-medium text-accent-emerald">All Systems Operational</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {summaryItems.map((item) => (
          <div key={item.label} className="p-3 rounded-lg bg-surface-hover/50 border border-border hover:border-border-light transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-text-muted">{item.label}</span>
              <div className={cn(
                'flex items-center gap-0.5 text-xs font-medium',
                item.changeType === 'positive' && 'text-accent-emerald',
                item.changeType === 'negative' && 'text-accent-rose',
                item.changeType === 'neutral' && 'text-text-muted'
              )}>
                {item.changeType === 'positive' && <ArrowUpRight className="w-3 h-3" />}
                {item.changeType === 'negative' && <ArrowDownRight className="w-3 h-3" />}
                {item.changeType === 'neutral' && <Minus className="w-3 h-3" />}
                {item.change}
              </div>
            </div>
            <p className="text-xl font-bold text-text-primary mb-1">{item.value}</p>
            <p className="text-[10px] text-text-muted">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
