'use client'

import { useStore } from '@/lib/store'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function TasksTimeline() {
  const { metrics } = useStore()

  return (
    <div className="glass-panel p-5">
      <h3 className="text-sm font-semibold text-text-primary mb-4">Task Volume Over Time</h3>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={metrics.tasksOverTime} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
          <defs>
            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
          <XAxis 
            dataKey="date" 
            tick={{ fill: '#64748b', fontSize: 10 }} 
            axisLine={{ stroke: '#1e1e2e' }}
            tickLine={false}
            tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          />
          <YAxis 
            tick={{ fill: '#64748b', fontSize: 11 }} 
            axisLine={{ stroke: '#1e1e2e' }}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#16161f',
              border: '1px solid #2a2a3e',
              borderRadius: '8px',
              color: '#f1f5f9',
              fontSize: '12px',
            }}
          />
          <Area 
            type="monotone" 
            dataKey="count" 
            stroke="#3b82f6" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorCount)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
