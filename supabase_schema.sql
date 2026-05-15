-- ============================================================
-- GIONDRAGA LEGALOS - PRODUCTION DATABASE SCHEMA
-- Multi-tenant AI-native legal operating system
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 1. TENANTS (Organizations)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  domain TEXT,
  plan TEXT NOT NULL DEFAULT 'basic' CHECK (plan IN ('basic', 'professional', 'enterprise')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending')),
  max_users INTEGER NOT NULL DEFAULT 5,
  max_agents INTEGER NOT NULL DEFAULT 3,
  primary_color TEXT DEFAULT '#3b82f6',
  logo_url TEXT,
  favicon_url TEXT,
  settings JSONB DEFAULT '{}',
  billing_email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- 2. PROFILES (Extended user data linked to auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('admin', 'lawyer', 'consultant', 'client', 'paralegal', 'manager')),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE SET NULL,
  department TEXT,
  phone TEXT,
  bio TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- 3. TENANT MEMBERSHIPS (User-to-tenant relationships with roles)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.tenant_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'lawyer', 'consultant', 'client', 'paralegal', 'viewer')),
  is_primary BOOLEAN DEFAULT FALSE,
  invited_by UUID REFERENCES auth.users(id),
  invited_at TIMESTAMPTZ,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(tenant_id, user_id)
);

