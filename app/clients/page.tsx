'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import DashboardLayout from '@/components/layout/DashboardLayout'
import StatusBadge from '@/components/ui/StatusBadge'
import { formatRelativeTime } from '@/lib/utils'
import { cn } from '@/lib/utils'
import {
  Plus,
  Search,
  Building2,
  Mail,
  Phone,
  Briefcase,
  Users,
  FolderOpen,
  Clock,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
} from 'lucide-react'

const industryFilters = [
  { value: 'all', label: 'All Industries' },
  { value: 'Manufacturing', label: 'Manufacturing' },
  { value: 'Technology', label: 'Technology' },
  { value: 'Financial Services', label: 'Financial Services' },
  { value: 'Energy', label: 'Energy' },
]

const statusFilters = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'pending', label: 'Pending' },
]

export default function ClientsPage() {
  const { clients, cases } = useStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [industryFilter, setIndustryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredClients = clients
    .filter((client) => {
      const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesIndustry = industryFilter === 'all' || client.industry === industryFilter
      const matchesStatus = statusFilter === 'all' || client.status === statusFilter
      return matchesSearch && matchesIndustry && matchesStatus
    })

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary mb-1">Clients</h1>
          <p className="text-sm text-text-muted">Manage your client portfolio and cases</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Client
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="glass-panel p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{clients.length}</p>
              <p className="text-xs text-text-muted">Total Clients</p>
            </div>
          </div>
        </div>
        <div className="glass-panel p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-emerald/10 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-accent-emerald" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{clients.filter(c => c.status === 'active').length}</p>
              <p className="text-xs text-text-muted">Active Clients</p>
            </div>
          </div>
        </div>
        <div className="glass-panel p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-amber/10 flex items-center justify-center">
              <FolderOpen className="w-5 h-5 text-accent-amber" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{cases.length}</p>
              <p className="text-xs text-text-muted">Open Cases</p>
            </div>
          </div>
        </div>
        <div className="glass-panel p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-cyan/10 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-accent-cyan" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">
                {clients.reduce((acc, c) => acc + c.totalCases, 0)}
              </p>
              <p className="text-xs text-text-muted">Total Cases</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-dark w-full pl-10"
          />
        </div>
        <div className="flex items-center gap-3">
          <select
            value={industryFilter}
            onChange={(e) => setIndustryFilter(e.target.value)}
            className="input-dark text-sm py-1.5"
          >
            {industryFilters.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-dark text-sm py-1.5"
          >
            {statusFilters.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Clients Table */}
      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Industry</th>
                <th>Status</th>
                <th>Cases</th>
                <th>Open Cases</th>
                <th>Consultant</th>
                <th>Last Contact</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-violet flex items-center justify-center">
                        <span className="text-xs font-bold text-white">{client.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-medium text-text-primary">{client.name}</p>
                        <p className="text-xs text-text-muted">{client.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="text-sm text-text-secondary">{client.industry}</span>
                  </td>
                  <td><StatusBadge status={client.status} /></td>
                  <td>
                    <span className="text-sm text-text-primary font-medium">{client.totalCases}</span>
                  </td>
                  <td>
                    <span className={cn(
                      'text-sm font-medium',
                      client.openCases > 0 ? 'text-accent-amber' : 'text-text-muted'
                    )}>
                      {client.openCases}
                    </span>
                  </td>
                  <td>
                    <span className="text-sm text-text-secondary">{client.assignedConsultant || 'Unassigned'}</span>
                  </td>
                  <td className="text-xs">{formatRelativeTime(client.lastContact)}</td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-surface-hover text-text-muted hover:text-text-primary transition-colors" title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-surface-hover text-text-muted hover:text-text-primary transition-colors" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredClients.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-text-muted mx-auto mb-4" />
            <p className="text-text-muted">No clients found matching your criteria</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
