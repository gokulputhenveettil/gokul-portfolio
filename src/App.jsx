import React, { useState, useEffect } from 'react';
import {
  Terminal,
  Server,
  Database,
  Cpu,
  Layers,
  GitBranch,
  ExternalLink,
  Mail,
  MapPin,
  Check,
  Copy,
  FileText,
  ArrowUpRight,
  Code2,
  Sparkles,
  ShieldCheck,
  Activity,
  X,
  Menu,
  ChevronRight,
  BookOpen,
  Send,
  Box,
  Workflow,
} from 'lucide-react';
import {
  ArchitectureModal,
  EngineeringNoteModal,
  ResumeModal
} from './components/PortfolioModals';

// ============================================================================
// DATA & CONTENT CONFIGURATION
// ============================================================================

const CASE_STUDIES = [
  {
    id: 'lms-multi-db',
    title: 'Enterprise Multi-Database LMS & LXP Re-Architecture',
    org: 'Cornerstone OnDemand (Enterprise Production)',
    period: 'Senior Software Engineer',
    category: 'Distributed Systems',
    badge: 'High-Throughput Scale',
    accent: 'rose',
    summary:
      'Re-architected multi-tenant Learning Management System (LMS) and Learning Experience Platform (LXP) services, combining multi-database Rails routing with hybrid tenant sharding to sustain high-concurrency enterprise traffic.',
    problem:
      'Rapid tenant growth across LMS and LXP workloads caused read/write contention during compliance reporting, learner discovery, and bulk enrollment syncs, leading to elevated p99 API latencies and Sidekiq queue saturation.',
    solution:
      'Separated LMS transactions, LXP experience workloads, and analytics across Rails multi-database connections. A tenant directory routes by region and shard: smaller tenants use hash-bucketed shard pools, while high-volume tenants receive dedicated shards. Isolated batch workers and added layered Redis caching.',
    metrics: [
      { label: 'P99 API Latency', value: '-48% Reduction' },
      { label: 'Batch Throughput', value: 'Millions / Day' },
      { label: 'System Reliability', value: '99.95%+ Uptime' }
    ],
    stack: [
      'Ruby on Rails',
      'PostgreSQL',
      'MySQL',
      'Redis',
      'Sidekiq',
      'AWS',
      'New Relic',
      'Kibana'
    ],
    architectureDiagram: [
      {
        layer: 'API Gateway & Edge',
        nodes: ['Load Balancer (ALB)', 'Rate Limiter', 'Rails API Cluster (Puma)'],
        color: 'border-rose-500/40 bg-rose-500/5 text-rose-300'
      },
      {
        layer: 'LMS & LXP Product Services',
        nodes: [
          'LMS: Courses, Enrollments & Compliance',
          'LXP: Discovery, Profiles & Recommendations',
          'Shared Tenant Identity & Authorization'
        ],
        color: 'border-cyan-500/40 bg-cyan-500/5 text-cyan-300'
      },
      {
        layer: 'Tenant Placement & Hybrid Shard Routing',
        nodes: [
          'Tenant Directory: Tenant → Region / Shard',
          'Hash-Bucketed Shard Pools for Standard Tenants',
          'Dedicated Shards for High-Volume Tenants'
        ],
        color: 'border-emerald-500/40 bg-emerald-500/5 text-emerald-300'
      },
      {
        layer: 'Caching & Queue Isolation',
        nodes: [
          'Redis Read-Through Cache',
          'Sidekiq Critical Queue (Auth/Webhooks)',
          'Sidekiq Batch Queue (Reporting/Sync)'
        ],
        color: 'border-cyan-500/40 bg-cyan-500/5 text-cyan-300'
      },
      {
        layer: 'Multi-Database Persistence & Read Scaling',
        nodes: [
          'LMS / LXP Regional Shard Writers',
          'Read Replicas for Search & Reporting',
          'Analytics Store / Audit Logs'
        ],
        color: 'border-emerald-500/40 bg-emerald-500/5 text-emerald-300'
      }
    ],
    tradeoffs: [
      'Handled replication lag on read replicas by routing post-write session reads to the primary writer for a 3-second sticky window.',
      'Replaced monolithic cron jobs with cursor-based `find_in_batches` fan-out jobs to maintain flat Ruby worker memory footprints.',
      'Kept cross-shard LMS/LXP workflows asynchronous and idempotent, avoiding distributed transactions across tenant shards.'
    ]
  },
  {
    id: 'ai-job-intelligence',
    title: 'AI-Powered Job Intelligence & Streaming Cover Letter Platform',
    org: 'Flagship Full-Stack & LLM Architecture',
    period: 'Rails 8 + React + OpenAI',
    category: 'Full-Stack & AI',
    badge: 'Real-Time Streaming',
    accent: 'cyan',
    summary:
      'End-to-end decoupled job discovery, automated resume compatibility scoring, Telegram alert triage, and real-time token-by-token LLM cover letter generation platform.',
    problem:
      'Senior engineering candidates waste hours filtering noisy job feeds across remote boards and manually tailoring applications without structured alignment feedback against their core technical background.',
    solution:
      'Built an hourly Sidekiq-cron ingestion pipeline feeding a Rails 8 API and React/Redux client. Integrated interactive Telegram bot alerts, background LLM resume scoring (`ScoreJobResumeJob`), and ActionCable WebSockets for real-time OpenAI cover letter streaming.',
    metrics: [
      { label: 'Ingestion Cadence', value: 'Hourly Automated' },
      { label: 'Cover Letter UX', value: '<400ms First Token' },
      { label: 'Alert Triage', value: '1-Tap Telegram Bot' }
    ],
    stack: [
      'Rails 8',
      'React',
      'Redux',
      'ActionCable',
      'Sidekiq',
      'Redis',
      'PostgreSQL',
      'OpenAI API',
      'Telegram Bot API'
    ],
    architectureDiagram: [
      {
        layer: 'Ingestion & Instant Notification',
        nodes: [
          'Sidekiq-Cron Scheduler',
          'Deduplication Engine (PostgreSQL)',
          'Telegram Interactive Webhook Bot'
        ],
        color: 'border-cyan-500/40 bg-cyan-500/5 text-cyan-300'
      },
      {
        layer: 'Async AI Scoring & Streaming',
        nodes: [
          'ScoreJobResumeJob (Structured JSON Output)',
          'OpenAI Streaming Client',
          'ActionCable Redis Pub/Sub Channel'
        ],
        color: 'border-rose-500/40 bg-rose-500/5 text-rose-300'
      },
      {
        layer: 'Decoupled Client Experience',
        nodes: [
          'React + Redux Toolkit State',
          'Live Token Stream Renderer',
          'Markdown / PDF Export Pipeline'
        ],
        color: 'border-emerald-500/40 bg-emerald-500/5 text-emerald-300'
      }
    ],
    tradeoffs: [
      'Decoupled resume scoring into an asynchronous Sidekiq job with idempotency keys so Telegram notifications deliver instantly before LLM evaluation completes.',
      'Streamed OpenAI chunks via ActionCable WebSockets rather than HTTP SSE to reuse authenticated session channels across firewall proxies.'
    ]
  },
  {
    id: 'event-sourced-billetto',
    title: 'Event-Sourced Event Discovery & Voting Engine (Billetto App)',
    org: 'Domain-Driven Event Sourcing System',
    period: 'Rails Event Store + CQRS',
    category: 'Event Sourcing',
    badge: 'Zero Race Conditions',
    accent: 'emerald',
    summary:
      'High-integrity event discovery and community ranking engine engineered around immutable domain events, composite streams, and optimistic concurrency control.',
    problem:
      'Standard CRUD voting counters suffer from lost updates under concurrent clicks, lack historical audit trails for anti-abuse analysis, and tightly couple write validation with read aggregations.',
    solution:
      'Modeled user interactions as immutable domain events (`EventUpvoted`, `EventDownvoted`, `VoteCast`) using Rails Event Store. Enforced composite user-event streams with optimistic locking and built asynchronous CQRS read-model vote projectors.',
    metrics: [
      { label: 'Auditability', value: '100% Immutable Log' },
      { label: 'Concurrency Safety', value: 'Optimistic Locking' },
      { label: 'Auth & Security', value: 'Clerk JWT + RBAC' }
    ],
    stack: [
      'Ruby on Rails',
      'Rails Event Store',
      'CQRS',
      'PostgreSQL JSONB',
      'Clerk Auth',
      'RSpec',
      'Docker'
    ],
    architectureDiagram: [
      {
        layer: 'Command & Auth Boundary',
        nodes: [
          'Clerk.com JWT Verification',
          'CastVoteCommand Handler',
          'Composite Stream Key (User#ID:Event#ID)'
        ],
        color: 'border-emerald-500/40 bg-emerald-500/5 text-emerald-300'
      },
      {
        layer: 'Immutable Event Store',
        nodes: [
          'Rails Event Store (RES)',
          'Optimistic Version Check',
          'Events: VoteCast / EventUpvoted / EventDownvoted'
        ],
        color: 'border-rose-500/40 bg-rose-500/5 text-rose-300'
      },
      {
        layer: 'CQRS Read Projections',
        nodes: [
          'Synchronous/Async Vote Projector',
          'Materialized Leaderboard View',
          'PostgreSQL JSONB Metadata Index'
        ],
        color: 'border-cyan-500/40 bg-cyan-500/5 text-cyan-300'
      }
    ],
    tradeoffs: [
      'Used composite per-(user, event) streams instead of a global event stream so optimistic locking contention is isolated strictly to duplicate clicks by the same user.',
      'Maintained a denormalized projection table for sub-10ms trending event queries while preserving full state replay capability.'
    ]
  }
];

