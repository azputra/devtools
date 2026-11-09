import { useState, useEffect, useRef } from 'react'
import { Outlet, NavLink, Link, useNavigate, useLocation } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

const categories = [
  {
    name: 'Text & Encoding', dot: '#8b5cf6',
    tools: [
      { path: '/tools/base64', label: 'Base64' },
      { path: '/tools/text-escape', label: 'Text Escape' },
      { path: '/tools/case-converter', label: 'Case Converter' },
      { path: '/tools/text-diff', label: 'Text Diff' },
      { path: '/tools/markdown', label: 'Markdown Preview' },
    ],
  },
  {
    name: 'Data & Formats', dot: '#3b82f6',
    tools: [
      { path: '/tools/json-formatter', label: 'JSON Formatter' },
      { path: '/tools/jsonpath', label: 'JSONPath Tester' },
      { path: '/tools/csv-json', label: 'CSV ↔ JSON' },
      { path: '/tools/sql', label: 'SQL Formatter' },
    ],
  },
  {
    name: 'Network & Web', dot: '#06b6d4',
    tools: [
      { path: '/tools/url-builder', label: 'URL Builder' },
      { path: '/tools/http-headers', label: 'HTTP Headers' },
      { path: '/tools/api-request', label: 'API Request' },
      { path: '/tools/http-status', label: 'HTTP Status' },
      { path: '/tools/mime', label: 'MIME Lookup' },
    ],
  },
  {
    name: 'Security & Crypto', dot: '#10b981',
    tools: [
      { path: '/tools/hash', label: 'Hash Generator' },
      { path: '/tools/jwt', label: 'JWT Inspector' },
    ],
  },
  {
    name: 'Generators', dot: '#f59e0b',
    tools: [
      { path: '/tools/uuid', label: 'UUID Generator' },
      { path: '/tools/fixture', label: 'Fixture Generator' },
      { path: '/tools/regex', label: 'Regex Tester' },
      { path: '/tools/cron', label: 'Cron Parser' },
    ],
  },
  {
    name: 'Date & Time', dot: '#f97316',
    tools: [
      { path: '/tools/epoch', label: 'Epoch Converter' },
    ],
  },
  {
    name: 'Colors & Design', dot: '#ec4899',
    tools: [
      { path: '/tools/color-converter', label: 'Color Converter' },
      { path: '/tools/color-picker', label: 'Color Picker' },
    ],
  },
  {
    name: 'Media & Files', dot: '#ef4444',
    tools: [
      { path: '/tools/image', label: 'Image Utility' },
      { path: '/tools/screenshot-framer', label: 'Screenshot Framer' },
    ],
  },
  {
    name: 'Dev Utilities', dot: '#6366f1',
    tools: [
      { path: '/tools/permissions', label: 'Permissions Calc' },
      { path: '/tools/invoice', label: 'Invoice Generator' },
    ],
  },
]

const allToolsFlat = categories.flatMap(c => c.tools.map(t => ({ ...t, category: c.name, dot: c.dot })))

function Logo() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
    </svg>
  )
}

function SunIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
    </svg>
  )
}

