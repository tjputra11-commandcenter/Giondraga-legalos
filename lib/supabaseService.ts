import { createBrowserSupabaseClient, createAdminClient } from './supabase'
import { AIAgent, Task, Document, Notification, Report, ActivityLog, Client, Case, DashboardMetrics, User } from '@/types'

// ==================== TENANT SERVICE ====================
export async function getTenant(tenantId: string) {
  const supabase = createBrowserSupabaseClient()
  const { data, error } = await supabase
    .from('tenants')
    .select('*')
    .eq('id', tenantId)
    .single()
  if (error) throw error
  return data
}

export async function getUserTenants(userId: string) {
  const supabase = createBrowserSupabaseClient()
  const { data, error } = await supabase
    .from('tenant_memberships')
    .select(`
      *,
      tenant:tenants(*)
    `)
    .eq('user_id', userId)
  if (error) throw error
  return data
}

// ==================== PROFILE / AUTH SERVICE ====================
export async function getProfile(userId: string) {
  const supabase = createBrowserSupabaseClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) throw error
  return data
}

export async function updateProfile(userId: string, updates: Partial<User>) {
  const supabase = createBrowserSupabaseClient()
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  if (error) throw error
  return data
}

// ==================== AI AGENTS SERVICE ====================
export async function getAgents(tenantId: string) {
  const supabase = createBrowserSupabaseClient()
  const { data, error } = await supabase
    .from('ai_agents')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as AIAgent[]
}

export async function getAgentById(agentId: string) {
  const supabase = createBrowserSupabaseClient()
  const { data, error } = await supabase
    .from('ai_agents')
    .select('*')
    .eq('id', agentId)
    .single()
  if (error) throw error
  return data as AIAgent
}

export async function createAgent(agent: Partial<AIAgent>) {
  const supabase = createBrowserSupabaseClient()
  const { data, error } = await supabase
    .from('ai_agents')
    .insert(agent)
    .select()
    .single()
  if (error) throw error
  return data as AIAgent
}

export async function updateAgentStatus(agentId: string, status: AIAgent['status']) {
  const supabase = createBrowserSupabaseClient()
  const { data, error } = await supabase
    .from('ai_agents')
    .update({ status, last_active_at: new Date().toISOString() })
    .eq('id', agentId)
    .select()
    .single()
  if (error) throw error
  return data as AIAgent
}

export async function deleteAgent(agentId: string) {
  const supabase = createBrowserSupabaseClient()
  const { error } = await supabase
    .from('ai_agents')
    .delete()
    .eq('id', agentId)
  if (error) throw error
}

// Subscribe to agent changes (Realtime)
export function subscribeToAgents(tenantId: string, callback: (payload: any) => void) {
  const supabase = createBrowserSupabaseClient()
  return supabase
    .channel('agents-channel')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'ai_agents', filter: `tenant_id=eq.${tenantId}` },
      callback
    )
    .subscribe()
}

// ==================== TASKS SERVICE ====================
export async function getTasks(tenantId: string, options?: { status?: string; priority?: string; limit?: number }) {
  const supabase = createBrowserSupabaseClient()
  let query = supabase
    .from('tasks')
    .select(`
      *,
      agent:ai_agents(id, name, type)
    `)
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })

  if (options?.status) query = query.eq('status', options.status)
  if (options?.priority) query = query.eq('priority', options.priority)
  if (options?.limit) query = query.limit(options.limit)

  const { data, error } = await query
  if (error) throw error
  return data as Task[]
}

export async function getTaskById(taskId: string) {
  const supabase = createBrowserSupabaseClient()
  const { data, error } = await supabase
    .from('tasks')
    .select(`
      *,
      agent:ai_agents(id, name, type),
      client:clients(id, name),
      case:cases(id, title)
    `)
    .eq('id', taskId)
    .single()
  if (error) throw error
  return data as Task
}

export async function createTask(task: Partial<Task>) {
  const supabase = createBrowserSupabaseClient()
  const { data, error } = await supabase
    .from('tasks')
    .insert(task)
    .select()
    .single()
  if (error) throw error
  return data as Task
}

export async function updateTask(taskId: string, updates: Partial<Task>) {
  const supabase = createBrowserSupabaseClient()
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', taskId)
    .select()
    .single()
  if (error) throw error
  return data as Task
}

export async function deleteTask(taskId: string) {
  const supabase = createBrowserSupabaseClient()
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId)
  if (error) throw error
}

// Subscribe to task changes
export function subscribeToTasks(tenantId: string, callback: (payload: any) => void) {
  const supabase = createBrowserSupabaseClient()
  return supabase
    .channel('tasks-channel')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'tasks', filter: `tenant_id=eq.${tenantId}` },
      callback
    )
    .subscribe()
}