-- ============================================================
-- 4. AI AGENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.ai_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('legal', 'research', 'it', 'compliance', 'executive', 'custom')),
  status TEXT NOT NULL DEFAULT 'idle' CHECK (status IN ('active', 'idle', 'offline', 'error', 'maintenance')),
  description TEXT,
  capabilities TEXT[] DEFAULT '{}',
  system_prompt TEXT,
  model TEXT DEFAULT 'gpt-4o',
  temperature NUMERIC(3,2) DEFAULT 0.3,
  max_tokens INTEGER DEFAULT 4096,
  tools TEXT[] DEFAULT '{}',
  auto_execute BOOLEAN DEFAULT FALSE,
  approval_required BOOLEAN DEFAULT TRUE,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  created_by UUID REFERENCES auth.users(id),
  last_active_at TIMESTAMPTZ,
  tasks_completed INTEGER DEFAULT 0,
  accuracy NUMERIC(5,2) DEFAULT 95.00,
  avg_response_time NUMERIC(5,2) DEFAULT 2.00,
  total_requests INTEGER DEFAULT 0,
  tokens_used INTEGER DEFAULT 0,
  cost_estimate NUMERIC(10,2) DEFAULT 0.00,
  uptime NUMERIC(5,2) DEFAULT 99.00,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- 5. TASKS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed', 'cancelled', 'paused')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  agent_id UUID REFERENCES public.ai_agents(id) ON DELETE SET NULL,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  assigned_to UUID REFERENCES auth.users(id),
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  case_id UUID REFERENCES public.cases(id) ON DELETE SET NULL,
  input_data JSONB DEFAULT '{}',
  result TEXT,
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  duration_seconds INTEGER,
  token_count INTEGER,
  cost NUMERIC(10,4),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- 6. DOCUMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  file_path TEXT,
  file_type TEXT,
  file_size INTEGER,
  status TEXT NOT NULL DEFAULT 'uploading' CHECK (status IN ('uploading', 'processing', 'completed', 'error', 'archived')),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  uploaded_by UUID NOT NULL REFERENCES auth.users(id),
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  case_id UUID REFERENCES public.cases(id) ON DELETE SET NULL,
  folder TEXT DEFAULT 'General',
  extracted_data JSONB DEFAULT '{}',
  summary TEXT,
  tags TEXT[] DEFAULT '{}',
  ai_analysis JSONB DEFAULT '{}',
  version INTEGER DEFAULT 1,
  parent_document_id UUID REFERENCES public.documents(id),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- 7. CLIENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  industry TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending', 'suspended')),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  assigned_consultant_id UUID REFERENCES auth.users(id),
  assigned_lawyer_id UUID REFERENCES auth.users(id),
  address TEXT,
  city TEXT,
  country TEXT DEFAULT 'Indonesia',
  tax_id TEXT,
  registration_number TEXT,
  notes TEXT,
  total_cases INTEGER DEFAULT 0,
  open_cases INTEGER DEFAULT 0,
  total_value NUMERIC(15,2) DEFAULT 0,
  last_contact_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- 8. CASES (Legal Matters)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_number TEXT UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'review', 'closed', 'archived', 'on_hold')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  type TEXT NOT NULL DEFAULT 'legal' CHECK (type IN ('legal', 'compliance', 'consulting', 'it', 'research', 'litigation', 'corporate', 'ip')),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  assigned_lawyer_id UUID REFERENCES auth.users(id),
  assigned_consultant_id UUID REFERENCES auth.users(id),
  assigned_agent_id UUID REFERENCES public.ai_agents(id),
  practice_area TEXT,
  jurisdiction TEXT DEFAULT 'Indonesia',
  court_or_tribunal TEXT,
  opposing_party TEXT,
  estimated_value NUMERIC(15,2),
  retainer_amount NUMERIC(15,2),
  billing_type TEXT DEFAULT 'hourly' CHECK (billing_type IN ('hourly', 'fixed', 'contingency', 'retainer')),
  hourly_rate NUMERIC(10,2),
  start_date DATE,
  due_date DATE,
  closed_date DATE,
  outcome TEXT,
  documents UUID[] DEFAULT '{}',
  tasks UUID[] DEFAULT '{}',
  notes TEXT,
  is_confidential BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- 9. REPORTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('executive', 'legal', 'compliance', 'performance', 'financial', 'custom')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'generating', 'completed', 'error', 'archived')),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  case_id UUID REFERENCES public.cases(id) ON DELETE SET NULL,
  date_range_start DATE,
  date_range_end DATE,
  content TEXT,
  summary TEXT,
  metrics JSONB DEFAULT '{}',
  ai_generated BOOLEAN DEFAULT TRUE,
  template_used TEXT,
  shared_with UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- 10. NOTIFICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT,
  type TEXT NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error', 'system')),
  read BOOLEAN DEFAULT FALSE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  entity_type TEXT,
  entity_id UUID,
  link TEXT,
  action_taken BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- 11. ACTIVITY LOGS (Audit Trail)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('agent', 'task', 'document', 'user', 'report', 'client', 'case', 'system', 'tenant')),
  entity_id UUID,
  entity_name TEXT,
  user_id UUID REFERENCES auth.users(id),
  user_name TEXT,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  details JSONB DEFAULT '{}',
  severity TEXT DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'error', 'critical')),
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- 12. TIME ENTRIES (Billing)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.time_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  case_id UUID REFERENCES public.cases(id) ON DELETE SET NULL,
  task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  hourly_rate NUMERIC(10,2),
  total_amount NUMERIC(10,2),
  date DATE NOT NULL,
  is_billable BOOLEAN DEFAULT TRUE,
  is_billed BOOLEAN DEFAULT FALSE,
  invoice_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- 13. INVOICES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT UNIQUE NOT NULL,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  case_id UUID REFERENCES public.cases(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL,
  subtotal NUMERIC(15,2) NOT NULL DEFAULT 0,
  tax_rate NUMERIC(5,2) DEFAULT 11.00,
  tax_amount NUMERIC(15,2) DEFAULT 0,
  total_amount NUMERIC(15,2) NOT NULL DEFAULT 0,
  paid_amount NUMERIC(15,2) DEFAULT 0,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- 14. API KEYS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  key_hash TEXT NOT NULL,
  key_prefix TEXT NOT NULL,
  permissions JSONB DEFAULT '{}',
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- 15. WEBHOOKS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  events TEXT[] DEFAULT '{}',
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  secret TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  last_triggered_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- ============================================================
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhooks ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLS POLICIES - MULTI-TENANT SECURITY
-- ============================================================

-- Helper function: Check if user belongs to tenant
CREATE OR REPLACE FUNCTION public.has_tenant_access(p_tenant_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.tenant_memberships
    WHERE user_id = auth.uid()
    AND tenant_id = p_tenant_id
    AND is_active = TRUE
  );
$$;

-- Helper function: Check user role in tenant
CREATE OR REPLACE FUNCTION public.get_tenant_role(p_tenant_id UUID)
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT role FROM public.tenant_memberships
  WHERE user_id = auth.uid()
  AND tenant_id = p_tenant_id
  LIMIT 1;
$$;

-- Helper function: Check if user is admin or owner
CREATE OR REPLACE FUNCTION public.is_tenant_admin(p_tenant_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.tenant_memberships
    WHERE user_id = auth.uid()
    AND tenant_id = p_tenant_id
    AND role IN ('owner', 'admin')
  );
$$;

-- TENANTS: Users can only see their own tenant(s)
CREATE POLICY "tenant_select_own" ON public.tenants
  FOR SELECT TO authenticated
  USING (id IN (
    SELECT tenant_id FROM public.tenant_memberships WHERE user_id = auth.uid()
  ));

CREATE POLICY "tenant_update_admin" ON public.tenants
  FOR UPDATE TO authenticated
  USING (public.is_tenant_admin(id));

-- PROFILES: Users can view/update own profile, admins can view all in tenant
CREATE POLICY "profile_select_own" ON public.profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid() OR tenant_id IN (
    SELECT tenant_id FROM public.tenant_memberships WHERE user_id = auth.uid()
  ));

