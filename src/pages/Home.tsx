import { Link } from 'react-router-dom'
import ToolCard from '../components/ToolCard'

const featured = [
  { path: '/tools/json-formatter', label: 'JSON Formatter', description: 'Prettify, minify and validate JSON with syntax highlighting', category: 'Data & Formats', categoryColor: 'text-blue-500', icon: '{}' },
  { path: '/tools/regex', label: 'Regex Tester', description: 'Live regex matching with match highlighting and flags', category: 'Generators', categoryColor: 'text-yellow-500', icon: '.*' },
  { path: '/tools/jwt', label: 'JWT Inspector', description: 'Decode JWT header, payload and check expiry instantly', category: 'Security & Crypto', categoryColor: 'text-green-500', icon: '🔑' },
  { path: '/tools/uuid', label: 'UUID Generator', description: 'Generate up to 50 UUIDs at once', category: 'Generators', categoryColor: 'text-yellow-500', icon: '#' },
  { path: '/tools/hash', label: 'Hash Generator', description: 'SHA-1, SHA-256, SHA-512 via Web Crypto API', category: 'Security & Crypto', categoryColor: 'text-green-500', icon: '##' },
  { path: '/tools/color-converter', label: 'Color Converter', description: 'Convert HEX, RGB, HSL + contrast ratio checker', category: 'Colors & Design', categoryColor: 'text-pink-500', icon: '🎨' },
]

const stats = [
  {
    label: 'Tools',
    value: '27',
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
      </svg>
    ),
  },
  {
    label: 'Categories',
    value: '9',
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
  },
  {
    label: '100% Local',
    value: '0 kb',
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="2" y="3" width="20" height="14" rx="2"/><path strokeLinecap="round" d="M8 21h8M12 17v4"/>
      </svg>
    ),
  },
  {
    label: 'Open Source',
    value: 'Free',
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.49.5.09.68-.22.68-.48l-.01-1.69c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0112 6.8c.85.004 1.7.115 2.5.337 1.909-1.294 2.747-1.023 2.747-1.023.546 1.372.202 2.386.1 2.638.64.7 1.028 1.595 1.028 2.682 0 3.841-2.337 4.687-4.565 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .269.18.579.688.482A10.019 10.019 0 0022 12c0-5.52-4.48-10-10-10z"/>
      </svg>
    ),
  },
]

const features = [
  {
    title: 'Local-first',
    description: 'All processing happens in your browser. No data ever leaves your machine.',
    icon: '🔒',
  },
  {
    title: 'No tracking',
    description: 'No analytics, no cookies, no sign-up. Your work stays private.',
    icon: '🛡️',
  },
  {
    title: 'Instant',
    description: 'No server round-trips. Results appear as you type.',
    icon: '⚡',
  },
]

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero */}
      <div
        className="text-center py-14 mb-10 relative rounded-2xl overflow-hidden px-6"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99,102,241,0.12) 0%, transparent 70%)',
        }}
      >
        <div
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium mb-6"
          style={{
            background: 'var(--accent-muted)',
            border: '1px solid rgba(99,102,241,0.2)',
            color: 'var(--accent)',
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--accent)' }} />
          27 tools · all client-side
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight leading-tight">
          <span
            className="bg-clip-text"
            style={{
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundImage: 'linear-gradient(135deg, #6366f1, #8b5cf6, #a78bfa)',
            }}
          >
            Build Faster.
          </span>
          <br />
          <span style={{ color: 'var(--text-primary)' }}>Debug Smarter.</span>
        </h1>

        <p className="text-lg max-w-xl mx-auto leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
          27 developer tools. All client-side. No sign-up, no tracking.
        </p>

        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link to="/tools" className="btn-primary px-6 py-2.5 text-sm">
            Browse Tools
          </Link>
          <Link
            to="/tools/json-formatter"
            className="btn-secondary px-6 py-2.5 text-sm"
          >
            JSON Formatter →
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
        {stats.map(s => (
          <div
            key={s.label}
            className="rounded-xl p-4 text-center"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
          >
            <div className="flex justify-center mb-2" style={{ color: 'var(--accent)' }}>{s.icon}</div>
            <div className="text-2xl font-bold mb-0.5" style={{ color: 'var(--accent)' }}>{s.value}</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Popular Tools */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Popular Tools</h2>
          <Link
            to="/tools"
            className="text-sm transition-colors"
            style={{ color: 'var(--accent)' }}
          >
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {featured.map(t => (
            <ToolCard key={t.path} {...t} />
          ))}
        </div>
      </div>

      {/* Why DevForge */}
      <div>
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Why DevForge?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {features.map(f => (
            <div
              key={f.title}
              className="rounded-xl p-5"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
            >
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="font-semibold mb-1 text-sm" style={{ color: 'var(--text-primary)' }}>{f.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