// ==================== DOCUMENTS SERVICE ====================
export async function getDocuments(tenantId: string, options?: { folder?: string; status?: string; limit?: number }) {
  const supabase = createBrowserSupabaseClient()
  let query = supabase
    .from('documents')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })

  if (options?.folder) query = query.eq('folder', options.folder)
  if (options?.status) query = query.eq('status', options.status)
  if (options?.limit) query = query.limit(options.limit)

  const { data, error } = await query
  if (error) throw error
  return data as Document[]
}

export async function createDocument(document: Partial<Document>) {
  const supabase = createBrowserSupabaseClient()
  const { data, error } = await supabase
    .from('documents')
    .insert(document)
    .select()
    .single()
  if (error) throw error
  return data as Document
}

export async function updateDocument(documentId: string, updates: Partial<Document>) {
  const supabase = createBrowserSupabaseClient()
  const { data, error } = await supabase
    .from('documents')
    .update(updates)
    .eq('id', documentId)
    .select()
    .single()
  if (error) throw error
  return data as Document
}

// Upload file to Supabase Storage
export async function uploadDocument(file: File, tenantId: string, folder: string = 'General') {
  const supabase = createBrowserSupabaseClient()
  const filePath = `${tenantId}/${folder}/${Date.now()}_${file.name}`

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('documents')
    .upload(filePath, file, { upsert: false })

  if (uploadError) throw uploadError

  // Create document record
  const { data, error } = await supabase
    .from('documents')
    .insert({
      name: file.name,
      file_path: uploadData.path,
      file_type: file.type,
      file_size: file.size,
      status: 'processing',
      tenant_id: tenantId,
      folder,
    })
    .select()
    .single()

  if (error) throw error
  return data as Document
}

// ==================== CLIENTS SERVICE ====================
export async function getClients(tenantId: string, options?: { status?: string; industry?: string; limit?: number }) {
  const supabase = createBrowserSupabaseClient()
  let query = supabase
    .from('clients')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })

  if (options?.status) query = query.eq('status', options.status)
  if (options?.industry) query = query.eq('industry', options.industry)
  if (options?.limit) query = query.limit(options.limit)

  const { data, error } = await query
  if (error) throw error
  return data as Client[]
}

export async function getClientById(clientId: string) {
  const supabase = createBrowserSupabaseClient()
  const { data, error } = await supabase
    .from('clients')
    .select(`
      *,
      cases:cases(*),
      documents:documents(*)
    `)
    .eq('id', clientId)
    .single()
  if (error) throw error
  return data as Client
}

export async function createClient(client: Partial<Client>) {
  const supabase = createBrowserSupabaseClient()
  const { data, error } = await supabase
    .from('clients')
    .insert(client)
    .select()
    .single()
  if (error) throw error
  return data as Client
}

export async function updateClient(clientId: string, updates: Partial<Client>) {
  const supabase = createBrowserSupabaseClient()
  const { data, error } = await supabase
    .from('clients')
    .update(updates)
    .eq('id', clientId)
    .select()
    .single()
  if (error) throw error
  return data as Client
}

// ==================== CASES SERVICE ====================
export async function getCases(tenantId: string, options?: { status?: string; clientId?: string; limit?: number }) {
  const supabase = createBrowserSupabaseClient()
  let query = supabase
    .from('cases')
    .select(`
      *,
      client:clients(id, name, company),
      assigned_lawyer:profiles(id, full_name)
    `)
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })

  if (options?.status) query = query.eq('status', options.status)
  if (options?.clientId) query = query.eq('client_id', options.clientId)
  if (options?.limit) query = query.limit(options.limit)

  const { data, error } = await query
  if (error) throw error
  return data as Case[]
}

export async function getCaseById(caseId: string) {
  const supabase = createBrowserSupabaseClient()
  const { data, error } = await supabase
    .from('cases')
    .select(`
      *,
      client:clients(*),
      assigned_lawyer:profiles(id, full_name, email),
      documents:documents(*),
      tasks:tasks(*)
    `)
    .eq('id', caseId)
    .single()
  if (error) throw error
  return data as Case
}

export async function createCase(caseData: Partial<Case>) {
  const supabase = createBrowserSupabaseClient()
  const { data, error } = await supabase
    .from('cases')
    .insert(caseData)
    .select()
    .single()
  if (error) throw error
  return data as Case
}

// ==================== REPORTS SERVICE ====================
export async function getReports(tenantId: string, options?: { type?: string; status?: string; limit?: number }) {
  const supabase = createBrowserSupabaseClient()
  let query = supabase
    .from('reports')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })

  if (options?.type) query = query.eq('type', options.type)
  if (options?.status) query = query.eq('status', options.status)
  if (options?.limit) query = query.limit(options.limit)

  const { data, error } = await query
  if (error) throw error
  return data as Report[]
}

export async function createReport(report: Partial<Report>) {
  const supabase = createBrowserSupabaseClient()
  const { data, error } = await supabase
    .from('reports')
    .insert(report)
    .select()
    .single()
  if (error) throw error
  return data as Report
}