CREATE POLICY "profile_update_own" ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid());

-- TENANT MEMBERSHIPS: Members can view their memberships, admins can manage
CREATE POLICY "membership_select_own" ON public.tenant_memberships
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR tenant_id IN (
    SELECT tenant_id FROM public.tenant_memberships WHERE user_id = auth.uid()
  ));

CREATE POLICY "membership_insert_admin" ON public.tenant_memberships
  FOR INSERT TO authenticated
  WITH CHECK (public.is_tenant_admin(tenant_id));

CREATE POLICY "membership_update_admin" ON public.tenant_memberships
  FOR UPDATE TO authenticated
  USING (public.is_tenant_admin(tenant_id));

-- AI AGENTS: Tenant-scoped access
CREATE POLICY "agent_select_tenant" ON public.ai_agents
  FOR SELECT TO authenticated
  USING (tenant_id IN (
    SELECT tenant_id FROM public.tenant_memberships WHERE user_id = auth.uid()
  ) OR is_public = TRUE);

CREATE POLICY "agent_insert_admin" ON public.ai_agents
  FOR INSERT TO authenticated
  WITH CHECK (public.is_tenant_admin(tenant_id));

CREATE POLICY "agent_update_admin" ON public.ai_agents
  FOR UPDATE TO authenticated
  USING (public.is_tenant_admin(tenant_id));

CREATE POLICY "agent_delete_admin" ON public.ai_agents
  FOR DELETE TO authenticated
  USING (public.is_tenant_admin(tenant_id));

-- TASKS: Tenant-scoped with user assignment
CREATE POLICY "task_select_tenant" ON public.tasks
  FOR SELECT TO authenticated
  USING (tenant_id IN (
    SELECT tenant_id FROM public.tenant_memberships WHERE user_id = auth.uid()
  ));

CREATE POLICY "task_insert_tenant" ON public.tasks
  FOR INSERT TO authenticated
  WITH CHECK (tenant_id IN (
    SELECT tenant_id FROM public.tenant_memberships WHERE user_id = auth.uid()
  ));

CREATE POLICY "task_update_tenant" ON public.tasks
  FOR UPDATE TO authenticated
  USING (tenant_id IN (
    SELECT tenant_id FROM public.tenant_memberships WHERE user_id = auth.uid()
  ));

-- DOCUMENTS: Tenant-scoped
CREATE POLICY "document_select_tenant" ON public.documents
  FOR SELECT TO authenticated
  USING (tenant_id IN (
    SELECT tenant_id FROM public.tenant_memberships WHERE user_id = auth.uid()
  ));

CREATE POLICY "document_insert_tenant" ON public.documents
  FOR INSERT TO authenticated
  WITH CHECK (tenant_id IN (
    SELECT tenant_id FROM public.tenant_memberships WHERE user_id = auth.uid()
  ));

-- CLIENTS: Tenant-scoped
CREATE POLICY "client_select_tenant" ON public.clients
  FOR SELECT TO authenticated
  USING (tenant_id IN (
    SELECT tenant_id FROM public.tenant_memberships WHERE user_id = auth.uid()
  ));

CREATE POLICY "client_insert_tenant" ON public.clients
  FOR INSERT TO authenticated
  WITH CHECK (tenant_id IN (
    SELECT tenant_id FROM public.tenant_memberships WHERE user_id = auth.uid()
  ));

CREATE POLICY "client_update_tenant" ON public.clients
  FOR UPDATE TO authenticated
  USING (tenant_id IN (
    SELECT tenant_id FROM public.tenant_memberships WHERE user_id = auth.uid()
  ));

