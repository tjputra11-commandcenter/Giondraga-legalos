'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Shield,
  Bot,
  FileText,
  BarChart3,
  Zap,
  Lock,
  ChevronRight,
  CheckCircle,
  ArrowRight,
  Globe,
  Users,
  Cpu,
  MessageSquare,
  Bell,
  Settings,
  Play,
} from 'lucide-react'

const features = [
  {
    icon: Bot,
    title: 'AI-Powered Legal Agents',
    description: 'Specialized AI agents for contract analysis, legal research, compliance monitoring, and IT security. Each agent trained on domain-specific knowledge.',
    color: 'from-primary-500 to-accent-cyan',
  },
  {
    icon: FileText,
    title: 'Intelligent Document Processing',
    description: 'Upload, analyze, and extract insights from legal documents with AI-powered OCR, NLP, and structured data extraction.',
    color: 'from-accent-violet to-accent-cyan',
  },
  {
    icon: BarChart3,
    title: 'Real-Time Analytics Dashboard',
    description: 'Monitor agent performance, task execution, system health, and compliance metrics in a unified command center.',
    color: 'from-accent-emerald to-primary-500',
  },
  {
    icon: Shield,
    title: 'Enterprise-Grade Security',
    description: 'Multi-tenant architecture with role-based access control, audit logging, and end-to-end encryption for sensitive legal data.',
    color: 'from-accent-amber to-accent-rose',
  },
  {
    icon: Users,
    title: 'Multi-Tenant Client Portal',
    description: 'Secure client dashboards with isolated data, custom branding, and real-time case tracking for each organization.',
    color: 'from-accent-rose to-accent-violet',
  },
  {
    icon: Zap,
    title: 'Automated Task Execution',
    description: 'Create, assign, and track AI-driven tasks with automated workflows, approval chains, and execution logging.',
    color: 'from-primary-500 to-accent-emerald',
  },
]

const stats = [
  { value: '99.9%', label: 'System Uptime' },
  { value: '2.5s', label: 'Avg Response Time' },
  { value: '97.3%', label: 'AI Accuracy' },
  { value: '50K+', label: 'Tasks Completed' },
]

const testimonials = [
  {
    quote: 'Giondraga AI Command Center transformed our legal operations. Contract review time reduced by 80% while maintaining accuracy.',
    author: 'Sarah Chen',
    role: 'General Counsel, PT Maju Jaya',
  },
  {
    quote: 'The multi-tenant architecture allows us to serve multiple clients securely with custom branding and isolated data.',
    author: 'Michael Park',
    role: 'Managing Partner, Giondraga & Partners',
  },
  {
    quote: 'Real-time compliance monitoring has saved us from multiple regulatory violations. The AI agents are incredibly reliable.',
    author: 'David Lim',
    role: 'Compliance Director, Global Finance Corp',
  },
]

