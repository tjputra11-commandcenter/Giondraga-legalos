# Giondraga AI Command Center

Enterprise AI-native legal operating system for modern consulting firms. A comprehensive dashboard for managing AI agents, legal documents, client cases, and business operations.

## Features

- **Landing Page** - Modern marketing page with feature showcase
- **Secure Authentication** - Supabase Auth with multi-tenant support
- **AI Agent Monitoring** - Real-time agent status, performance metrics, and task tracking
- **Legal Agent** - Contract analysis, legal research, and compliance checking
- **Research Agent** - Deep research across legal databases and regulatory sources
- **IT Security Agent** - Security audits, vulnerability scans, and compliance checks
- **Executive Summary Panel** - Strategic insights and board-ready reports
- **Document Management** - Upload, process, and analyze legal documents with AI
- **Task Execution Logs** - Complete audit trail of all AI operations
- **Notification Center** - Real-time alerts and system notifications
- **Client Management** - Multi-tenant client portal with case tracking
- **Reports** - AI-generated executive, legal, compliance, and performance reports
- **Settings** - Profile, organization, security, and API key management

## Tech Stack

- **Next.js 15** - React framework with App Router
- **Tailwind CSS** - Utility-first CSS framework
- **Supabase** - Authentication, database, and real-time subscriptions
- **Zustand** - Lightweight state management
- **Recharts** - Data visualization
- **Framer Motion** - Animations and transitions
- **Lucide React** - Icon library

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-org/legal-ai-command-center.git
cd legal-ai-command-center
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```
Edit `.env.local` with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo Credentials

- Email: `sarah.chen@giondraga.com`
- Password: `any password works` (demo mode)

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Landing page
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles
│   ├── login/             # Authentication
│   ├── dashboard/         # Main dashboard
│   ├── agents/            # AI agents monitoring
│   ├── tasks/             # Task management
│   ├── documents/         # Document upload & processing
│   ├── reports/           # AI-generated reports
│   ├── clients/           # Client management
│   ├── notifications/     # Notification center
│   └── settings/          # User & org settings
├── components/
│   ├── layout/            # Sidebar, Header, Layout
│   ├── ui/                # Reusable UI components
│   ├── agents/            # Agent-specific components
│   └── dashboard/         # Dashboard widgets
├── lib/
│   ├── supabase.ts        # Supabase client
│   ├── store.ts           # Zustand store
│   ├── mockData.ts        # Demo data
│   └── utils.ts           # Utility functions
├── types/
│   └── index.ts           # TypeScript types
└── public/                # Static assets
```

## Database Schema (Supabase)

### Tables

- `users` - User accounts and profiles
- `tenants` - Multi-tenant organizations
- `ai_agents` - AI agent configurations and status
- `tasks` - Task execution records
- `documents` - Document metadata and processing status
- `reports` - Generated report records
- `notifications` - User notifications
- `activity_logs` - Audit trail
- `clients` - Client records
- `cases` - Legal case records

### Row Level Security (RLS)

All tables have RLS policies configured for multi-tenant isolation:
- Users can only access data within their tenant
- Admins have full access to tenant data
- Clients have restricted access to their own data

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Manual Build

```bash
npm run build
```

## License

MIT License - Giondraga & Partners

## Support

For support, contact support@giondraga.com or visit our [Help Center](https://giondraga.com/support).
