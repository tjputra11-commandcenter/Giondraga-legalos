'use client'

import { useStore } from '@/lib/store'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

export default function AgentPerformanceChart() {
  const { metrics } = useStore()

  const data = metrics.agentPerformance.map((ap) => ({
    name: ap.agentName,
    accuracy: ap.accuracy,
    speed: 100 - (ap.speed * 10),
    load: ap.load,
  }))

  const colors = ['#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6']

  return (
    <div className="glass-panel p-5">
      <h3 className="text-sm font-semibold text-text-primary mb-4">Agent Performance</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
          <XAxis 
            dataKey="name" 
            tick={{ fill: '#64748b', fontSize: 11 }} 
            axisLine={{ stroke: '#1e1e2e' }}
            tickLine={false}
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
          <Bar dataKey="accuracy" radius={[4, 4, 0, 0]}>
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