const STACK_CATEGORIES = [
  {
    title: 'Backend & Core Architecture',
    icon: Server,
    accent: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
    skills: [
      'Ruby (3.3 / 3.4)',
      'Ruby on Rails (7 / 8)',
      'REST & GraphQL APIs',
      'Distributed Microservices',
      'Rails Event Store (CQRS)',
      'Stripe & Webhook Idempotency',
      'Multi-Tenant SaaS Design',
      'Domain-Driven Design (DDD)'
    ]
  },
  {
    title: 'Data & Asynchronous Systems',
    icon: Database,
    accent: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
    skills: [
      'PostgreSQL (Query Tuning & JSONB)',
      'MySQL (Multi-DB Routing)',
      'Redis (Caching & Pub/Sub)',
      'MongoDB / DocumentDB',
      'Sidekiq & Sidekiq-Cron',
      'ActionCable WebSockets',
      'Apache Kafka',
      'Optimistic & Pessimistic Locking'
    ]
  },
  {
    title: 'Frontend & AI Workflows',
    icon: Cpu,
    accent: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    skills: [
      'React.js (Hooks & Patterns)',
      'Redux Toolkit',
      'TypeScript & Modern ES',
      'Tailwind CSS',
      'Vite',
      'OpenAI / LLM APIs',
      'Real-Time Token Streaming',
      'MCP & AI Developer Tooling'
    ]
  },
  {
    title: 'Cloud, Observability & Quality',
    icon: ShieldCheck,
    accent: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    skills: [
      'AWS (EC2, RDS, S3, SQS)',
      'Docker & Compose',
      'Kubernetes',
      'RSpec & Integration Testing',
      'New Relic APM',
      'ELK / Kibana Logging',
      'GitHub Actions CI/CD',
      'Zero-Downtime Migrations'
    ]
  }
];

