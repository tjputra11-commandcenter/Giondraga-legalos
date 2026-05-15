'use client'

import { AIAgent } from '@/types'
import { cn } from '@/lib/utils'
import { Bot, Activity, Zap, Clock, CheckCircle, AlertTriangle, Power, Settings } from 'lucide-react'
import StatusBadge from '../ui/StatusBadge'
import Link from 'next/link'

interface AgentCardProps {
  agent: AIAgent
  className?: string
}

const typeColors: Record<string, string> = {
  legal: 'from-primary-500 to-accent-cyan',
  research: 'from-accent-violet to-accent-cyan',
  it: 'from-accent-emerald to-primary-500',
  compliance: 'from-accent-amber to-accent-rose',
  executive: 'from-accent-rose to-accent-violet',
  custom: 'from-text-muted to-text-secondary',
}

const typeIcons: Record<string, typeof Bot> = {
  legal: Activity,
  research: Zap,
  it: Settings,
  compliance: CheckCircle,
  executive: Activity,
  custom: Bot,
}

export default function AgentCard({ agent, className }: AgentCardProps) {
  const TypeIcon = typeIcons[agent.type] || Bot
  const gradient = typeColors[agent.type] || typeColors.custom

  return (
    <Link href={`/agents/${agent.id}`}>
      <div className={cn('agent-card group cursor-pointer', className)}>
        {/* Top gradient line */}
        <div className={cn('absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300', gradient)} />

        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center', gradient)}>
              <TypeIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-text-primary">{agent.name}</h3>
              <p className="text-xs text-text-muted capitalize">{agent.type} Agent</p>
            </div>
          </div>
          <StatusBadge status={agent.status} />
        </div>

        <p className="text-xs text-text-muted mb-4 line-clamp-2">{agent.description}</p>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center">
            <p className="text-lg font-bold text-text-primary">{agent.tasksCompleted}</p>
            <p className="text-[10px] text-text-muted uppercase tracking-wider">Tasks</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-accent-emerald">{agent.accuracy}%</p>
            <p className="text-[10px] text-text-muted uppercase tracking-wider">Accuracy</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-primary-400">{agent.responseTime}s</p>
            <p className="text-[10px] text-text-muted uppercase tracking-wider">Response</p>
          </div>
        </div>

        {/* Capabilities */}
        <div className="flex flex-wrap gap-1.5">
          {agent.capabilities.slice(0, 3).map((cap, i) => (
            <span key={i} className="px-2 py-0.5 bg-surface-hover rounded-md text-[10px] text-text-muted border border-border">
              {cap}
            </span>
          ))}
          {agent.capabilities.length > 3 && (
            <span className="px-2 py-0.5 bg-surface-hover rounded-md text-[10px] text-text-muted border border-border">
              +{agent.capabilities.length - 3}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-text-muted" />
            <span className="text-[10px] text-text-muted">
              {agent.status === 'active' ? 'Active now' : `Last active ${new Date(agent.lastActive).toLocaleTimeString()}`}
            </span>
          </div>
          {agent.status === 'error' && (
            <AlertTriangle className="w-4 h-4 text-accent-rose" />
          )}
        </div>
      </div>
    </Link>
  )
}