export default function LandingPage() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-violet flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-text-primary">GIONDRAGA</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Features</a>
            <a href="#agents" className="text-sm text-text-secondary hover:text-text-primary transition-colors">AI Agents</a>
            <a href="#security" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Security</a>
            <a href="#pricing" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-text-secondary hover:text-text-primary transition-colors px-4 py-2">
              Sign In
            </Link>
            <Link href="/login" className="btn-primary text-sm">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
          <div className="absolute top-40 right-1/4 w-96 h-96 bg-accent-violet/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 mb-8">
              <Zap className="w-4 h-4 text-primary-400" />
              <span className="text-sm text-primary-400 font-medium">AI-Native Legal Operating System</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-text-primary mb-6 leading-tight">
              The Future of{' '}
              <span className="text-gradient">Legal Intelligence</span>
            </h1>

            <p className="text-lg text-text-muted mb-10 max-w-2xl mx-auto leading-relaxed">
              Enterprise AI command center for legal and business consulting. 
              Deploy specialized AI agents, monitor operations in real-time, 
              and deliver superior client outcomes with institutional-grade security.
            </p>

            <div className="flex items-center justify-center gap-4">
              <Link href="/login" className="btn-primary text-base px-8 py-3 flex items-center gap-2">
                Launch Command Center
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="btn-secondary text-base px-8 py-3 flex items-center gap-2">
                <Play className="w-5 h-5" />
                Watch Demo
              </button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map((stat, i) => (
              <div key={i} className="glass-panel p-6 text-center">
                <p className="text-3xl font-bold text-text-primary mb-1">{stat.value}</p>
                <p className="text-sm text-text-muted">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Everything You Need to{' '}
              <span className="text-gradient">Run Legal Operations</span>
            </h2>
            <p className="text-text-muted max-w-2xl mx-auto">
              A complete suite of AI-powered tools designed for modern legal and consulting firms.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  onMouseEnter={() => setHoveredFeature(i)}
                  onMouseLeave={() => setHoveredFeature(null)}
                  className={cn(
                    'glass-panel p-6 card-hover relative overflow-hidden',
                    hoveredFeature === i && 'border-primary-500/30'
                  )}
                >
                  <div className={cn('w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4', feature.color)}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">{feature.title}</h3>
                  <p className="text-sm text-text-muted leading-relaxed">{feature.description}</p>

                  {hoveredFeature === i && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute bottom-4 right-4"
                    >
                      <ChevronRight className="w-5 h-5 text-primary-400" />
                    </motion.div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* AI Agents Section */}
      <section id="agents" className="py-20 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-500/5 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Specialized <span className="text-gradient">AI Agents</span>
            </h2>
            <p className="text-text-muted max-w-2xl mx-auto">
              Each agent is trained and optimized for specific legal and business domains.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Lexi', type: 'Legal Analyst', icon: Shield, color: 'from-primary-500 to-accent-cyan', desc: 'Contract analysis, legal research, risk assessment, and compliance checking.' },
              { name: 'Research', type: 'Intelligence Agent', icon: Globe, color: 'from-accent-violet to-accent-cyan', desc: 'Deep research across legal databases, case law, regulatory updates, and market intelligence.' },
              { name: 'TechGuard', type: 'IT Security Agent', icon: Lock, color: 'from-accent-emerald to-primary-500', desc: 'Cybersecurity audits, vulnerability scans, compliance checks, and incident response.' },
              { name: 'Compliance', type: 'RegWatch', icon: CheckCircle, color: 'from-accent-amber to-accent-rose', desc: 'Regulatory tracking, compliance mapping, gap analysis, and audit preparation.' },
              { name: 'Exec', type: 'Executive Summary', icon: BarChart3, color: 'from-accent-rose to-accent-violet', desc: 'Executive summaries, strategic insights, board-ready reports, and KPI tracking.' },
              { name: 'Custom', type: 'ContractBot', icon: Cpu, color: 'from-primary-500 to-accent-emerald', desc: 'Custom-trained agents for specific contract types and client requirements.' },
            ].map((agent, i) => {
              const Icon = agent.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="glass-panel p-6 card-hover"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className={cn('w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center', agent.color)}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-text-primary">{agent.name}</h3>
                      <p className="text-xs text-text-muted">{agent.type}</p>
                    </div>
                  </div>
                  <p className="text-sm text-text-muted leading-relaxed">{agent.desc}</p>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent-emerald animate-pulse" />
                    <span className="text-xs text-accent-emerald font-medium">Available</span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-6">
                Enterprise-Grade <span className="text-gradient">Security & Compliance</span>
              </h2>
              <p className="text-text-muted mb-8 leading-relaxed">
                Built for institutions that demand the highest standards of data protection, 
                access control, and regulatory compliance.
              </p>

              <div className="space-y-4">
                {[
                  'End-to-end encryption for all data at rest and in transit',
                  'Multi-tenant architecture with complete data isolation',
                  'Role-based access control (RBAC) with granular permissions',
                  'Comprehensive audit logging and activity tracking',
                  'SOC 2 Type II, ISO 27001, and GDPR compliant',
                  'SSO integration with SAML 2.0 and OAuth 2.0',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-accent-emerald flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-text-secondary">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-accent-violet/20 rounded-2xl blur-2xl" />
              <div className="glass-panel p-8 relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-primary-400" />
                    <span className="text-sm font-semibold text-text-primary">Security Dashboard</span>
                  </div>
                  <span className="badge-success text-xs">Secure</span>
                </div>

                <div className="space-y-4">
                  {[
                    { label: 'Encryption', value: 'AES-256', status: 'Active' },
                    { label: 'Access Control', value: 'RBAC', status: 'Active' },
                    { label: 'Audit Logging', value: 'Real-time', status: 'Active' },
                    { label: 'Data Isolation', value: 'Tenant-level', status: 'Active' },
                    { label: 'Compliance', value: 'SOC 2', status: 'Certified' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-surface-hover">
                      <div>
                        <p className="text-sm text-text-secondary">{item.label}</p>
                        <p className="text-xs text-text-muted">{item.value}</p>
                      </div>
                      <span className="badge-success text-xs">{item.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Trusted by <span className="text-gradient">Leading Firms</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="glass-panel p-6"
              >
                <MessageSquare className="w-8 h-8 text-primary-400/50 mb-4" />
                <p className="text-sm text-text-secondary mb-6 leading-relaxed">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-violet flex items-center justify-center">
                    <span className="text-sm font-bold text-white">{t.author.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">{t.author}</p>
                    <p className="text-xs text-text-muted">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-panel p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-accent-violet/10" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                Ready to Transform Your Legal Operations?
              </h2>
              <p className="text-text-muted mb-8 max-w-xl mx-auto">
                Join leading firms using Giondraga AI Command Center to deliver superior legal services at scale.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Link href="/login" className="btn-primary text-base px-8 py-3">
                  Get Started Free
                </Link>
                <button className="btn-secondary text-base px-8 py-3">
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded bg-gradient-to-br from-primary-500 to-accent-violet flex items-center justify-center">
                  <Shield className="w-3 h-3 text-white" />
                </div>
                <span className="font-bold text-text-primary">GIONDRAGA</span>
              </div>
              <p className="text-xs text-text-muted leading-relaxed">
                AI-native legal operating system for modern consulting firms.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-text-primary mb-3">Product</h4>
              <div className="space-y-2">
                <a href="#" className="block text-xs text-text-muted hover:text-text-primary transition-colors">Features</a>
                <a href="#" className="block text-xs text-text-muted hover:text-text-primary transition-colors">AI Agents</a>
                <a href="#" className="block text-xs text-text-muted hover:text-text-primary transition-colors">Security</a>
                <a href="#" className="block text-xs text-text-muted hover:text-text-primary transition-colors">Pricing</a>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-text-primary mb-3">Company</h4>
              <div className="space-y-2">
                <a href="#" className="block text-xs text-text-muted hover:text-text-primary transition-colors">About</a>
                <a href="#" className="block text-xs text-text-muted hover:text-text-primary transition-colors">Careers</a>
                <a href="#" className="block text-xs text-text-muted hover:text-text-primary transition-colors">Blog</a>
                <a href="#" className="block text-xs text-text-muted hover:text-text-primary transition-colors">Contact</a>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-text-primary mb-3">Legal</h4>
              <div className="space-y-2">
                <a href="#" className="block text-xs text-text-muted hover:text-text-primary transition-colors">Privacy Policy</a>
                <a href="#" className="block text-xs text-text-muted hover:text-text-primary transition-colors">Terms of Service</a>
                <a href="#" className="block text-xs text-text-muted hover:text-text-primary transition-colors">Cookie Policy</a>
                <a href="#" className="block text-xs text-text-muted hover:text-text-primary transition-colors">Compliance</a>
              </div>
            </div>
          </div>
          <div className="border-t border-border pt-8 flex items-center justify-between">
            <p className="text-xs text-text-muted">
              © 2024 Giondraga & Partners. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Globe className="w-4 h-4 text-text-muted" />
              <span className="text-xs text-text-muted">English (US)</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}
