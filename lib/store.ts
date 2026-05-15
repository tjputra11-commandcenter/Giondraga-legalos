import { create } from 'zustand'
import { AIAgent, Task, Document, Notification, Report, ActivityLog, Client, Case, DashboardMetrics } from '@/types'
import {
  getAgents,
  getTasks,
  getDocuments,
  getNotifications,
  getReports,
  getActivityLogs,
  getClients,
  getCases,
  getDashboardMetrics,
  getSession,
  getUser,
  onAuthStateChange,
  subscribeToAgents,
  subscribeToTasks,
  subscribeToNotifications,
} from './supabaseService'
import { mockAgents, mockTasks, mockDocuments, mockNotifications, mockReports, mockActivityLogs, mockClients, mockCases, mockDashboardMetrics } from './mockData'

interface AppState {
  // Auth
  user: any | null
  session: any | null
  isAuthenticated: boolean
  isLoading: boolean
  useRealData: boolean

  // Data
  agents: AIAgent[]
  tasks: Task[]
  documents: Document[]
  notifications: Notification[]
  reports: Report[]
  activityLogs: ActivityLog[]
  clients: Client[]
  cases: Case[]
  metrics: DashboardMetrics
  tenantId: string

  // Actions
  initAuth: () => Promise<void>
  setUser: (user: any) => void
  setSession: (session: any) => void
  logout: () => Promise<void>
  toggleDataSource: () => void

  // Data Actions
  loadAgents: () => Promise<void>
  loadTasks: () => Promise<void>
  loadDocuments: () => Promise<void>
  loadNotifications: () => Promise<void>
  loadReports: () => Promise<void>
  loadActivityLogs: () => Promise<void>
  loadClients: () => Promise<void>
  loadCases: () => Promise<void>
  loadMetrics: () => Promise<void>
  loadAllData: () => Promise<void>

  markNotificationRead: (id: string) => void
  markAllNotificationsRead: () => void
  addTask: (task: Task) => void
  updateTask: (task: Task) => void
  addDocument: (doc: Document) => void
  updateDocument: (doc: Document) => void
  updateAgentStatus: (id: string, status: AIAgent['status']) => void

  // Realtime subscriptions
  subscriptions: any[]
  setupRealtime: () => void
  cleanupRealtime: () => void

  // UI
  sidebarOpen: boolean
  toggleSidebar: () => void
  activePage: string
  setActivePage: (page: string) => void
}

const DEFAULT_TENANT_ID = '550e8400-e29b-41d4-a716-446655440000'