const ENGINEERING_NOTES = [
  {
    id: 'sidekiq-memory',
    title: 'Processing Millions of Records in Sidekiq Without Memory Bloat',
    readTime: '6 min read',
    tag: 'Performance & Ruby',
    date: 'Architecture Note #01',
    summary:
      'Why loading ActiveRecord collections in background workers triggers OOM kills—and how cursor-based fan-out batches keep Ruby RSS flat.',
    keyTakeaways: [
      'Never pass large ID arrays into a single Sidekiq job; instead enqueue lightweight coordinator jobs that slice ranges using `in_batches(of: 1000)` with `load: false`.',
      'Disable ActiveRecord query cache inside long-running loops (`ActiveRecord::Base.uncached`) so instantiated SQL results are garbage-collected immediately.',
      'Isolate heavy batch queues from latency-sensitive user queues (auth, webhooks, notifications) using dedicated Sidekiq capsules.'
    ],
    codeSnippet: `# Safe Fan-Out Coordinator Pattern
class SyncTenantRecordsCoordinatorJob
  include Sidekiq::Job
  sidekiq_options queue: :batch_low

  def perform(tenant_id)
    Tenant.find(tenant_id).enrollments.in_batches(of: 1_000, load: false) do |relation|
      ids = relation.pluck(:id)
      ProcessEnrollmentChunkJob.perform_async(tenant_id, ids)
    end
  end
end`
  },
  {
    id: 'webhook-idempotency',
    title: 'Idempotent Payment & Webhook Concurrency Patterns in Ruby on Rails',
    readTime: '7 min read',
    tag: 'Distributed Reliability',
    date: 'Architecture Note #02',
    summary:
      'Handling duplicate Stripe or third-party webhooks arriving milliseconds apart without double-charging or corrupting state machines.',
    keyTakeaways: [
      'Enforce a database-level unique index on `(provider, external_event_id)` in an `inbound_webhooks` table—application-level `find_or_create_by` alone is vulnerable to race conditions.',
      'Wrap state transitions inside `ActiveRecord::Base.transaction` with row-level `with_lock` (`SELECT ... FOR UPDATE`) to serialize concurrent deliveries.',
      'Acknowledge valid signatures with HTTP 200 immediately after persisting the raw payload, offloading downstream side effects to Sidekiq.'
    ],
    codeSnippet: `# Race-Safe Webhook Ingestion
def ingest_webhook!(provider:, event_id:, payload:)
  record = InboundWebhook.create!(
    provider: provider,
    external_event_id: event_id,
    payload: payload,
    status: :pending
  )
  ProcessWebhookJob.perform_async(record.id)
rescue ActiveRecord::RecordNotUnique
  # Duplicate delivery safely ignored at DB constraint boundary
  Rails.logger.info("Duplicate webhook ignored: #{provider}:#{event_id}")
end`
  },
  {
    id: 'cqrs-rails-event-store',
    title: 'CQRS & Composite Streams with Rails Event Store',
    readTime: '8 min read',
    tag: 'Domain-Driven Design',
    date: 'Architecture Note #03',
    summary:
      'Designing granular event streams that preserve full domain auditability while avoiding global stream locking bottlenecks.',
    keyTakeaways: [
      'Partition write streams by the smallest consistency boundary (e.g., `Vote$user_42_event_99`) so optimistic locking only conflicts on true duplicate actions.',
      'Keep domain events immutable and past-tense (`VoteCast`, `EventUpvoted`) carrying only minimal identifiers and timestamps.',
      'Build idempotent read-model projectors that can be safely replayed from event position 0 whenever UI query requirements evolve.'
    ],
    codeSnippet: `# Composite Stream with Optimistic Concurrency
stream_name = "Vote$#{user.id}_#{event.id}"
expected_version = event_store.read.stream(stream_name).last&.event_id || :none

event_store.publish(
  EventUpvoted.new(data: { user_id: user.id, event_id: event.id }),
  stream_name: stream_name,
  expected_version: expected_version
)`
  }
];

