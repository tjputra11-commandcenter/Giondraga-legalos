'use client'

import { useStore } from '@/lib/store'
import DashboardLayout from '@/components/layout/DashboardLayout'
import MetricCard from '@/components/ui/MetricCard'
import ExecutiveSummary from '@/components/dashboard/ExecutiveSummary'
import TasksOverview from '@/components/dashboard/TasksOverview'
import TasksTimeline from '@/components/dashboard/TasksTimeline'
import RecentTasks from '@/components/dashboard/RecentTasks'
import AgentStatusPanel from '@/components/agents/AgentStatusPanel'
import AgentPerformanceChart from '@/components/agents/AgentPerformanceChart'
import ActivityLog from '@/components/ui/ActivityLog'
import {
  Bot,
  ClipboardList,
  FileText,
  Clock,
  TrendingUp,
  Activity,
  Zap,
} from 'lucide-react'

export default function DashboardPage() {
  const { metrics, agents, tasks, documents, activityLogs } = useStore()

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary mb-1">Dashboard</h1>
        <p className="text-sm text-text-muted">Overview of your AI command center operations</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="Active Agents"
          value={`${metrics.activeAgents}/${metrics.totalAgents}`}
          change="All systems operational"
          changeType="positive"
          icon={Bot}
          iconColor="text-primary-400"
        />
        <MetricCard
          title="Tasks Completed"
          value={metrics.completedTasks.toLocaleString()}
          change="+5.2% this week"
          changeType="positive"
          icon={ClipboardList}
          iconColor="text-accent-emerald"
        />
        <MetricCard
          title="Documents Processed"
          value={metrics.processedDocuments.toLocaleString()}
          change="+8.1% this week"
          changeType="positive"
          icon={FileText}
          iconColor="text-accent-cyan"
        />
        <MetricCard
          title="Avg Response Time"
          value={`${metrics.avgResponseTime}s`}
          change="-0.3s optimized"
          changeType="positive"
          icon={Clock}
          iconColor="text-accent-amber"
        />
      </div>

      {/* Executive Summary */}
      <div className="mb-6">
        <ExecutiveSummary />
      </div>

      {/* Agent Status & Performance */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <AgentStatusPanel />
        </div>
        <div>
          <AgentPerformanceChart />
        </div>
      </div>

      {/* Tasks & Timeline */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-1">
          <TasksOverview />
        </div>
        <div className="lg:col-span-2">
          <TasksTimeline />
        </div>
      </div>

      {/* Recent Tasks & Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <RecentTasks />
        <div className="glass-panel p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Recent Activity</h3>
          <ActivityLog logs={activityLogs} maxItems={8} />
        </div>
      </div>
    </DashboardLayout>
  )
}