export const useStore = create<AppState>((set, get) => ({
  // Auth
  user: null,
  session: null,
  isAuthenticated: false,
  isLoading: true,
  useRealData: false, // Start with mock data, toggle to Supabase

  // Data - initialize with mock data
  agents: mockAgents,
  tasks: mockTasks,
  documents: mockDocuments,
  notifications: mockNotifications,
  reports: mockReports,
  activityLogs: mockActivityLogs,
  clients: mockClients,
  cases: mockCases,
  metrics: mockDashboardMetrics,
  tenantId: DEFAULT_TENANT_ID,

  // Auth Actions
  initAuth: async () => {
    try {
      const session = await getSession()
      if (session) {
        const user = await getUser()
        set({ user, session, isAuthenticated: true, isLoading: false })
        // Auto-load real data if authenticated
        await get().loadAllData()
      } else {
        set({ isLoading: false })
      }
    } catch (error) {
      console.log('Auth init failed, using demo mode:', error)
      set({ isLoading: false })
    }
  },

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setSession: (session) => set({ session }),

  logout: async () => {
    const { supabase } = await import('./supabase')
    await supabase.auth.signOut()
    set({
      user: null,
      session: null,
      isAuthenticated: false,
      // Reset to mock data
      agents: mockAgents,
      tasks: mockTasks,
      documents: mockDocuments,
      notifications: mockNotifications,
      reports: mockReports,
      activityLogs: mockActivityLogs,
      clients: mockClients,
      cases: mockCases,
      metrics: mockDashboardMetrics,
    })
  },

  toggleDataSource: () => {
    const newUseRealData = !get().useRealData
    set({ useRealData: newUseRealData })
    if (newUseRealData) {
      get().loadAllData()
    } else {
      // Reset to mock
      set({
        agents: mockAgents,
        tasks: mockTasks,
        documents: mockDocuments,
        notifications: mockNotifications,
        reports: mockReports,
        activityLogs: mockActivityLogs,
        clients: mockClients,
        cases: mockCases,
        metrics: mockDashboardMetrics,
      })
    }
  },

  // Data Loading Actions
  loadAgents: async () => {
    if (!get().useRealData) return
    try {
      const data = await getAgents(get().tenantId)
      if (data && data.length > 0) set({ agents: data })
    } catch (error) {
      console.error('Failed to load agents:', error)
    }
  },

  loadTasks: async () => {
    if (!get().useRealData) return
    try {
      const data = await getTasks(get().tenantId, { limit: 50 })
      if (data && data.length > 0) set({ tasks: data })
    } catch (error) {
      console.error('Failed to load tasks:', error)
    }
  },

  loadDocuments: async () => {
    if (!get().useRealData) return
    try {
      const data = await getDocuments(get().tenantId, { limit: 50 })
      if (data && data.length > 0) set({ documents: data })
    } catch (error) {
      console.error('Failed to load documents:', error)
    }
  },

  loadNotifications: async () => {
    if (!get().useRealData || !get().user) return
    try {
      const data = await getNotifications(get().user.id, { limit: 20 })
      if (data && data.length > 0) set({ notifications: data })
    } catch (error) {
      console.error('Failed to load notifications:', error)
    }
  },

  loadReports: async () => {
    if (!get().useRealData) return
    try {
      const data = await getReports(get().tenantId, { limit: 20 })
      if (data && data.length > 0) set({ reports: data })
    } catch (error) {
      console.error('Failed to load reports:', error)
    }
  },

  loadActivityLogs: async () => {
    if (!get().useRealData) return
    try {
      const data = await getActivityLogs(get().tenantId, { limit: 50 })
      if (data && data.length > 0) set({ activityLogs: data })
    } catch (error) {
      console.error('Failed to load activity logs:', error)
    }
  },

  loadClients: async () => {
    if (!get().useRealData) return
    try {
      const data = await getClients(get().tenantId, { limit: 50 })
      if (data && data.length > 0) set({ clients: data })
    } catch (error) {
      console.error('Failed to load clients:', error)
    }
  },

  loadCases: async () => {
    if (!get().useRealData) return
    try {
      const data = await getCases(get().tenantId, { limit: 50 })
      if (data && data.length > 0) set({ cases: data })
    } catch (error) {
      console.error('Failed to load cases:', error)
    }
  },

  loadMetrics: async () => {
    if (!get().useRealData) return
    try {
      const data = await getDashboardMetrics(get().tenantId)
      if (data) set({ metrics: data })
    } catch (error) {
      console.error('Failed to load metrics:', error)
    }
  },

  loadAllData: async () => {
    if (!get().useRealData) {
      set({ useRealData: true })
    }
    await Promise.all([
      get().loadAgents(),
      get().loadTasks(),
      get().loadDocuments(),
      get().loadNotifications(),
      get().loadReports(),
      get().loadActivityLogs(),
      get().loadClients(),
      get().loadCases(),
      get().loadMetrics(),
    ])
  },

  // Local state actions (work with both mock and real)
  markNotificationRead: (id) => set((state) => ({
    notifications: state.notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    ),
  })),

  markAllNotificationsRead: () => set((state) => ({
    notifications: state.notifications.map((n) => ({ ...n, read: true })),
  })),

  addTask: (task) => set((state) => ({ tasks: [task, ...state.tasks] })),
  updateTask: (task) => set((state) => ({
    tasks: state.tasks.map((t) => (t.id === task.id ? task : t)),
  })),

  addDocument: (doc) => set((state) => ({ documents: [doc, ...state.documents] })),
  updateDocument: (doc) => set((state) => ({
    documents: state.documents.map((d) => (d.id === doc.id ? doc : d)),
  })),

  updateAgentStatus: (id, status) => set((state) => ({
    agents: state.agents.map((a) =>
      a.id === id ? { ...a, status, lastActive: new Date().toISOString() } : a
    ),
  })),

  // Realtime
  subscriptions: [],
  setupRealtime: () => {
    const { tenantId, user } = get()
    if (!tenantId || !get().useRealData) return

    const subs: any[] = []

    // Subscribe to agents
    const agentSub = subscribeToAgents(tenantId, (payload) => {
      get().loadAgents()
    })
    subs.push(agentSub)

    // Subscribe to tasks
    const taskSub = subscribeToTasks(tenantId, (payload) => {
      get().loadTasks()
    })
    subs.push(taskSub)

    // Subscribe to notifications
    if (user?.id) {
      const notifSub = subscribeToNotifications(user.id, (payload) => {
        get().loadNotifications()
      })
      subs.push(notifSub)
    }

    set({ subscriptions: subs })
  },

  cleanupRealtime: () => {
    const { subscriptions } = get()
    subscriptions.forEach((sub) => sub.unsubscribe())
    set({ subscriptions: [] })
  },

  // UI
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  activePage: 'dashboard',
  setActivePage: (page) => set({ activePage: page }),
}))
