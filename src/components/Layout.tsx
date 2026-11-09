import { useState, useEffect } from 'react'
import { Outlet, NavLink, Link, useNavigate, useLocation } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { toolIcons, categoryColors } from '../lib/toolIcons'

const categories = [
  {
    name: 'Text & Encoding', dot: '#8b5cf6', key: 'Text & Encoding',
    tools: [
      { path: '/tools/base64', label: 'Base64' },
      { path: '/tools/text-escape', label: 'Text Escape' },
      { path: '/tools/case-converter', label: 'Case Converter' },
      { path: '/tools/text-diff', label: 'Text Diff' },
      { path: '/tools/markdown', label: 'Markdown Preview' },
    ],
  },
  {
    name: 'Data & Formats', dot: '#3b82f6', key: 'Data & Formats',
    tools: [
      { path: '/tools/json-formatter', label: 'JSON Formatter' },
      { path: '/tools/jsonpath', label: 'JSONPath Tester' },
      { path: '/tools/csv-json', label: 'CSV ↔ JSON' },
      { path: '/tools/sql', label: 'SQL Formatter' },
    ],
  },
  {
    name: 'Network & Web', dot: '#06b6d4', key: 'Network & Web',
    tools: [
      { path: '/tools/url-builder', label: 'URL Builder' },
      { path: '/tools/http-headers', label: 'HTTP Headers' },
      { path: '/tools/api-request', label: 'API Request' },
      { path: '/tools/http-status', label: 'HTTP Status' },
      { path: '/tools/mime', label: 'MIME Lookup' },
    ],
  },
  {
    name: 'Security & Crypto', dot: '#10b981', key: 'Security & Crypto',
    tools: [
      { path: '/tools/hash', label: 'Hash Generator' },
      { path: '/tools/jwt', label: 'JWT Inspector' },
    ],
  },
  {
    name: 'Generators', dot: '#f59e0b', key: 'Generators',
    tools: [
      { path: '/tools/uuid', label: 'UUID Generator' },
      { path: '/tools/fixture', label: 'Fixture Generator' },
      { path: '/tools/regex', label: 'Regex Tester' },
      { path: '/tools/cron', label: 'Cron Parser' },
    ],
  },
  {
    name: 'Date & Time', dot: '#f97316', key: 'Date & Time',
    tools: [
      { path: '/tools/epoch', label: 'Epoch Converter' },
    ],
  },
  {
    name: 'Colors & Design', dot: '#ec4899', key: 'Colors & Design',
    tools: [
      { path: '/tools/color-converter', label: 'Color Converter' },
      { path: '/tools/color-picker', label: 'Color Picker' },
    ],
  },
  {
    name: 'Media & Files', dot: '#ef4444', key: 'Media & Files',
    tools: [
      { path: '/tools/image', label: 'Image Utility' },
      { path: '/tools/screenshot-framer', label: 'Screenshot Framer' },
    ],
  },
  {
    name: 'Dev Utilities', dot: '#6366f1', key: 'Dev Utilities',
    tools: [
      { path: '/tools/permissions', label: 'Permissions Calc' },
      { path: '/tools/invoice', label: 'Invoice Generator' },
    ],
  },
]

const allToolsFlat = categories.flatMap(c =>
  c.tools.map(t => ({ ...t, category: c.name, dot: c.dot }))
)

function SunIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
    </svg>
  )
}

