'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import DashboardLayout from '@/components/layout/DashboardLayout'
import StatusBadge from '@/components/ui/StatusBadge'
import { formatDate, truncateText } from '@/lib/utils'
import { cn } from '@/lib/utils'
import {
  Plus,
  Search,
  FileText,
  BarChart3,
  Shield,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Clock,
  Download,
  Eye,
  Sparkles,
  Filter,
  X
} from 'lucide-react'

const typeFilters = [
  { value: 'all', label: 'All Reports' },
  { value: 'executive', label: 'Executive' },
  { value: 'legal', label: 'Legal' },
  { value: 'compliance', label: 'Compliance' },
  { value: 'performance', label: 'Performance' },
]

const typeIcons: Record<string, typeof FileText> = {
  executive: TrendingUp,
  legal: Shield,
  compliance: CheckCircle,
  performance: BarChart3,
  custom: FileText,
}

const typeColors: Record<string, string> = {
  executive: 'from-accent-rose to-accent-violet',
  legal: 'from-primary-500 to-accent-cyan',
  compliance: 'from-accent-amber to-accent-rose',
  performance: 'from-accent-emerald to-primary-500',
  custom: 'from-text-muted to-text-secondary',
}

export default function ReportsPage() {
  const { reports } = useStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [showNewReportModal, setShowNewReportModal] = useState(false)

  const filteredReports = reports
    .filter((report) => {
      const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesType = typeFilter === 'all' || report.type === typeFilter
      return matchesSearch && matchesType
    })

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary mb-1">Reports</h1>
          <p className="text-sm text-text-muted">Generate and manage AI-powered reports</p>
        </div>
        <button
          onClick={() => setShowNewReportModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Generate Report
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-dark w-full pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          {typeFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setTypeFilter(filter.value)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                typeFilter === filter.value
                  ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20'
                  : 'text-text-muted hover:text-text-secondary border border-transparent hover:border-border'
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredReports.map((report) => {
          const Icon = typeIcons[report.type] || FileText
          const gradient = typeColors[report.type] || typeColors.custom

          return (
            <div key={report.id} className="glass-panel p-5 card-hover group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={cn('w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center', gradient)}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-text-primary">{truncateText(report.title, 40)}</h3>
                    <p className="text-xs text-text-muted capitalize">{report.type} Report</p>
                  </div>
                </div>
                <StatusBadge status={report.status} />
              </div>

              {report.summary && (
                <p className="text-xs text-text-muted mb-4 line-clamp-2">{report.summary}</p>
              )}

              {/* Metrics */}
              {report.metrics && (
                <div className="grid grid-cols-3 gap-2 mb-4 p-3 rounded-lg bg-surface-hover">
                  {Object.entries(report.metrics).slice(0, 3).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <p className="text-sm font-bold text-text-primary">
                        {typeof value === 'number' && value > 1000 ? `${(value / 1000).toFixed(1)}K` : value}
                        {key.includes('Rate') || key.includes('Score') || key.includes('Satisfaction') ? '%' : ''}
                      </p>
                      <p className="text-[10px] text-text-muted uppercase tracking-wider">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="flex items-center gap-3 text-xs text-text-muted">
                  <span>{formatDate(report.createdAt)}</span>
                  {report.aiGenerated && (
                    <span className="flex items-center gap-1 text-accent-violet">
                      <Sparkles className="w-3 h-3" />
                      AI Generated
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 rounded-lg hover:bg-surface-hover text-text-muted hover:text-text-primary transition-colors" title="View">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 rounded-lg hover:bg-surface-hover text-text-muted hover:text-text-primary transition-colors" title="Download">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filteredReports.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-text-muted mx-auto mb-4" />
          <p className="text-text-muted">No reports found matching your criteria</p>
        </div>
      )}

      {/* New Report Modal */}
      {showNewReportModal && (
        <div className="modal-overlay" onClick={() => setShowNewReportModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-text-primary">Generate New Report</h3>
                <button
                  onClick={() => setShowNewReportModal(false)}
                  className="p-1.5 rounded-lg hover:bg-surface-hover text-text-muted hover:text-text-primary transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Report Title</label>
                  <input type="text" placeholder="e.g., Q4 Legal Operations Summary" className="input-dark w-full" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Report Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {typeFilters.slice(1).map((type) => {
                      const Icon = typeIcons[type.value] || FileText
                      return (
                        <button
                          key={type.value}
                          className="flex items-center gap-2 p-3 rounded-lg border border-border hover:border-primary-500/50 hover:bg-primary-500/5 transition-all text-left"
                        >
                          <Icon className="w-4 h-4 text-text-muted" />
                          <span className="text-sm text-text-secondary">{type.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Date Range</label>
                  <div className="grid grid-cols-2 gap-3">
                    <input type="date" className="input-dark w-full" />
                    <input type="date" className="input-dark w-full" />
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 rounded-lg bg-primary-500/5 border border-primary-500/20">
                  <Sparkles className="w-4 h-4 text-primary-400" />
                  <span className="text-sm text-primary-400">AI will analyze data and generate insights automatically</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-border">
                <button
                  onClick={() => setShowNewReportModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button className="btn-primary flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
