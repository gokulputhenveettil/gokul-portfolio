import { Printer, X, Zap } from 'lucide-react';

export function ArchitectureModal({ study, onClose }) {
  if (!study) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-zinc-950 border border-zinc-800 p-6 sm:p-8 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 pb-5 border-b border-zinc-800">
          <div>
            <div className="text-xs font-mono text-rose-400 uppercase tracking-wider mb-1">
              System Architecture Blueprint
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">{study.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="my-6 space-y-3">
          <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
            Data &amp; Execution Topology
          </div>
          {study.architectureDiagram.map((tier, index) => (
            <div key={tier.layer} className="space-y-2">
              <div className={`p-4 rounded-xl border ${tier.color}`}>
                <div className="text-[11px] font-mono uppercase tracking-wider opacity-80 mb-2">
                  Layer {index + 1}: {tier.layer}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {tier.nodes.map((node) => (
                    <div
                      key={node}
                      className="px-3 py-2 rounded-lg bg-zinc-950/90 border border-zinc-800 text-xs font-mono text-zinc-200 text-center"
                    >
                      {node}
                    </div>
                  ))}
                </div>
              </div>
              {index < study.architectureDiagram.length - 1 && (
                <div className="flex justify-center text-zinc-600 text-xs font-mono">
                  ↓ async / low-latency boundary ↓
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-5 rounded-xl bg-zinc-900/70 border border-zinc-800 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400">
            <Zap className="w-4 h-4" />
            Key Architectural Trade-offs &amp; Safeguards
          </div>
          <ul className="space-y-2.5">
            {study.tradeoffs.map((item) => (
              <li
                key={item}
                className="text-xs sm:text-sm text-zinc-300 leading-relaxed flex items-start gap-2.5"
              >
                <span className="text-rose-400 font-mono mt-0.5">→</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function EngineeringNoteModal({ note, onClose }) {
  if (!note) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-zinc-950 border border-zinc-800 p-6 sm:p-8 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-zinc-800">
          <div>
            <div className="text-xs font-mono text-emerald-400 mb-1">
              {note.date} · {note.tag}
            </div>
            <h3 className="text-xl font-bold text-white leading-snug">{note.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="my-5 space-y-4">
          <p className="text-sm text-zinc-300 leading-relaxed">{note.summary}</p>

          <div className="space-y-2.5">
            <div className="text-xs font-mono uppercase tracking-wider text-zinc-400">
              Production Guidelines
            </div>
            {note.keyTakeaways.map((point, index) => (
              <div
                key={point}
                className="p-3.5 rounded-xl bg-zinc-900/70 border border-zinc-800/90 text-xs sm:text-sm text-zinc-300 leading-relaxed flex gap-2.5"
              >
                <span className="font-mono text-rose-400 font-bold">
                  {String(index + 1).padStart(2, '0')}.
                </span>
                <span>{point}</span>
              </div>
            ))}
          </div>

          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
              Reference Implementation (Ruby)
            </div>
            <pre className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-cyan-200 overflow-x-auto leading-relaxed">
              <code>{note.codeSnippet}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ResumeModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      className="resume-print-overlay fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="resume-print-paper w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-zinc-950 border border-zinc-800 p-6 sm:p-8 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-zinc-800">
          <div>
            <h3 className="text-xl font-bold text-white">
              Gokul — Executive Engineering Resume
            </h3>
            <p className="text-xs font-mono text-zinc-400 mt-0.5">
              9.3+ Years · Ruby on Rails · Distributed Systems · React
            </p>
          </div>
          <div className="resume-print-controls flex items-center gap-2.5">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-mono font-semibold cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="resume-print-close p-2 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="resume-print-content mt-6 space-y-6 text-sm text-zinc-300">
          <section className="resume-print-section">
            <h4 className="text-xs font-mono uppercase tracking-wider text-rose-400 mb-2">
              Summary
            </h4>
            <p className="leading-relaxed text-zinc-300">
              Senior Backend &amp; Full-Stack Software Engineer with 9.3+ years of
              experience building high-throughput Ruby on Rails platforms,
              multi-database enterprise APIs, event-sourced architectures, and
              real-time React applications. Proven track record optimizing database
              performance, Sidekiq fan-out pipelines, and LLM-integrated workflows.
            </p>
          </section>

          <section className="resume-print-section">
            <h4 className="text-xs font-mono uppercase tracking-wider text-rose-400 mb-3">
              Experience Highlights
            </h4>
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
              <div className="flex flex-wrap justify-between gap-2">
                <span className="font-bold text-white">
                  Senior Software Engineer — Cornerstone OnDemand
                </span>
                <span className="text-xs font-mono text-zinc-400">
                  Enterprise LMS Platform
                </span>
              </div>
              <ul className="list-disc list-inside text-xs sm:text-sm text-zinc-400 space-y-1.5 pt-1">
                <li>
                  Architected multi-database routing and read-replica optimizations for
                  high-concurrency LMS APIs.
                </li>
                <li>
                  Designed isolated Sidekiq worker queues processing millions of
                  asynchronous compliance and enrollment records reliably.
                </li>
                <li>
                  Collaborated across distributed product teams on API contracts,
                  observability (New Relic/Kibana), and zero-downtime migrations.
                </li>
              </ul>
            </div>
          </section>

          <section className="resume-print-section">
            <h4 className="text-xs font-mono uppercase tracking-wider text-rose-400 mb-2">
              Core Technical Skills
            </h4>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-mono">
              Ruby (3.3/3.4) · Ruby on Rails (7/8) · PostgreSQL · MySQL · Redis ·
              Sidekiq · ActionCable · Rails Event Store (CQRS) · Kafka · React.js ·
              Redux · TypeScript · Tailwind CSS · OpenAI / LLM Streaming · AWS ·
              Docker · Kubernetes · RSpec
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