const navItemBase: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 8,
  padding: '5px 10px', borderRadius: 6,
  fontSize: 13, fontWeight: 400,
  cursor: 'pointer', textDecoration: 'none',
  transition: 'background 0.1s, color 0.1s',
  borderLeft: '2px solid transparent',
  color: 'var(--text-secondary)',
  background: 'transparent',
}

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {}
    categories.forEach(c => { init[c.name] = true })
    return init
  })
  const navigate = useNavigate()
  const location = useLocation()
  const { theme, toggle } = useTheme()
  const sidebarScrollRef = useRef<HTMLElement>(null)

  // close mobile on nav
  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  const searchResults = search.trim()
    ? allToolsFlat.filter(t => t.label.toLowerCase().includes(search.toLowerCase()))
    : null

  const handleSearchKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchResults?.length) {
      navigate(searchResults[0].path)
      setSearch('')
    }
    if (e.key === 'Escape') setSearch('')
  }

  // Current tool label for header breadcrumb
  const currentTool = allToolsFlat.find(t => t.path === location.pathname)

  const sidebarContent = (
    <nav
      ref={sidebarScrollRef}
      style={{
        width: 240, flexShrink: 0, height: '100%',
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Logo */}
      <div style={{ padding: '14px 16px 12px', borderBottom: '1px solid var(--border)', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 28, height: 28, borderRadius: 7, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Logo />
        </div>
        <Link to="/" style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', textDecoration: 'none', letterSpacing: '-0.3px' }}>
          DevForge
        </Link>
        <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--text-muted)', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 4, padding: '1px 5px', fontWeight: 500 }}>v1</span>
      </div>

      {/* Search */}
      <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)', flexShrink: 0, position: 'relative' }}>
        <div style={{ position: 'relative' }}>
          <svg style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text" placeholder="Search tools..." value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={handleSearchKey}
            style={{ width: '100%', boxSizing: 'border-box', paddingLeft: 30, paddingRight: 36, paddingTop: 6, paddingBottom: 6, borderRadius: 7, fontSize: 12, background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }}
          />
          <span style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', fontSize: 10, color: 'var(--text-muted)', background: 'var(--bg-base)', border: '1px solid var(--border)', borderRadius: 4, padding: '1px 4px', fontFamily: 'monospace', pointerEvents: 'none' }}>⌘K</span>
        </div>
        {searchResults && (
          <div style={{ position: 'absolute', left: 12, right: 12, top: '100%', zIndex: 50, background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', overflow: 'hidden', marginTop: 4 }}>
            {searchResults.length === 0
              ? <p style={{ padding: '8px 12px', fontSize: 12, color: 'var(--text-muted)' }}>No results</p>
              : searchResults.map(t => (
                <NavLink key={t.path} to={t.path} onClick={() => setSearch('')}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', fontSize: 12, color: 'var(--text-secondary)', textDecoration: 'none' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-base)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: t.dot, flexShrink: 0 }} />
                  {t.label}
                  <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--text-muted)' }}>{t.category}</span>
                </NavLink>
              ))
            }
          </div>
        )}
      </div>

      {/* Nav links */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 8px' }}>
        {/* Top nav */}
        <div style={{ marginBottom: 12 }}>
          <NavLink to="/" end style={({ isActive }) => ({ ...navItemBase, background: isActive ? 'var(--accent-muted)' : 'transparent', color: isActive ? 'var(--accent)' : 'var(--text-secondary)', fontWeight: isActive ? 500 : 400, borderLeftColor: isActive ? 'var(--accent)' : 'transparent' })}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; if (!el.style.background || el.style.background === 'transparent') el.style.background = 'var(--bg-elevated)' }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; if (el.dataset.active !== 'true') el.style.background = '' }}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            Home
          </NavLink>
          <NavLink to="/tools" end style={({ isActive }) => ({ ...navItemBase, background: isActive ? 'var(--accent-muted)' : 'transparent', color: isActive ? 'var(--accent)' : 'var(--text-secondary)', fontWeight: isActive ? 500 : 400, borderLeftColor: isActive ? 'var(--accent)' : 'transparent' })}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; if (!el.style.background || el.style.background === 'transparent') el.style.background = 'var(--bg-elevated)' }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = '' }}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
            </svg>
            All Tools
          </NavLink>
        </div>

        {/* Categories */}
        {categories.map(cat => (
          <div key={cat.name} style={{ marginBottom: 4 }}>
            <button
              onClick={() => setExpanded(p => ({ ...p, [cat.name]: !p[cat.name] }))}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '4px 10px', background: 'none', border: 'none', cursor: 'pointer', borderRadius: 5, marginBottom: 2 }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: cat.dot, flexShrink: 0 }} />
                {cat.name}
              </span>
              <svg width="10" height="10" fill="currentColor" viewBox="0 0 20 20" style={{ color: 'var(--text-muted)', transform: expanded[cat.name] ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.15s', flexShrink: 0 }}>
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            {expanded[cat.name] && (
              <div style={{ paddingLeft: 10 }}>
                {cat.tools.map(tool => (
                  <NavLink
                    key={tool.path}
                    to={tool.path}
                    style={({ isActive }) => ({
                      display: 'block', padding: '5px 10px', borderRadius: 5,
                      fontSize: 12.5, textDecoration: 'none', marginBottom: 1,
                      color: isActive ? cat.dot : 'var(--text-secondary)',
                      background: isActive ? `${cat.dot}18` : 'transparent',
                      fontWeight: isActive ? 500 : 400,
                      borderLeft: `2px solid ${isActive ? cat.dot : 'transparent'}`,
                      transition: 'background 0.1s, color 0.1s',
                    })}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLElement
                      if (!el.style.backgroundColor || el.style.backgroundColor === 'transparent') {
                        el.style.background = 'var(--bg-elevated)'
                      }
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLElement
                      const isActive = el.style.borderLeftColor !== 'transparent' && el.style.borderLeftColor !== ''
                      if (!isActive) el.style.background = 'transparent'
                    }}
                  >
                    {tool.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ padding: '10px 12px', borderTop: '1px solid var(--border)', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
        <a href="https://github.com/azputra/devtools" target="_blank" rel="noopener noreferrer"
          style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-muted)', textDecoration: 'none' }}
        >
          <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.49.5.09.68-.22.68-.48l-.01-1.69c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0112 6.8c.85.004 1.7.115 2.5.337 1.909-1.294 2.747-1.023 2.747-1.023.546 1.372.202 2.386.1 2.638.64.7 1.028 1.595 1.028 2.682 0 3.841-2.337 4.687-4.565 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .269.18.579.688.482A10.019 10.019 0 0022 12c0-5.52-4.48-10-10-10z"/>
          </svg>
          Open source
        </a>
        <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--text-muted)' }}>27 tools</span>
      </div>
    </nav>
  )

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg-base)' }}>
      {/* Desktop sidebar */}
      <div className="hidden md:flex" style={{ flexShrink: 0 }}>
        {sidebarContent}
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="md:hidden" style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex' }}>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)' }} onClick={() => setMobileOpen(false)} />
          <div style={{ position: 'relative', zIndex: 10, height: '100%' }}>
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        {/* Header */}
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', height: 48, background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Mobile hamburger */}
            <button className="md:hidden" onClick={() => setMobileOpen(true)} style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
            </button>
            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-muted)' }}>
              <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 500 }}>DevForge</Link>
              {currentTool && (
                <>
                  <span style={{ opacity: 0.4 }}>/</span>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{currentTool.label}</span>
                </>
              )}
              {location.pathname === '/tools' && (
                <>
                  <span style={{ opacity: 0.4 }}>/</span>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>All Tools</span>
                </>
              )}
            </div>
          </div>

          <button
            onClick={toggle}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px', borderRadius: 20, background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 12, fontWeight: 500 }}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            <span style={{ fontSize: 11 }}>{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>
        </header>

        <main style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
