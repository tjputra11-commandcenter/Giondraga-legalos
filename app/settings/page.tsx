'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { cn } from '@/lib/utils'
import {
  User,
  Building2,
  Shield,
  Bell,
  Palette,
  Key,
  Globe,
  Save,
  CheckCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  Upload,
  Trash2,
  Plus,
} from 'lucide-react'

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'organization', label: 'Organization', icon: Building2 },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'api', label: 'API Keys', icon: Key },
]

export default function SettingsPage() {
  const { user } = useStore()
  const [activeTab, setActiveTab] = useState('profile')
  const [showApiKey, setShowApiKey] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary mb-1">Settings</h1>
        <p className="text-sm text-text-muted">Manage your account and organization preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="glass-panel p-2 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                    activeTab === tab.id
                      ? 'bg-primary-500/10 text-primary-400'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="glass-panel p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-6">Profile Settings</h2>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-accent-violet flex items-center justify-center">
                  <span className="text-xl font-bold text-white">{user?.name?.charAt(0) || 'U'}</span>
                </div>
                <div>
                  <button className="btn-secondary text-sm flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Change Avatar
                  </button>
                  <p className="text-xs text-text-muted mt-1">JPG, PNG or GIF. Max 2MB.</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Full Name</label>
                  <input type="text" defaultValue={user?.name} className="input-dark w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Email Address</label>
                  <input type="email" defaultValue={user?.email} className="input-dark w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Role</label>
                  <input type="text" defaultValue={user?.role} className="input-dark w-full" disabled />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Department</label>
                  <select className="input-dark w-full">
                    <option>Legal</option>
                    <option>Compliance</option>
                    <option>IT Security</option>
                    <option>Executive</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button className="btn-secondary">Cancel</button>
                <button onClick={handleSave} className="btn-primary flex items-center gap-2">
                  {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                  {saved ? 'Saved!' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}

          {/* Organization Tab */}
          {activeTab === 'organization' && (
            <div className="glass-panel p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-6">Organization Settings</h2>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Organization Name</label>
                  <input type="text" defaultValue="Giondraga & Partners" className="input-dark w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Domain</label>
                  <input type="text" defaultValue="giondraga.com" className="input-dark w-full" />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Plan</label>
                    <select className="input-dark w-full">
                      <option>Basic</option>
                      <option selected>Professional</option>
                      <option>Enterprise</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Max Users</label>
                    <input type="number" defaultValue="25" className="input-dark w-full" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Primary Color</label>
                  <div className="flex items-center gap-3">
                    <input type="color" defaultValue="#3b82f6" className="w-10 h-10 rounded-lg cursor-pointer" />
                    <span className="text-sm text-text-muted">#3b82f6</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button className="btn-secondary">Cancel</button>
                <button onClick={handleSave} className="btn-primary flex items-center gap-2">
                  {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                  {saved ? 'Saved!' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="glass-panel p-6">
                <h2 className="text-lg font-semibold text-text-primary mb-6">Password</h2>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Current Password</label>
                    <div className="relative">
                      <input type="password" className="input-dark w-full pr-10" />
                      <Eye className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">New Password</label>
                    <div className="relative">
                      <input type="password" className="input-dark w-full pr-10" />
                      <Eye className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    </div>
                  </div>
                </div>
                <button className="btn-primary">Update Password</button>
              </div>

              <div className="glass-panel p-6">
                <h2 className="text-lg font-semibold text-text-primary mb-6">Two-Factor Authentication</h2>
                <div className="flex items-center justify-between p-4 rounded-lg bg-surface-hover border border-border">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-accent-emerald" />
                    <div>
                      <p className="text-sm font-medium text-text-primary">Authenticator App</p>
                      <p className="text-xs text-text-muted">Using Google Authenticator</p>
                    </div>
                  </div>
                  <span className="badge-success">Enabled</span>
                </div>
              </div>

              <div className="glass-panel p-6">
                <h2 className="text-lg font-semibold text-text-primary mb-6">Session Management</h2>
                <div className="space-y-3">
                  {[
                    { device: 'MacBook Pro - Chrome', location: 'Jakarta, Indonesia', current: true },
                    { device: 'iPhone 15 - Safari', location: 'Jakarta, Indonesia', current: false },
                    { device: 'Windows PC - Edge', location: 'Singapore', current: false },
                  ].map((session, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-surface-hover border border-border">
                      <div className="flex items-center gap-3">
                        <Globe className="w-4 h-4 text-text-muted" />
                        <div>
                          <p className="text-sm text-text-primary">{session.device}</p>
                          <p className="text-xs text-text-muted">{session.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {session.current && <span className="badge-info text-xs">Current</span>}
                        <button className="text-xs text-accent-rose hover:text-accent-rose/80 transition-colors">
                          Revoke
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="glass-panel p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-6">Notification Preferences</h2>

              <div className="space-y-4">
                {[
                  { label: 'Task Completion', desc: 'Get notified when AI tasks complete', enabled: true },
                  { label: 'Agent Alerts', desc: 'Receive alerts when agents encounter errors', enabled: true },
                  { label: 'Document Processing', desc: 'Notifications when documents are processed', enabled: true },
                  { label: 'Security Events', desc: 'Alerts for security-related events', enabled: true },
                  { label: 'Weekly Summary', desc: 'Weekly digest of all activities', enabled: false },
                  { label: 'Marketing Updates', desc: 'Product updates and new features', enabled: false },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-surface-hover border border-border">
                    <div>
                      <p className="text-sm font-medium text-text-primary">{item.label}</p>
                      <p className="text-xs text-text-muted">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={item.enabled} className="sr-only peer" />
                      <div className="w-11 h-6 bg-surface-hover peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500" />
                    </label>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-border">
                <button className="btn-secondary">Cancel</button>
                <button onClick={handleSave} className="btn-primary flex items-center gap-2">
                  {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                  {saved ? 'Saved!' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="glass-panel p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-6">Appearance</h2>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Theme</label>
                  <div className="grid grid-cols-3 gap-3">
                    <button className="p-4 rounded-lg border-2 border-primary-500 bg-surface text-center">
                      <div className="w-full h-12 rounded bg-background mb-2 border border-border" />
                      <span className="text-sm text-text-primary">Dark</span>
                    </button>
                    <button className="p-4 rounded-lg border border-border bg-surface text-center opacity-50">
                      <div className="w-full h-12 rounded bg-gray-100 mb-2" />
                      <span className="text-sm text-text-muted">Light</span>
                    </button>
                    <button className="p-4 rounded-lg border border-border bg-surface text-center opacity-50">
                      <div className="w-full h-12 rounded bg-gradient-to-b from-gray-100 to-background mb-2" />
                      <span className="text-sm text-text-muted">System</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Sidebar Density</label>
                  <select className="input-dark w-full">
                    <option>Compact</option>
                    <option selected>Default</option>
                    <option>Comfortable</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Font Size</label>
                  <select className="input-dark w-full">
                    <option>Small</option>
                    <option selected>Medium</option>
                    <option>Large</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button className="btn-secondary">Cancel</button>
                <button onClick={handleSave} className="btn-primary flex items-center gap-2">
                  {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                  {saved ? 'Saved!' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}

          {/* API Keys Tab */}
          {activeTab === 'api' && (
            <div className="space-y-6">
              <div className="glass-panel p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-text-primary">API Keys</h2>
                  <button className="btn-primary flex items-center gap-2 text-sm">
                    <Plus className="w-4 h-4" />
                    Generate Key
                  </button>
                </div>

                <div className="space-y-3">
                  {[
                    { name: 'Production API Key', key: 'gk_live_xxxxxxxxxxxxxxxx', created: '2024-11-15', lastUsed: '2 hours ago' },
                    { name: 'Development API Key', key: 'gk_dev_xxxxxxxxxxxxxxxx', created: '2024-10-01', lastUsed: '1 day ago' },
                    { name: 'Integration Test Key', key: 'gk_test_xxxxxxxxxxxxxxxx', created: '2024-09-20', lastUsed: '1 week ago' },
                  ].map((apiKey, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-surface-hover border border-border">
                      <div>
                        <p className="text-sm font-medium text-text-primary">{apiKey.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <code className="text-xs text-text-muted bg-surface px-2 py-0.5 rounded">
                            {showApiKey ? apiKey.key : apiKey.key.replace(/x/g, '•')}
                          </code>
                          <button
                            onClick={() => setShowApiKey(!showApiKey)}
                            className="text-text-muted hover:text-text-primary transition-colors"
                          >
                            {showApiKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          </button>
                        </div>
                        <p className="text-xs text-text-muted mt-1">
                          Created {apiKey.created} • Last used {apiKey.lastUsed}
                        </p>
                      </div>
                      <button className="p-1.5 rounded-lg hover:bg-accent-rose/10 text-text-muted hover:text-accent-rose transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-panel p-6">
                <h2 className="text-lg font-semibold text-text-primary mb-4">Webhook Endpoints</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-surface-hover border border-border">
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-text-muted" />
                      <div>
                        <p className="text-sm text-text-primary">https://api.giondraga.com/webhooks/events</p>
                        <p className="text-xs text-text-muted">All events • POST</p>
                      </div>
                    </div>
                    <span className="badge-success text-xs">Active</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