// Small 14px icon wrapper
function SmallIcon({ path: toolPath }: { path: string }) {
  const icon = toolIcons[toolPath]
  if (!icon) return null
  return (
    <span style={{ width: 14, height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, opacity: 0.7 }}>
      <span style={{ transform: 'scale(0.78)', transformOrigin: 'center', display: 'flex' }}>{icon}</span>
    </span>
  )
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

  // Cmd+K to focus search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        const input = document.getElementById('sidebar-search') as HTMLInputElement
        input?.focus()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const currentTool = allToolsFlat.find(t => t.path === location.pathname)

  const sidebar = (
    <aside style={{
      width: 248, flexShrink: 0, height: '100%',
      background: 'var(--bg-surface)',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Logo */}
      <div style={{ padding: '16px 16px 14px', flexShrink: 0 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9, background: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            boxShadow: '0 0 16px var(--accent-muted)',
          }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--bg-base)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
            </svg>
          </div>
          <div>
            <div style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>DevForge</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.03em' }}>27 tools · client-side</div>
          </div>
        </Link>
      </div>

      {/* Search */}
      <div style={{ padding: '0 10px 12px', flexShrink: 0, position: 'relative' }}>
        <div style={{ position: 'relative' }}>
          <svg style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            id="sidebar-search"
            type="text" placeholder="Search tools..." value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={handleSearchKey}
            style={{
              width: '100%', boxSizing: 'border-box',
              paddingLeft: 30, paddingRight: 38, paddingTop: 7, paddingBottom: 7,
              borderRadius: 8, fontSize: 12.5,
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)', outline: 'none',
              transition: 'border-color 0.15s',
            }}
            onFocus={e => { e.currentTarget.style.borderColor = 'var(--accent)' }}
            onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)' }}
          />
          <kbd style={{
            position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
            fontSize: 10, color: 'var(--text-muted)',
            background: 'var(--bg-surface)', border: '1px solid var(--border)',
            borderRadius: 4, padding: '1px 5px', fontFamily: 'inherit', pointerEvents: 'none',
          }}>⌘K</kbd>
        </div>

        {/* Search dropdown */}
        {searchResults && (
          <div style={{
            position: 'absolute', left: 10, right: 10, top: 'calc(100% - 4px)',
            zIndex: 100, background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            borderRadius: 10, boxShadow: '0 12px 32px rgba(0,0,0,0.2)',
            overflow: 'hidden',
          }}>
            {searchResults.length === 0
              ? <p style={{ padding: '10px 12px', fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>No results</p>
              : searchResults.map(t => {
                  const cat = categoryColors[t.category]
                  return (
                    <NavLink key={t.path} to={t.path} onClick={() => setSearch('')}
                      style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', fontSize: 12.5, color: 'var(--text-secondary)', textDecoration: 'none' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-surface)' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                    >
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: cat?.dot ?? 'var(--accent)', flexShrink: 0 }} />
                      <span style={{ flex: 1 }}>{t.label}</span>
                      <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{t.category}</span>
                    </NavLink>
                  )
                })
            }
          </div>
        )}
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'var(--border)', flexShrink: 0, margin: '0 10px' }} />

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '10px 8px 16px' }}>
        {/* Top links */}
        <div style={{ marginBottom: 6 }}>
          {[
            { to: '/', end: true, label: 'Home', icon: (
              <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
              </svg>
            )},
            { to: '/tools', end: true, label: 'All Tools', icon: (
              <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/>
                <rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>
              </svg>
            )},
          ].map(({ to, end, label, icon }) => (
            <NavLink key={to} to={to} end={end}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '6px 10px', borderRadius: 7, marginBottom: 2,
                fontSize: 13, textDecoration: 'none', fontWeight: isActive ? 600 : 400,
                color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                background: isActive ? 'var(--accent-muted)' : 'transparent',
                transition: 'background 0.1s, color 0.1s',
              })}
              onMouseEnter={e => {
                const el = e.currentTarget
                if (el.style.background === 'transparent' || el.style.background === '') {
                  el.style.background = 'var(--bg-elevated)'
                }
              }}
              onMouseLeave={e => {
                const el = e.currentTarget
                // Only reset if not active (active has accent-muted)
                if (!el.style.color.includes('accent') && el.className.indexOf('active') === -1) {
                  el.style.background = 'transparent'
                }
              }}
            >
              <span style={{ opacity: 0.7, flexShrink: 0 }}>{icon}</span>
              {label}
            </NavLink>
          ))}
        </div>

        <div style={{ height: 1, background: 'var(--border)', margin: '8px 2px 10px' }} />

        {/* Categories */}
        {categories.map(cat => {
          const catColor = categoryColors[cat.key]
          return (
            <div key={cat.name} style={{ marginBottom: 2 }}>
              {/* Category header */}
              <button
                onClick={() => setExpanded(p => ({ ...p, [cat.name]: !p[cat.name] }))}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  width: '100%', padding: '5px 10px 5px 8px',
                  background: 'none', border: 'none', cursor: 'pointer', borderRadius: 5,
                  marginBottom: expanded[cat.name] ? 3 : 0,
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-elevated)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'none' }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 4, height: 4, borderRadius: '50%', background: cat.dot, flexShrink: 0 }} />
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    {cat.name}
                  </span>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)', background: 'var(--bg-elevated)', borderRadius: 4, padding: '1px 5px', fontWeight: 500 }}>
                    {cat.tools.length}
                  </span>
                  <svg width="9" height="9" fill="currentColor" viewBox="0 0 20 20"
                    style={{ color: 'var(--text-muted)', transform: expanded[cat.name] ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.15s' }}>
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
              </button>

              {/* Tool items */}
              {expanded[cat.name] && (
                <div style={{ paddingBottom: 4 }}>
                  {cat.tools.map(tool => (
                    <NavLink
                      key={tool.path}
                      to={tool.path}
                      style={({ isActive }) => ({
                        display: 'flex', alignItems: 'center', gap: 7,
                        padding: '5px 10px 5px 14px',
                        borderRadius: 7, marginBottom: 1,
                        fontSize: 12.5, textDecoration: 'none',
                        fontWeight: isActive ? 500 : 400,
                        color: isActive ? (catColor?.text ?? 'var(--accent)') : 'var(--text-secondary)',
                        background: isActive ? (catColor ? `${catColor.dot}14` : 'var(--accent-muted)') : 'transparent',
                        transition: 'background 0.1s, color 0.1s',
                      })}
                      onMouseEnter={e => {
                        const el = e.currentTarget
                        if (!el.style.background || el.style.background === 'transparent') {
                          el.style.background = 'var(--bg-elevated)'
                        }
                      }}
                      onMouseLeave={e => {
                        const el = e.currentTarget
                        const isActive = location.pathname === tool.path
                        if (!isActive) el.style.background = 'transparent'
                        else el.style.background = catColor ? `${catColor.dot}14` : 'var(--accent-muted)'
                      }}
                    >
                      <span style={{ color: location.pathname === tool.path ? (catColor?.text ?? 'var(--accent)') : 'var(--text-muted)', flexShrink: 0 }}>
                        <SmallIcon path={tool.path} />
                      </span>
                      {tool.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: '10px 14px', borderTop: '1px solid var(--border)', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
        <a href="https://github.com/azputra/devtools" target="_blank" rel="noopener noreferrer"
          style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text-muted)', textDecoration: 'none' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)' }}
        >
          <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.49.5.09.68-.22.68-.48l-.01-1.69c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0112 6.8c.85.004 1.7.115 2.5.337 1.909-1.294 2.747-1.023 2.747-1.023.546 1.372.202 2.386.1 2.638.64.7 1.028 1.595 1.028 2.682 0 3.841-2.337 4.687-4.565 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .269.18.579.688.482A10.019 10.019 0 0022 12c0-5.52-4.48-10-10-10z"/>
          </svg>
          GitHub
        </a>
        <span style={{ marginLeft: 'auto', fontSize: 10.5, color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>v1.0</span>
      </div>
    </aside>
  )

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg-base)' }}>
      {/* Desktop sidebar */}
      <div className="hidden md:block" style={{ flexShrink: 0, height: '100%' }}>
        {sidebar}
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="md:hidden" style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex' }}>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)' }} onClick={() => setMobileOpen(false)} />
          <div style={{ position: 'relative', zIndex: 10, height: '100%' }}>{sidebar}</div>
        </div>
      )}

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        {/* Header */}
        <header style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 20px', height: 46,
          background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button className="md:hidden" onClick={() => setMobileOpen(true)}
              style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
            </button>
            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
              <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 500 }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)' }}
              >DevForge</Link>
              {currentTool && (
                <>
                  <span style={{ color: 'var(--text-muted)', opacity: 0.5 }}>/</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{currentTool.label}</span>
                </>
              )}
              {location.pathname === '/tools' && (
                <>
                  <span style={{ color: 'var(--text-muted)', opacity: 0.5 }}>/</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>All Tools</span>
                </>
              )}
            </div>
          </div>

          <button onClick={toggle}
            style={{
              display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px',
              borderRadius: 6, background: 'var(--bg-elevated)',
              border: '1px solid var(--border)', color: 'var(--text-secondary)',
              cursor: 'pointer', fontSize: 11.5, fontWeight: 500,
            }}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
        </header>

        <main style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
