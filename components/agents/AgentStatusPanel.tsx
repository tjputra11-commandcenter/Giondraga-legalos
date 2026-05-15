'use client'

import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { Activity, Bot, AlertTriangle, Power } from 'lucide-react'

export default function AgentStatusPanel() {
  const { agents } = useStore()

  const active = agents.filter((a) => a.status === 'active').length
  const idle = agents.filter((a) => a.status === 'idle').length
  const offline = agents.filter((a) => a.status === 'offline').length
  const error = agents.filter((a) => a.status === 'error').length

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="glass-panel p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent-emerald/10 flex items-center justify-center">
          <Activity className="w-5 h-5 text-accent-emerald" />
        </div>
        <div>
          <p className="text-2xl font-bold text-text-primary">{active}</p>
          <p className="text-xs text-text-muted">Active Agents</p>
        </div>
      </div>
      <div className="glass-panel p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent-amber/10 flex items-center justify-center">
          <Power className="w-5 h-5 text-accent-amber" />
        </div>
        <div>
          <p className="text-2xl font-bold text-text-primary">{idle}</p>
          <p className="text-xs text-text-muted">Idle Agents</p>
        </div>
      </div>
      <div className="glass-panel p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-text-muted/10 flex items-center justify-center">
          <Bot className="w-5 h-5 text-text-muted" />
        </div>
        <div>
          <p className="text-2xl font-bold text-text-primary">{offline}</p>
          <p className="text-xs text-text-muted">Offline</p>
        </div>
      </div>
      <div className="glass-panel p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent-rose/10 flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-accent-rose" />
        </div>
        <div>
          <p className="text-2xl font-bold text-text-primary">{error}</p>
          <p className="text-xs text-text-muted">Errors</p>
        </div>
      </div>
    </div>
  )
}
