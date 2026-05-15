# Giondraga LegalOS - Deployment Guide

## Prerequisites

- Node.js 18+
- Supabase account (Project: vqybqhnrhtkniqlukdk)
- Vercel account
- GitHub repository

---

## Step 1: Supabase Setup

### 1.1 Run the SQL Schema

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/vqybqhnrhtkniqlukdk)
2. Navigate to **SQL Editor**
3. Open a **New Query**
4. Copy the entire contents of `supabase_schema.sql`
5. Click **Run**

This creates:
- 15 production tables with full RLS
- Multi-tenant security policies
- Realtime subscriptions
- Storage buckets
- Seed data for Giondraga & Partners

### 1.2 Configure Authentication

1. Go to **Authentication > Settings**
2. Under **Email Auth**:
   - Enable **Confirm email** (for production)
   - Set **Site URL**: `https://giondraga-legalos.vercel.app`
   - Set **Redirect URLs**: `https://giondraga-legalos.vercel.app/auth/callback`
3. Under **External OAuth Providers** (optional):
   - Enable Google, GitHub as needed

### 1.3 Configure Email Templates

1. Go to **Authentication > Email Templates**
2. Customize:
   - **Confirm signup**: Add your branding
   - **Magic Link**: For passwordless login
   - **Change Email Address**
   - **Reset Password**

### 1.4 Storage Configuration

1. Go to **Storage**
2. Verify buckets created:
   - `documents` (private, 50MB limit)
   - `avatars` (public, 2MB limit)
   - `reports` (private, 10MB limit)
3. Set CORS policies if needed

---

## Step 2: Environment Variables

### 2.1 Local Development

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://vqybqhnrhtkniqlukdk.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_KUO_Xc4Q6zvV50lz6gOSug_rtIiKWRd
SUPABASE_SERVICE_ROLE_KEY=sb_service_role_your_key_here

NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Giondraga LegalOS
```

### 2.2 Vercel Environment Variables

In Vercel Dashboard > Project Settings > Environment Variables:

| Variable | Value | Environment |
|----------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://vqybqhnrhtkniqlukdk.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_KUO_Xc4Q6zvV50lz6gOSug_rtIiKWRd` | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | `sb_service_role_...` | Production only |

**Important**: Never expose the Service Role Key to the client.

---

## Step 3: Deploy to Vercel

### Option A: GitHub Integration (Recommended)

1. Push code to GitHub repository
2. Go to [Vercel Dashboard](https://vercel.com)
3. Click **Add New Project**
4. Import your GitHub repository
5. Configure:
   - **Framework Preset**: Next.js
   - **Build Command**: `next build`
   - **Output Directory**: `dist`
6. Add environment variables from Step 2.2
7. Click **Deploy**

### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Option C: Manual Build

```bash
# Build locally
npm run build

# The `dist` folder will be created with static files
# Upload to your hosting provider
```

---

## Step 4: Post-Deployment Configuration

### 4.1 Domain Setup

1. In Vercel Dashboard > Domains
2. Add custom domain: `legalos.giondraga.com`
3. Configure DNS records as instructed
4. Enable HTTPS (automatic on Vercel)

### 4.2 Supabase Auth Redirect URLs

Update in Supabase Dashboard:
- `https://giondraga-legalos.vercel.app/auth/callback`
- `https://legalos.giondraga.com/auth/callback`

### 4.3 Invite Team Members

1. Sign up first admin user via the login page
2. Manually update their role in Supabase:
   ```sql
   UPDATE public.profiles
   SET role = 'admin', tenant_id = '550e8400-e29b-41d4-a716-446655440000'
   WHERE email = 'admin@giondraga.com';
   ```
3. Add tenant membership:
   ```sql
   INSERT INTO public.tenant_memberships (tenant_id, user_id, role, is_primary)
   VALUES ('550e8400-e29b-41d4-a716-446655440000', 'user-uuid', 'owner', true);
   ```

---

## Step 5: Role Configuration

### Available Roles

| Role | Permissions |
|------|-------------|
| **admin** | Full system access, manage users, configure agents |
| **lawyer** | Manage cases, clients, documents, run AI agents |
| **consultant** | View reports, manage projects, limited agent access |
| **client** | View own cases, upload documents, receive reports |
| **paralegal** | Document management, task assistance, research |
| **manager** | Team oversight, billing, performance reports |

### Assigning Roles

```sql
-- Make user a lawyer
UPDATE public.profiles SET role = 'lawyer' WHERE email = 'lawyer@giondraga.com';

-- Make user a client
UPDATE public.profiles SET role = 'client' WHERE email = 'client@majujaya.co.id';
```

---

## Step 6: Security Checklist

- [x] RLS enabled on all tables
- [x] Multi-tenant isolation via `tenant_id`
- [x] Role-based access control
- [x] Service Role Key server-side only
- [x] HTTPS enforced
- [x] CSP headers configured
- [x] Rate limiting on auth endpoints
- [x] Audit logging enabled
- [x] Realtime subscriptions scoped to tenant
- [x] Storage policies restrict cross-tenant access

---

## Step 7: Monitoring & Maintenance

### Supabase Dashboard Monitoring

1. **Database > Reports**: Query performance
2. **Auth > Logs**: Authentication events
3. **Storage > Logs**: File operations
4. **Edge Functions**: Serverless function logs

### Vercel Analytics

1. Enable **Vercel Analytics** for performance insights
2. Enable **Speed Insights** for Core Web Vitals
3. Set up **Log Drains** for centralized logging

### Health Checks

```bash
# Test Supabase connection
curl https://vqybqhnrhtkniqlukdk.supabase.co/rest/v1/tenants?select=id   -H "apikey: sb_publishable_KUO_Xc4Q6zvV50lz6gOSug_rtIiKWRd"

# Test app health
curl https://giondraga-legalos.vercel.app/api/health
```

---

## Troubleshooting

### Auth Issues
- Check redirect URLs match exactly
- Verify email confirmation settings
- Check browser console for CORS errors

### RLS Issues
- Verify user has tenant membership
- Check `auth.uid()` returns correct UUID
- Use `EXPLAIN ANALYZE` for slow queries

### Realtime Issues
- Verify table added to publication
- Check filter syntax in subscription
- Monitor connection limits

### Build Issues
- Ensure `output: 'export'` in next.config.js
- Check all imports resolve correctly
- Verify no server-side code in client components

---

## Support

- **Supabase Docs**: https://supabase.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Project Issues**: support@giondraga.com
