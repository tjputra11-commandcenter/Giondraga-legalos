import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon: LucideIcon
  iconColor?: string
  className?: string
}

export default function MetricCard({ title, value, change, changeType = 'neutral', icon: Icon, iconColor = 'text-primary-400', className }: MetricCardProps) {
  return (
    <div className={cn('glass-panel p-5 card-hover', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-text-muted mb-1">{title}</p>
          <p className="text-2xl font-bold text-text-primary">{value}</p>
          {change && (
            <p className={cn(
              'text-xs mt-1 font-medium',
              changeType === 'positive' && 'text-accent-emerald',
              changeType === 'negative' && 'text-accent-rose',
              changeType === 'neutral' && 'text-text-muted'
            )}>
              {changeType === 'positive' && '↑ '}
              {changeType === 'negative' && '↓ '}
              {change}
            </p>
          )}
        </div>
        <div className={cn('p-2.5 rounded-lg bg-surface-hover', iconColor)}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  )
}
