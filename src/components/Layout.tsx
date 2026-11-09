import { useState, useEffect } from 'react'
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

const categories = [
  {
    name: 'Text & Encoding',
    color: 'text-violet-500',
    dot: '#8b5cf6',
    tools: [
      { path: '/tools/base64', label: 'Base64' },
      { path: '/tools/text-escape', label: 'Text Escape' },
      { path: '/tools/case-converter', label: 'Case Converter' },
      { path: '/tools/text-diff', label: 'Text Diff' },
      { path: '/tools/markdown', label: 'Markdown Preview' },
    ],
  },
  {
    name: 'Data & Formats',
    color: 'text-blue-500',
    dot: '#3b82f6',
    tools: [
      { path: '/tools/json-formatter', label: 'JSON Formatter' },
      { path: '/tools/jsonpath', label: 'JSONPath Tester' },
      { path: '/tools/csv-json', label: 'CSV ↔ JSON' },
      { path: '/tools/sql', label: 'SQL Formatter' },
    ],
  },
  {
    name: 'Network & Web',
    color: 'text-cyan-500',
    dot: '#06b6d4',
    tools: [
      { path: '/tools/url-builder', label: 'URL Builder' },
      { path: '/tools/http-headers', label: 'HTTP Headers' },
      { path: '/tools/api-request', label: 'API Request' },
      { path: '/tools/http-status', label: 'HTTP Status' },
      { path: '/tools/mime', label: 'MIME Lookup' },
    ],
  },
  {
    name: 'Security & Crypto',
    color: 'text-green-500',
    dot: '#22c55e',
    tools: [
      { path: '/tools/hash', label: 'Hash Generator' },
      { path: '/tools/jwt', label: 'JWT Inspector' },
    ],
  },
  {
    name: 'Generators',
    color: 'text-yellow-500',
    dot: '#eab308',
    tools: [
      { path: '/tools/uuid', label: 'UUID Generator' },
      { path: '/tools/fixture', label: 'Fixture Generator' },
      { path: '/tools/regex', label: 'Regex Tester' },
      { path: '/tools/cron', label: 'Cron Parser' },
    ],
  },
  {
    name: 'Date & Time',
    color: 'text-orange-500',
    dot: '#f97316',
    tools: [
      { path: '/tools/epoch', label: 'Epoch Converter' },
    ],
  },
  {
    name: 'Colors & Design',
    color: 'text-pink-500',
    dot: '#ec4899',
    tools: [
      { path: '/tools/color-converter', label: 'Color Converter' },
      { path: '/tools/color-picker', label: 'Color Picker' },
    ],
  },
  {
    name: 'Media & Files',
    color: 'text-red-500',
    dot: '#ef4444',
    tools: [
      { path: '/tools/image', label: 'Image Utility' },
      { path: '/tools/screenshot-framer', label: 'Screenshot Framer' },
    ],
  },
  {
    name: 'Dev Utilities',
    color: 'text-indigo-500',
    dot: '#6366f1',
    tools: [
      { path: '/tools/permissions', label: 'Permissions Calc' },
      { path: '/tools/invoice', label: 'Invoice Generator' },
    ],
  },
]

function SunIcon() {
  return (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
    </svg>
  )
}

function ForgeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
    </svg>
  )
}

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const navigate = useNavigate()
  const { theme, toggle } = useTheme()

  useEffect(() => {
    const init: Record<string, boolean> = {}
    categories.forEach(c => { init[c.name] = true })
    setExpanded(init)
  }, [])

  const allTools = categories.flatMap(c => c.tools)
  const filtered = search.trim()
    ? allTools.filter(t => t.label.toLowerCase().includes(search.toLowerCase()))
    : null

  const handleSearchKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && filtered && filtered.length > 0) {
      navigate(filtered[0].path)
      setSearch('')
      setSidebarOpen(false)
    }
  }

  const Sidebar = () => (
    <aside
      className="flex flex-col h-full"
      style={{
        width: 260,
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border)',
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-2.5 px-4 py-4 flex-shrink-0"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--accent)' }}>
          <ForgeIcon />
        </div>
        <Link to="/" className="font-bold text-base tracking-tight" style={{ color: 'var(--text-primary)' }}>
          DevForge
        </Link>
      </div>

      {/* Search */}
      <div className="px-3 py-3 flex-shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="relative">
          <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search tools..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={handleSearchKey}
            className="w-full rounded-lg pl-8 pr-16 py-1.5 text-xs focus:outline-none"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
            }}
          />
          <span
            className="absolute right-2 top-1/2 -translate-y-1/2 text-xs px-1.5 py-0.5 rounded font-mono"
            style={{ background: 'var(--bg-base)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
          >
            ⌘K
          </span>
        </div>
        {filtered && (
          <div
            className="mt-1.5 rounded-lg overflow-hidden"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
          >
            {filtered.length === 0 ? (
              <p className="px-3 py-2 text-xs" style={{ color: 'var(--text-muted)' }}>No results</p>
            ) : (
              filtered.map(t => (
                <NavLink
                  key={t.path}
                  to={t.path}
                  onClick={() => { setSearch(''); setSidebarOpen(false) }}
                  className="block px-3 py-2 text-xs transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {t.label}
                </NavLink>
              ))
            )}
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2 px-2">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors mb-1 ${isActive ? 'font-medium' : ''}`
          }
          style={({ isActive }) => ({
            background: isActive ? 'var(--accent-muted)' : 'transparent',
            color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
            borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
          })}
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Home
        </NavLink>
        <NavLink
          to="/tools"
          end
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors mb-3 ${isActive ? 'font-medium' : ''}`
          }
          style={({ isActive }) => ({
            background: isActive ? 'var(--accent-muted)' : 'transparent',
            color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
            borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
          })}
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          All Tools
        </NavLink>

        {categories.map(cat => (
          <div key={cat.name} className="mb-1">
            <button
              onClick={() => setExpanded(p => ({ ...p, [cat.name]: !p[cat.name] }))}
              className="flex items-center justify-between w-full px-3 py-1.5 text-xs font-medium rounded-lg transition-colors"
              style={{ color: 'var(--text-muted)' }}
            >
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cat.dot }} />
                {cat.name}
              </span>
              <svg
                className={`w-3 h-3 transition-transform ${expanded[cat.name] ? 'rotate-90' : ''}`}
                fill="currentColor" viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            {expanded[cat.name] && (
              <div className="ml-2 mt-0.5 space-y-0.5">
                {cat.tools.map(tool => (
                  <NavLink
                    key={tool.path}
                    to={tool.path}
                    className={({ isActive }) =>
                      `block px-3 py-1.5 rounded-lg text-xs transition-colors ${isActive ? 'font-medium' : ''}`
                    }
                    style={({ isActive }) => ({
                      background: isActive ? 'var(--accent-muted)' : 'transparent',
                      color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                      borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                    })}
                  >
                    {tool.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  )

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex flex-col flex-shrink-0 z-10" style={{ width: 260 }}>
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header
          className="flex items-center justify-between px-4 h-12 flex-shrink-0"
          style={{
            background: 'var(--bg-surface)',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden"
              style={{ color: 'var(--text-muted)' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <span className="font-semibold md:hidden" style={{ color: 'var(--text-primary)' }}>DevForge</span>
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggle}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              color: 'var(--text-secondary)',
            }}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            <span className="text-xs font-medium hidden sm:inline">
              {theme === 'dark' ? 'Light' : 'Dark'}
            </span>
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
