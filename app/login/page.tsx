'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Shield,
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  Github,
  Chrome,
  AlertCircle,
  CheckCircle,
} from 'lucide-react'
import { useStore } from '@/lib/store'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  const { setUser } = useStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    setTimeout(() => {
      if (email && password) {
        setUser({
          id: 'user-1',
          email,
          name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
          role: 'admin',
          tenantId: 'tenant-1',
        })
        window.location.href = '/dashboard'
      } else {
        setError('Please enter both email and password')
      }
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-violet/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-violet flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-xl font-bold text-text-primary">GIONDRAGA</h1>
              <p className="text-xs text-text-muted">AI Command Center</p>
            </div>
          </Link>
          <h2 className="text-2xl font-bold text-text-primary mb-2">Welcome back</h2>
          <p className="text-sm text-text-muted">Sign in to access your command center</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-panel p-8"
        >
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-accent-rose/10 border border-accent-rose/20 flex items-center gap-2 text-sm text-accent-rose">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sarah.chen@giondraga.com"
                  className="input-dark w-full pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="input-dark w-full pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-border bg-surface text-primary-500 focus:ring-primary-500/20"
                />
                <span className="text-sm text-text-secondary">Remember me</span>
              </label>
              <Link href="#" className="text-sm text-primary-400 hover:text-primary-300 transition-colors">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-surface-elevated text-text-muted">Or continue with</span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button className="btn-secondary flex items-center justify-center gap-2 text-sm">
                <Github className="w-4 h-4" />
                GitHub
              </button>
              <button className="btn-secondary flex items-center justify-center gap-2 text-sm">
                <Chrome className="w-4 h-4" />
                Google
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6 flex items-center justify-center gap-2 text-xs text-text-muted"
        >
          <Lock className="w-3 h-3" />
          <span>Secured with AES-256 encryption</span>
          <span className="mx-1">•</span>
          <span>SOC 2 Compliant</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-4 p-4 rounded-lg bg-surface-hover border border-border"
        >
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-accent-emerald" />
            <span className="text-xs font-medium text-text-secondary">Demo Credentials</span>
          </div>
          <div className="space-y-1 text-xs text-text-muted">
            <p>Email: <span className="text-text-secondary">sarah.chen@giondraga.com</span></p>
            <p>Password: <span className="text-text-secondary">any password works</span></p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
