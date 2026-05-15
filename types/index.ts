export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'client' | 'consultant';
  avatar?: string;
  organization?: string;
  tenantId: string;
  createdAt: string;
  lastLogin?: string;
}

export interface Tenant {
  id: string;
  name: string;
  domain: string;
  plan: 'basic' | 'professional' | 'enterprise';
  status: 'active' | 'suspended' | 'pending';
  maxUsers: number;
  maxAgents: number;
  createdAt: string;
  settings: TenantSettings;
}

export interface TenantSettings {
  branding: {
    primaryColor: string;
    logo?: string;
    favicon?: string;
  };
  features: {
    aiAgents: boolean;
    documentAnalysis: boolean;
    legalResearch: boolean;
    compliance: boolean;
    apiAccess: boolean;
  };
  notifications: {
    email: boolean;
    slack: boolean;
    webhook?: string;
  };
}

export interface AIAgent {
  id: string;
  name: string;
  type: 'legal' | 'research' | 'it' | 'compliance' | 'executive' | 'custom';
  status: 'active' | 'idle' | 'offline' | 'error';
  description: string;
  capabilities: string[];
  lastActive: string;
  tasksCompleted: number;
  accuracy: number;
  responseTime: number;
  tenantId: string;
  config: AgentConfig;
  metrics: AgentMetrics;
}

export interface AgentConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  tools: string[];
  autoExecute: boolean;
  approvalRequired: boolean;
}

export interface AgentMetrics {
  totalRequests: number;
  avgResponseTime: number;
  successRate: number;
  tokensUsed: number;
  costEstimate: number;
  uptime: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  agentId: string;
  agentName: string;
  tenantId: string;
  createdBy: string;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  duration?: number;
  result?: string;
  error?: string;
  metadata?: Record<string, any>;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  tenantId: string;
  uploadedBy: string;
  uploadedAt: string;
  processedAt?: string;
  extractedData?: Record<string, any>;
  summary?: string;
  tags: string[];
  folder?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
  link?: string;
  tenantId: string;
}

export interface Report {
  id: string;
  title: string;
  type: 'executive' | 'legal' | 'compliance' | 'performance' | 'custom';
  status: 'draft' | 'generating' | 'completed' | 'error';
  tenantId: string;
  createdBy: string;
  createdAt: string;
  completedAt?: string;
  content?: string;
  summary?: string;
  metrics?: Record<string, number>;
  aiGenerated: boolean;
}

export interface DashboardMetrics {
  totalAgents: number;
  activeAgents: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  totalDocuments: number;
  processedDocuments: number;
  avgResponseTime: number;
  systemUptime: number;
  tokenUsage: number;
  costEstimate: number;
  tasksByAgent: { agentId: string; agentName: string; count: number }[];
  tasksByStatus: { status: string; count: number }[];
  tasksOverTime: { date: string; count: number }[];
  agentPerformance: { agentId: string; agentName: string; accuracy: number; speed: number; load: number }[];
}

export interface ActivityLog {
  id: string;
  action: string;
  entityType: 'agent' | 'task' | 'document' | 'user' | 'report' | 'system';
  entityId: string;
  entityName: string;
  userId: string;
  userName: string;
  tenantId: string;
  timestamp: string;
  details?: Record<string, any>;
  severity: 'info' | 'warning' | 'error';
}

export interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  industry: string;
  status: 'active' | 'inactive' | 'pending';
  tenantId: string;
  assignedConsultant?: string;
  totalCases: number;
  openCases: number;
  lastContact: string;
  createdAt: string;
  notes?: string;
}

export interface Case {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'review' | 'closed' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'critical';
  type: 'legal' | 'compliance' | 'consulting' | 'it' | 'research';
  clientId: string;
  clientName: string;
  tenantId: string;
  assignedTo?: string;
  assignedAgent?: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  documents: string[];
  tasks: string[];
  notes?: string;
}