-- CASES: Tenant-scoped with confidentiality
CREATE POLICY "case_select_tenant" ON public.cases
  FOR SELECT TO authenticated
  USING (tenant_id IN (
    SELECT tenant_id FROM public.tenant_memberships WHERE user_id = auth.uid()
  ) AND (NOT is_confidential OR assigned_lawyer_id = auth.uid() OR public.is_tenant_admin(tenant_id)));

CREATE POLICY "case_insert_tenant" ON public.cases
  FOR INSERT TO authenticated
  WITH CHECK (tenant_id IN (
    SELECT tenant_id FROM public.tenant_memberships WHERE user_id = auth.uid()
  ));

-- REPORTS: Tenant-scoped
CREATE POLICY "report_select_tenant" ON public.reports
  FOR SELECT TO authenticated
  USING (tenant_id IN (
    SELECT tenant_id FROM public.tenant_memberships WHERE user_id = auth.uid()
  ) OR auth.uid() = ANY(shared_with));

CREATE POLICY "report_insert_tenant" ON public.reports
  FOR INSERT TO authenticated
  WITH CHECK (tenant_id IN (
    SELECT tenant_id FROM public.tenant_memberships WHERE user_id = auth.uid()
  ));

-- NOTIFICATIONS: User-specific
CREATE POLICY "notification_select_own" ON public.notifications
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "notification_update_own" ON public.notifications
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

-- ACTIVITY LOGS: Tenant-scoped
CREATE POLICY "activity_select_tenant" ON public.activity_logs
  FOR SELECT TO authenticated
  USING (tenant_id IN (
    SELECT tenant_id FROM public.tenant_memberships WHERE user_id = auth.uid()
  ));

-- TIME ENTRIES: Tenant-scoped
CREATE POLICY "time_select_tenant" ON public.time_entries
  FOR SELECT TO authenticated
  USING (tenant_id IN (
    SELECT tenant_id FROM public.tenant_memberships WHERE user_id = auth.uid()
  ));

-- INVOICES: Tenant-scoped
CREATE POLICY "invoice_select_tenant" ON public.invoices
  FOR SELECT TO authenticated
  USING (tenant_id IN (
    SELECT tenant_id FROM public.tenant_memberships WHERE user_id = auth.uid()
  ));

-- ============================================================
-- TRIGGERS & FUNCTIONS
-- ============================================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables
CREATE TRIGGER tenants_updated_at BEFORE UPDATE ON public.tenants
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER ai_agents_updated_at BEFORE UPDATE ON public.ai_agents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER tasks_updated_at BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER documents_updated_at BEFORE UPDATE ON public.documents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER clients_updated_at BEFORE UPDATE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER cases_updated_at BEFORE UPDATE ON public.cases
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER reports_updated_at BEFORE UPDATE ON public.reports
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER time_entries_updated_at BEFORE UPDATE ON public.time_entries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER invoices_updated_at BEFORE UPDATE ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'client')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Log activity trigger
CREATE OR REPLACE FUNCTION public.log_activity()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.activity_logs (action, entity_type, entity_id, tenant_id, user_id, details, severity)
  VALUES (
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    COALESCE(NEW.tenant_id, OLD.tenant_id),
    auth.uid(),
    jsonb_build_object('old', OLD, 'new', NEW),
    CASE TG_OP WHEN 'DELETE' THEN 'warning' ELSE 'info' END
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================
CREATE INDEX idx_profiles_tenant ON public.profiles(tenant_id);
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_tenant_memberships_user ON public.tenant_memberships(user_id);
CREATE INDEX idx_tenant_memberships_tenant ON public.tenant_memberships(tenant_id);
CREATE INDEX idx_agents_tenant ON public.ai_agents(tenant_id);
CREATE INDEX idx_agents_status ON public.ai_agents(status);
CREATE INDEX idx_tasks_tenant ON public.tasks(tenant_id);
CREATE INDEX idx_tasks_status ON public.tasks(status);
CREATE INDEX idx_tasks_agent ON public.tasks(agent_id);
CREATE INDEX idx_documents_tenant ON public.documents(tenant_id);
CREATE INDEX idx_documents_status ON public.documents(status);
CREATE INDEX idx_clients_tenant ON public.clients(tenant_id);
CREATE INDEX idx_clients_status ON public.clients(status);
CREATE INDEX idx_cases_tenant ON public.cases(tenant_id);
CREATE INDEX idx_cases_status ON public.cases(status);
CREATE INDEX idx_cases_client ON public.cases(client_id);
CREATE INDEX idx_reports_tenant ON public.reports(tenant_id);
CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(read);
CREATE INDEX idx_activity_logs_tenant ON public.activity_logs(tenant_id);
CREATE INDEX idx_activity_logs_created ON public.activity_logs(created_at);
CREATE INDEX idx_time_entries_user ON public.time_entries(user_id);
CREATE INDEX idx_time_entries_case ON public.time_entries(case_id);
CREATE INDEX idx_invoices_client ON public.invoices(client_id);
CREATE INDEX idx_invoices_status ON public.invoices(status);

-- ============================================================
-- SEED DATA - GIONDRAGA & PARTNERS
-- ============================================================

-- Insert default tenant
INSERT INTO public.tenants (id, name, slug, plan, max_users, max_agents, settings)
VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'Giondraga & Partners',
  'giondraga-partners',
  'enterprise',
  50,
  10,
  jsonb_build_object(
    'features', jsonb_build_object(
      'aiAgents', true,
      'documentAnalysis', true,
      'legalResearch', true,
      'compliance', true,
      'apiAccess', true,
      'billing', true,
      'timeTracking', true
    ),
    'notifications', jsonb_build_object(
      'email', true,
      'slack', true
    ),
    'branding', jsonb_build_object(
      'primaryColor', '#3b82f6'
    )
  )
)
ON CONFLICT (id) DO NOTHING;