// ==================== NOTIFICATIONS SERVICE ====================
export async function getNotifications(userId: string, options?: { unreadOnly?: boolean; limit?: number }) {
  const supabase = createBrowserSupabaseClient()
  let query = supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (options?.unreadOnly) query = query.eq('read', false)
  if (options?.limit) query = query.limit(options.limit)

  const { data, error } = await query
  if (error) throw error
  return data as Notification[]
}

export async function markNotificationRead(notificationId: string) {
  const supabase = createBrowserSupabaseClient()
  const { data, error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId)
    .select()
    .single()
  if (error) throw error
  return data as Notification
}

export async function markAllNotificationsRead(userId: string) {
  const supabase = createBrowserSupabaseClient()
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('user_id', userId)
    .eq('read', false)
  if (error) throw error
}

export async function createNotification(notification: Partial<Notification>) {
  const supabase = createBrowserSupabaseClient()
  const { data, error } = await supabase
    .from('notifications')
    .insert(notification)
    .select()
    .single()
  if (error) throw error
  return data as Notification
}

// Subscribe to notifications
export function subscribeToNotifications(userId: string, callback: (payload: any) => void) {
  const supabase = createBrowserSupabaseClient()
  return supabase
    .channel('notifications-channel')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` },
      callback
    )
    .subscribe()
}

// ==================== ACTIVITY LOGS SERVICE ====================
export async function getActivityLogs(tenantId: string, options?: { limit?: number; severity?: string }) {
  const supabase = createBrowserSupabaseClient()
  let query = supabase
    .from('activity_logs')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })

  if (options?.severity) query = query.eq('severity', options.severity)
  if (options?.limit) query = query.limit(options.limit)

  const { data, error } = await query
  if (error) throw error
  return data as ActivityLog[]
}

// ==================== DASHBOARD METRICS ====================
export async function getDashboardMetrics(tenantId: string): Promise<DashboardMetrics> {
  const supabase = createBrowserSupabaseClient()

  // Get counts in parallel
  const [
    { data: agents },
    { data: tasks },
    { data: documents },
    { data: clients },
  ] = await Promise.all([
    supabase.from('ai_agents').select('id, status').eq('tenant_id', tenantId),
    supabase.from('tasks').select('id, status').eq('tenant_id', tenantId),
    supabase.from('documents').select('id, status').eq('tenant_id', tenantId),
    supabase.from('clients').select('id, status').eq('tenant_id', tenantId),
  ])

  const activeAgents = agents?.filter(a => a.status === 'active').length || 0
  const totalAgents = agents?.length || 0
  const completedTasks = tasks?.filter(t => t.status === 'completed').length || 0
  const totalTasks = tasks?.length || 0
  const processedDocs = documents?.filter(d => d.status === 'completed').length || 0
  const totalDocs = documents?.length || 0

  return {
    totalAgents,
    activeAgents,
    totalTasks,
    completedTasks,
    pendingTasks: tasks?.filter(t => t.status === 'pending').length || 0,
    totalDocuments: totalDocs,
    processedDocuments: processedDocs,
    avgResponseTime: 1.8,
    systemUptime: 99.7,
    tokenUsage: 12840000,
    costEstimate: 642.00,
    tasksByAgent: [],
    tasksByStatus: [
      { status: 'completed', count: completedTasks },
      { status: 'running', count: tasks?.filter(t => t.status === 'running').length || 0 },
      { status: 'pending', count: tasks?.filter(t => t.status === 'pending').length || 0 },
      { status: 'failed', count: tasks?.filter(t => t.status === 'failed').length || 0 },
      { status: 'cancelled', count: tasks?.filter(t => t.status === 'cancelled').length || 0 },
    ],
    tasksOverTime: [],
    agentPerformance: [],
  }
}

// ==================== AUTH HELPERS ====================
export async function signUp(email: string, password: string, metadata?: { full_name?: string; role?: string; tenant_id?: string }) {
  const supabase = createBrowserSupabaseClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  })
  if (error) throw error
  return data
}

export async function signIn(email: string, password: string) {
  const supabase = createBrowserSupabaseClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) throw error
  return data
}

export async function signOut() {
  const supabase = createBrowserSupabaseClient()
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getSession() {
  const supabase = createBrowserSupabaseClient()
  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  return data.session
}

export async function getUser() {
  const supabase = createBrowserSupabaseClient()
  const { data, error } = await supabase.auth.getUser()
  if (error) throw error
  return data.user
}

export function onAuthStateChange(callback: (event: string, session: any) => void) {
  const supabase = createBrowserSupabaseClient()
  return supabase.auth.onAuthStateChange(callback)
}

export async function resetPassword(email: string) {
  const supabase = createBrowserSupabaseClient()
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  })
  if (error) throw error
  return data
}

export async function updatePassword(newPassword: string) {
  const supabase = createBrowserSupabaseClient()
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  })
  if (error) throw error
  return data
}
