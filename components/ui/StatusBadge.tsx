import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: string
  className?: string
}

const statusConfig: Record<string, { color: string; label: string }> = {
  active: { color: 'bg-accent-emerald/10 text-accent-emerald border-accent-emerald/20', label: 'Active' },
  idle: { color: 'bg-accent-amber/10 text-accent-amber border-accent-amber/20', label: 'Idle' },
  offline: { color: 'bg-text-muted/10 text-text-muted border-text-muted/20', label: 'Offline' },
  error: { color: 'bg-accent-rose/10 text-accent-rose border-accent-rose/20', label: 'Error' },
  running: { color: 'bg-primary-500/10 text-primary-400 border-primary-500/20', label: 'Running' },
  pending: { color: 'bg-accent-amber/10 text-accent-amber border-accent-amber/20', label: 'Pending' },
  completed: { color: 'bg-accent-emerald/10 text-accent-emerald border-accent-emerald/20', label: 'Completed' },
  failed: { color: 'bg-accent-rose/10 text-accent-rose border-accent-rose/20', label: 'Failed' },
  cancelled: { color: 'bg-text-muted/10 text-text-muted border-text-muted/20', label: 'Cancelled' },
  draft: { color: 'bg-text-muted/10 text-text-muted border-text-muted/20', label: 'Draft' },
  generating: { color: 'bg-primary-500/10 text-primary-400 border-primary-500/20', label: 'Generating' },
  open: { color: 'bg-primary-500/10 text-primary-400 border-primary-500/20', label: 'Open' },
  in_progress: { color: 'bg-accent-amber/10 text-accent-amber border-accent-amber/20', label: 'In Progress' },
  review: { color: 'bg-accent-violet/10 text-accent-violet border-accent-violet/20', label: 'Review' },
  closed: { color: 'bg-accent-emerald/10 text-accent-emerald border-accent-emerald/20', label: 'Closed' },
  archived: { color: 'bg-text-muted/10 text-text-muted border-text-muted/20', label: 'Archived' },
  critical: { color: 'bg-accent-rose/10 text-accent-rose border-accent-rose/20', label: 'Critical' },
  high: { color: 'bg-accent-amber/10 text-accent-amber border-accent-amber/20', label: 'High' },
  medium: { color: 'bg-primary-500/10 text-primary-400 border-primary-500/20', label: 'Medium' },
  low: { color: 'bg-text-muted/10 text-text-muted border-text-muted/20', label: 'Low' },
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.offline

  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border', config.color, className)}>
      {config.label}
    </span>
  )
}