-- Insert default AI agents
INSERT INTO public.ai_agents (id, name, type, status, description, capabilities, system_prompt, model, tenant_id, tasks_completed, accuracy, avg_response_time)
VALUES
  ('agent-1', 'Lexi - Legal Analyst', 'legal', 'active',
   'Specialized in contract analysis, legal research, and compliance checking. Trained on Indonesian corporate law.',
   ARRAY['Contract Analysis', 'Legal Research', 'Compliance Check', 'Risk Assessment', 'Document Review'],
   'You are an expert legal analyst specializing in corporate law, contract review, and regulatory compliance. Provide thorough, accurate analysis with citations.',
   'gpt-4o', '550e8400-e29b-41d4-a716-446655440000', 1247, 97.30, 1.20),
  ('agent-2', 'Research - Intelligence Agent', 'research', 'active',
   'Deep research capabilities across legal databases, case law, regulatory updates, and market intelligence.',
   ARRAY['Case Law Search', 'Regulatory Tracking', 'Market Research', 'Competitive Analysis', 'Precedent Analysis'],
   'You are a research intelligence agent with access to comprehensive legal databases. Provide detailed research with sources and methodology.',
   'gpt-4o', '550e8400-e29b-41d4-a716-446655440000', 892, 94.80, 2.80),
  ('agent-3', 'TechGuard - IT Security Agent', 'it', 'active',
   'Cybersecurity and IT compliance specialist. Monitors security posture and analyzes vulnerabilities.',
   ARRAY['Security Audit', 'Vulnerability Scan', 'Compliance Check', 'Incident Response', 'Policy Review'],
   'You are an IT security and compliance specialist. Analyze security configurations, identify vulnerabilities, and provide actionable remediation steps.',
   'gpt-4o-mini', '550e8400-e29b-41d4-a716-446655440000', 534, 98.10, 0.80),
  ('agent-4', 'Exec - Executive Summary', 'executive', 'idle',
   'Generates executive summaries, strategic insights, and board-ready reports from complex legal and business data.',
   ARRAY['Executive Summary', 'Strategic Analysis', 'Board Reports', 'Risk Dashboard', 'KPI Tracking'],
   'You are an executive assistant AI. Synthesize complex information into clear, actionable executive summaries and strategic recommendations.',
   'gpt-4o', '550e8400-e29b-41d4-a716-446655440000', 321, 96.50, 3.50),
  ('agent-5', 'Compliance - RegWatch', 'compliance', 'active',
   'Regulatory compliance monitoring agent. Tracks changes in laws, regulations, and standards.',
   ARRAY['Regulatory Tracking', 'Compliance Mapping', 'Gap Analysis', 'Audit Prep', 'Policy Update'],
   'You are a regulatory compliance specialist. Monitor regulatory changes, assess compliance gaps, and provide actionable recommendations.',
   'gpt-4o', '550e8400-e29b-41d4-a716-446655440000', 756, 95.20, 1.50),
  ('agent-6', 'Custom - ContractBot', 'custom', 'offline',
   'Custom-trained agent for specific contract types and client requirements.',
   ARRAY['NDA Review', 'Service Agreement', 'Employment Contract', 'Licensing Agreement'],
   'Custom contract analysis agent. Specialized in specific contract types and client templates.',
   'gpt-4o', '550e8400-e29b-41d4-a716-446655440000', 445, 93.70, 2.10)