// ============================================================================
// MAIN APPLICATION COMPONENT
// ============================================================================

export default function App() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedCaseStudy, setSelectedCaseStudy] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Contact Form State
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    roleType: 'Senior Backend / Rails Role',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const emailAddress = 'gokulpom@gmail.com';

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedCaseStudy(null);
        setSelectedNote(null);
        setIsResumeOpen(false);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard?.writeText(emailAddress);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.name.trim() || !contactForm.email.trim()) return;
    setFormSubmitted(true);
    setTimeout(() => {
      setContactForm({
        name: '',
        email: '',
        roleType: 'Senior Backend / Rails Role',
        message: ''
      });
    }, 400);
  };

  const filteredStudies =
    activeFilter === 'All'
      ? CASE_STUDIES
      : CASE_STUDIES.filter((study) => study.category === activeFilter);

  const navLinks = [
    { label: 'Architecture & Work', href: '#case-studies' },
    { label: 'Tech Matrix', href: '#capabilities' },
    { label: 'Engineering Notes', href: '#notes' },
    { label: 'Contact', href: '#contact' }
  ];

  return (
    <div className="portfolio-app min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-rose-500/30 selection:text-rose-200 relative overflow-x-hidden">
      {/* Subtle Technical Grid Background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
          backgroundSize: '44px 44px'
        }}
      />
      {/* Top Ambient Glow */}
      <div className="fixed top-[-180px] left-1/2 -translate-x-1/2 w-[780px] h-[360px] bg-rose-600/15 blur-[130px] rounded-full pointer-events-none" />

      {/* ==================================================================== */}
      {/* NAVIGATION BAR                                                       */}
      {/* ==================================================================== */}
      <header className="fixed inset-x-0 top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/85 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Monogram */}
          <a
            href="#"
            className="flex items-center gap-2.5 group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-rose-600 to-rose-800 border border-rose-400/30 flex items-center justify-center shadow-lg shadow-rose-950/50 group-hover:scale-105 transition-transform">
              <Terminal className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-tight text-zinc-100 leading-none">
                Gokul<span className="text-rose-500">.rb</span>
              </span>
              <span className="text-[11px] font-mono text-zinc-400 mt-0.5">
                Distributed Systems
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-zinc-400">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-zinc-100 transition-colors py-1"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop Quick Actions */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="https://github.com/gokulputhenveettil"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub Profile"
              className="p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-all"
            >
              <GitBranch className="w-4 h-4" />
            </a>
            <button
              onClick={() => setIsResumeOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-zinc-700/80 hover:border-rose-500/50 transition-all cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-rose-400" />
              Resume.pdf
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
            className="md:hidden p-2.5 rounded-lg text-zinc-300 hover:bg-zinc-900 border border-zinc-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-zinc-800 bg-zinc-950/95 px-4 pt-3 pb-5 space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 px-3 rounded-lg text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-900"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsResumeOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-mono font-semibold bg-rose-600 text-white"
              >
                <FileText className="w-4 h-4" />
                View / Print Resume
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="relative z-10 pt-16">
        {/* ================================================================== */}
        {/* HERO SECTION                                                       */}
        {/* ================================================================== */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-16 sm:pt-20 sm:pb-24">
          <div className="max-w-4xl mx-auto">
            {/* Availability Status Pill */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800 text-xs font-mono text-zinc-300 mb-6 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>Open to Senior Backend &amp; Full-Stack Roles (Remote / Global)</span>
            </div>

            {/* Primary Headline */}
            <h1 className="text-center text-3xl sm:text-5xl lg:text-[3.4rem] font-extrabold tracking-tight text-white leading-[1.12] mb-6">
              
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-rose-500 to-amber-300">
                Gokul —{' '} Senior Ruby on Rails Engineer
              </span>{' '}
              
            </h1>

            {/* Subheadline */}
            <p className="mx-auto text-center text-base sm:text-lg lg:text-xl text-zinc-400 leading-relaxed max-w-3xl mb-8">
              <strong className="text-zinc-200 font-semibold">9.3+ years</strong> architecting
              high-throughput Ruby on Rails APIs, multi-database architectures, event-driven
              microservices, and AI-powered React applications. Previously Senior Software
              Engineer at{' '}
              <span className="text-zinc-200 font-medium underline decoration-rose-500/60 underline-offset-4">
                Cornerstone OnDemand
              </span>
              .
            </p>

            {/* Primary CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 mb-12">
              <a
                href="#case-studies"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm shadow-lg shadow-rose-950/60 transition-all"
              >
                Explore Case Studies
                <ArrowUpRight className="w-4 h-4" />
              </a>
              <a
                href="#notes"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800/90 text-zinc-200 font-medium text-sm border border-zinc-800 hover:border-zinc-700 transition-all"
              >
                <BookOpen className="w-4 h-4 text-cyan-400" />
                View Architecture Notes
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-transparent hover:bg-zinc-900/60 text-zinc-300 font-medium text-sm border border-zinc-800/80 transition-all"
              >
                Get in Touch
              </a>
            </div>
          </div>

          {/* Key Impact Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {[
              {
                label: 'Production Experience',
                value: '9.3+ Yrs',
                sub: 'Backend & Full-Stack Ownership',
                icon: Activity,
                accent: 'text-rose-400'
              },
              {
                label: 'Enterprise Scale',
                value: 'Multi-DB LMS',
                sub: 'Cornerstone OnDemand APIs',
                icon: Database,
                accent: 'text-cyan-400'
              },
              {
                label: 'Async & Event Architecture',
                value: 'Sidekiq & RES',
                sub: 'Fan-Out & Event Sourcing',
                icon: Workflow,
                accent: 'text-emerald-400'
              },
              {
                label: 'Modern Full-Stack & AI',
                value: 'Rails 8 + React',
                sub: 'LLM Streaming & ActionCable',
                icon: Sparkles,
                accent: 'text-amber-400'
              }
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/90 backdrop-blur-sm hover:border-zinc-700/90 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                      {stat.label}
                    </span>
                    <Icon className={`w-4 h-4 ${stat.accent}`} />
                  </div>
                  <div className="text-xl font-bold text-white tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-xs text-zinc-400 mt-0.5">{stat.sub}</div>
                </div>
              );
            })}
          </div>

          <div className="mt-8">
            <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3">
              Major Products Worked On
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <article className="overflow-hidden rounded-2xl bg-zinc-900/60 border border-zinc-800">
                <div className="h-40 bg-white p-8 flex items-center justify-center">
                  <img
                    src={`${import.meta.env.BASE_URL}images/cornerstone.svg`}
                    alt="Cornerstone OnDemand logo"
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-base font-semibold text-zinc-100">
                    Cornerstone OnDemand
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                    Enterprise learning platform supporting LMS and LXP experiences,
                    compliance training, and personalized employee development.
                  </p>
                </div>
              </article>

              <article className="overflow-hidden rounded-2xl bg-zinc-900/60 border border-zinc-800">
                <div className="h-40 bg-zinc-950 overflow-hidden">
                  <img
                    src="https://www.sapaad.com/wp-content/uploads/2025/09/Home-01__Central-Control-Across-Outlets.webp"
                    alt="Sapaad restaurant management platform for central control across outlets"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-base font-semibold text-zinc-100">Sapaad</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                    Cloud-based POS and restaurant management for dine-in, takeaway,
                    delivery, and online orders, helping food businesses manage
                    operations from one platform.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* ================================================================== */}
        {/* INTERACTIVE ARCHITECTURE & CASE STUDIES                            */}
        {/* ================================================================== */}
        <section
          id="case-studies"
          className="scroll-mt-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-zinc-900"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono text-rose-400 uppercase tracking-widest mb-2">
                <Layers className="w-3.5 h-3.5" />
                System Design &amp; Production Delivery
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Featured Architecture Case Studies
              </h2>
              <p className="text-sm sm:text-base text-zinc-400 mt-2 max-w-2xl">
                Deep-dive production systems demonstrating database throughput optimization,
                asynchronous Sidekiq fan-out pipelines, event sourcing, and real-time AI streaming.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {['All', 'Distributed Systems', 'Full-Stack & AI', 'Event Sourcing'].map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveFilter(tab)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                      activeFilter === tab
                        ? 'bg-rose-600 text-white font-semibold shadow-md shadow-rose-950/60'
                        : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                    }`}
                  >
                    {tab}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Case Study Cards */}
          <div className="space-y-6">
            {filteredStudies.map((study) => (
              <article
                key={study.id}
                className="group rounded-2xl bg-zinc-900/55 border border-zinc-800/90 hover:border-zinc-700 p-6 sm:p-8 transition-all shadow-xl shadow-black/20"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  {/* Left Narrative */}
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-zinc-800 text-zinc-300 border border-zinc-700/80">
                        {study.category}
                      </span>
                      <span
                        className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-medium border ${
                          study.accent === 'rose'
                            ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                            : study.accent === 'cyan'
                            ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                            : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                        }`}
                      >
                        {study.badge}
                      </span>
                      <span className="text-xs font-mono text-zinc-500">
                        {study.org}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-rose-300 transition-colors">
                      {study.title}
                    </h3>

                    <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                      {study.summary}
                    </p>

                    {/* Problem -> Architecture Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800/80">
                        <div className="text-xs font-mono uppercase tracking-wider text-amber-400 mb-1.5">
                          01 // Bottleneck &amp; Problem
                        </div>
                        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                          {study.problem}
                        </p>
                      </div>
                      <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800/80">
                        <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 mb-1.5">
                          02 // Architectural Solution
                        </div>
                        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                          {study.solution}
                        </p>
                      </div>
                    </div>

                    {/* Tech Stack Badges */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {study.stack.map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-1 rounded-md text-xs font-mono bg-zinc-950 text-zinc-300 border border-zinc-800"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right Metrics & Interactive Architecture Trigger */}
                  <div className="lg:w-72 flex flex-col justify-between gap-4 p-5 rounded-xl bg-zinc-950/80 border border-zinc-800/90">
                    <div className="space-y-3.5">
                      <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">
                        Measured Outcomes
                      </div>
                      {study.metrics.map((m, i) => (
                        <div
                          key={i}
                          className="border-b border-zinc-900 pb-2.5 last:border-none last:pb-0"
                        >
                          <div className="text-xs text-zinc-400">{m.label}</div>
                          <div className="text-sm font-bold font-mono text-zinc-100 mt-0.5">
                            {m.value}
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => setSelectedCaseStudy(study)}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-zinc-900 hover:bg-rose-600 text-zinc-100 hover:text-white text-xs font-mono font-semibold border border-zinc-700 hover:border-rose-500 transition-all cursor-pointer"
                    >
                      <Box className="w-4 h-4" />
                      View System Architecture
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ================================================================== */}
        {/* CORE ENGINEERING STACK & CAPABILITIES MATRIX                       */}
        {/* ================================================================== */}
        <section
          id="capabilities"
          className="scroll-mt-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-zinc-900"
        >
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-2">
              <Code2 className="w-3.5 h-3.5" />
              Technical Capabilities Matrix
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Production Stack &amp; Architectural Tooling
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 mt-2 max-w-2xl">
              Battle-tested across 9.3+ years of shipping mission-critical SaaS platforms,
              background processing engines, and reactive frontends.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {STACK_CATEGORIES.map((group) => {
              const Icon = group.icon;
              return (
                <div
                  key={group.title}
                  className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/90 hover:border-zinc-700/80 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className={`p-2.5 rounded-xl border ${group.accent}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-white">{group.title}</h3>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {group.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 rounded-lg text-xs font-mono bg-zinc-950/90 text-zinc-200 border border-zinc-800 hover:border-zinc-700 transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ================================================================== */}
        {/* ENGINEERING NOTES / TECHNICAL WRITING PREVIEW                      */}
        {/* ================================================================== */}
        <section
          id="notes"
          className="scroll-mt-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-zinc-900"
        >
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-widest mb-2">
              <Terminal className="w-3.5 h-3.5" />
              Architecture Notes &amp; Patterns
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Field Notes on Rails Scale &amp; Reliability
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 mt-2 max-w-2xl">
              Practical patterns distilled from debugging high-concurrency production systems.
              Click any note to inspect implementation details and code patterns.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {ENGINEERING_NOTES.map((note) => (
              <button
                key={note.id}
                onClick={() => setSelectedNote(note)}
                className="text-left group p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/90 hover:border-rose-500/50 hover:bg-zinc-900/80 transition-all flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 mb-3">
                    <span className="text-rose-400">{note.date}</span>
                    <span>{note.readTime}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-rose-300 transition-colors leading-snug mb-3">
                    {note.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-5">
                    {note.summary}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-zinc-800/80 text-xs font-mono text-zinc-300 group-hover:text-white">
                  <span>Read Pattern &amp; Code</span>
                  <ChevronRight className="w-4 h-4 text-rose-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* ================================================================== */}
        {/* CONTACT & QUICK CONNECT SECTION                                    */}
        {/* ================================================================== */}
        <section
          id="contact"
          className="scroll-mt-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-zinc-900"
        >
          <div className="rounded-3xl bg-gradient-to-br from-zinc-900/90 via-zinc-900/70 to-zinc-950 border border-zinc-800 p-6 sm:p-10 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Left Info Column */}
              <div className="lg:col-span-5 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-300">
                  <MapPin className="w-3.5 h-3.5" />
                  Kerala, India — Remote / Relocation Ready
                </div>

                <h2 className="contact-heading text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Let’s Architect Your Next High-Scale System
                </h2>

                <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
                  Looking for a Staff or Senior Ruby on Rails / Full-Stack Engineer to lead
                  backend architecture, scale asynchronous pipelines, or ship AI-native web
                  applications? Reach out directly.
                </p>

                {/* One-Click Copy Email Box */}
                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <Mail className="w-4 h-4 text-rose-400 shrink-0" />
                    <span className="text-xs sm:text-sm font-mono text-zinc-200 truncate">
                      {emailAddress}
                    </span>
                  </div>
                  <button
                    onClick={handleCopyEmail}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs font-mono text-zinc-200 border border-zinc-700 shrink-0 cursor-pointer transition-colors"
                  >
                    {copiedEmail ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Social & Profile Links */}
                <div className="flex flex-wrap gap-3 pt-1">
                  <a
                    href="https://github.com/gokulputhenveettil"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-xs font-mono text-zinc-300 border border-zinc-800 transition-colors"
                  >
                    <GitBranch className="w-4 h-4 text-zinc-400" />
                    GitHub
                    <ExternalLink className="w-3 h-3 text-zinc-500" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/gokul-p-721a89134/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-xs font-mono text-zinc-300 border border-zinc-800 transition-colors"
                  >
                    <BriefcaseBadge />
                    LinkedIn
                    <ExternalLink className="w-3 h-3 text-zinc-500" />
                  </a>
                  <button
                    onClick={() => setIsResumeOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-xs font-mono text-rose-300 border border-rose-500/30 transition-colors cursor-pointer"
                  >
                    <FileText className="w-4 h-4" />
                    Interactive Resume
                  </button>
                </div>
              </div>

              {/* Right Quick Message Form */}
              <div className="lg:col-span-7">
                <div className="p-6 sm:p-8 rounded-2xl bg-zinc-950/90 border border-zinc-800/90">
                  {formSubmitted ? (
                    <div className="py-10 text-center space-y-4">
                      <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
                        <Check className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold text-white">
                        Message Dispatched
                      </h3>
                      <p className="text-sm text-zinc-400 max-w-md mx-auto">
                        Thanks for reaching out! Your note has been queued for Gokul. You
                        can also connect directly via{' '}
                        <span className="font-mono text-zinc-200">{emailAddress}</span>.
                      </p>
                      <button
                        onClick={() => setFormSubmitted(false)}
                        className="px-4 py-2 rounded-lg bg-zinc-900 text-xs font-mono text-zinc-300 border border-zinc-700 hover:bg-zinc-800 cursor-pointer"
                      >
                        Send Another Note
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                            Your Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={contactForm.name}
                            onChange={(e) =>
                              setContactForm({ ...contactForm, name: e.target.value })
                            }
                            placeholder="Sarah Jenkins"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                            Work Email *
                          </label>
                          <input
                            type="email"
                            required
                            value={contactForm.email}
                            onChange={(e) =>
                              setContactForm({ ...contactForm, email: e.target.value })
                            }
                            placeholder="sarah@company.com"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                          Inquiry Type
                        </label>
                        <select
                          value={contactForm.roleType}
                          onChange={(e) =>
                            setContactForm({ ...contactForm, roleType: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-200 focus:outline-none focus:border-rose-500"
                        >
                          <option>Senior / Staff Ruby on Rails Role</option>
                          <option>Full-Stack (Rails + React) Engineering Role</option>
                          <option>Distributed Systems / Architecture Advisory</option>
                          <option>General Engineering Connect</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                          Context / Role Details
                        </label>
                        <textarea
                          rows={4}
                          value={contactForm.message}
                          onChange={(e) =>
                            setContactForm({ ...contactForm, message: e.target.value })
                          }
                          placeholder="Share a brief overview of your engineering team, tech stack, or role..."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm shadow-lg shadow-rose-950/50 transition-all cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                        Send Direct Message
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ==================================================================== */}
      {/* FOOTER                                                               */}
      {/* ==================================================================== */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <div>
            © {new Date().getFullYear()} Gokul · Senior Ruby on Rails &amp; Distributed Systems Engineer
          </div>
          <div className="flex items-center gap-6">
            <a href="#case-studies" className="hover:text-zinc-300 transition-colors">
              Case Studies
            </a>
            <a href="#capabilities" className="hover:text-zinc-300 transition-colors">
              Stack
            </a>
            <a href="#notes" className="hover:text-zinc-300 transition-colors">
              Notes
            </a>
            <button
              onClick={() => setIsResumeOpen(true)}
              className="hover:text-rose-400 transition-colors cursor-pointer"
            >
              Resume
            </button>
          </div>
        </div>
      </footer>

      <ArchitectureModal
        study={selectedCaseStudy}
        onClose={() => setSelectedCaseStudy(null)}
      />
      <EngineeringNoteModal
        note={selectedNote}
        onClose={() => setSelectedNote(null)}
      />
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />
    </div>
  );
}

// Small helper icon for LinkedIn link
function BriefcaseBadge() {
  return (
    <svg
      className="w-4 h-4 text-cyan-400"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}