ON CONFLICT (id) DO NOTHING;

-- Insert sample clients
INSERT INTO public.clients (id, name, email, company, industry, status, tenant_id, total_cases, open_cases, notes)
VALUES
  ('client-1', 'PT Maju Jaya Indonesia', 'legal@majujaya.co.id', 'PT Maju Jaya Indonesia', 'Manufacturing', 'active',
   '550e8400-e29b-41d4-a716-446655440000', 12, 3, 'Major client since 2023. Focus on M&A and corporate restructuring.'),
  ('client-2', 'TechVentures Pte Ltd', 'general@techventures.sg', 'TechVentures Pte Ltd', 'Technology', 'active',
   '550e8400-e29b-41d4-a716-446655440000', 8, 2, 'Singapore-based tech startup. IP protection and data privacy focus.'),
  ('client-3', 'Global Finance Corp', 'compliance@globalfinance.com', 'Global Finance Corp', 'Financial Services', 'active',
   '550e8400-e29b-41d4-a716-446655440000', 15, 5, 'Multi-jurisdictional compliance and regulatory advisory.'),
  ('client-4', 'GreenEnergy Solutions', 'legal@greenenergy.id', 'GreenEnergy Solutions', 'Energy', 'pending',
   '550e8400-e29b-41d4-a716-446655440000', 2, 2, 'New client. Renewable energy project financing and ESG compliance.')
ON CONFLICT (id) DO NOTHING;

-- Insert sample cases
INSERT INTO public.cases (id, case_number, title, description, status, priority, type, client_id, tenant_id, practice_area, jurisdiction, billing_type, hourly_rate)
VALUES
  ('case-1', 'GION-2024-001', 'PT Maju Jaya - Acquisition Due Diligence',
   'Comprehensive legal due diligence for the acquisition of PT Sejahtera by PT Maju Jaya.',
   'in_progress', 'critical', 'legal', 'client-1', '550e8400-e29b-41d4-a716-446655440000',
   'M&A', 'Indonesia', 'hourly', 500.00),
  ('case-2', 'GION-2024-002', 'TechVentures - IP Infringement Defense',
   'Defense against patent infringement claim in Singapore High Court.',
   'in_progress', 'high', 'legal', 'client-2', '550e8400-e29b-41d4-a716-446655440000',
   'Intellectual Property', 'Singapore', 'hourly', 750.00),
  ('case-3', 'GION-2024-003', 'Global Finance - OJK Compliance Review',
   'Comprehensive compliance review following new OJK regulations.',
   'open', 'critical', 'compliance', 'client-3', '550e8400-e29b-41d4-a716-446655440000',
   'Regulatory Compliance', 'Indonesia', 'fixed', 25000.00)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- REALTIME SUBSCRIPTIONS
-- ============================================================
BEGIN;
  -- Drop existing if any to avoid conflicts
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime;

  -- Add tables to realtime
  ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.ai_agents;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.documents;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.cases;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.clients;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.activity_logs;
COMMIT;

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('documents', 'documents', false, 52428800, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/plain']),
  ('avatars', 'avatars', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/gif']),
  ('reports', 'reports', false, 10485760, ARRAY['application/pdf', 'text/html'])
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "documents_select_tenant" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'documents' AND (
    (storage.foldername(name))[1] IN (
      SELECT id::text FROM public.tenant_memberships WHERE user_id = auth.uid()
    ))
  ));

CREATE POLICY "documents_insert_tenant" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'documents' AND (
    (storage.foldername(name))[1] IN (
      SELECT id::text FROM public.tenant_memberships WHERE user_id = auth.uid()
    ))
  ));

-- ============================================================
-- SCHEMA COMPLETE
-- ============================================================
