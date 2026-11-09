import { useState, useEffect } from 'react'
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom'

const categories = [
  {
    name: 'Text & Encoding',
    icon: '✦',
    color: 'text-violet-400',
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
    icon: '◈',
    color: 'text-blue-400',
    tools: [
      { path: '/tools/json-formatter', label: 'JSON Formatter' },
      { path: '/tools/jsonpath', label: 'JSONPath Tester' },
      { path: '/tools/csv-json', label: 'CSV ↔ JSON' },
      { path: '/tools/sql', label: 'SQL Formatter' },
    ],
  },
  {
    name: 'Network & Web',
    icon: '⬡',
    color: 'text-cyan-400',
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
    icon: '⬣',
    color: 'text-green-400',
    tools: [
      { path: '/tools/hash', label: 'Hash Generator' },
      { path: '/tools/jwt', label: 'JWT Inspector' },
    ],
  },
  {
    name: 'Generators',
    icon: '◎',
    color: 'text-yellow-400',
    tools: [
      { path: '/tools/uuid', label: 'UUID Generator' },
      { path: '/tools/fixture', label: 'Fixture Generator' },
      { path: '/tools/regex', label: 'Regex Tester' },
      { path: '/tools/cron', label: 'Cron Parser' },
    ],
  },
  {
    name: 'Date & Time',
    icon: '◷',
    color: 'text-orange-400',
    tools: [
      { path: '/tools/epoch', label: 'Epoch Converter' },
    ],
  },
  {
    name: 'Colors & Design',
    icon: '◉',
    color: 'text-pink-400',
    tools: [
      { path: '/tools/color-converter', label: 'Color Converter' },
      { path: '/tools/color-picker', label: 'Color Picker' },
    ],
  },
  {
    name: 'Media & Files',
    icon: '▣',
    color: 'text-red-400',
    tools: [
      { path: '/tools/image', label: 'Image Utility' },
      { path: '/tools/screenshot-framer', label: 'Screenshot Framer' },
    ],
  },
  {
    name: 'Dev Utilities',
    icon: '◆',
    color: 'text-indigo-400',
    tools: [
      { path: '/tools/permissions', label: 'Permissions Calc' },
      { path: '/tools/invoice', label: 'Invoice Generator' },
    ],
  },
]

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const navigate = useNavigate()

  // expand all by default
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
    }
  }

  const Sidebar = () => (
    <aside className="flex flex-col h-full w-64 bg-gray-900 border-r border-gray-800">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-4 border-b border-gray-800">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
          DT
        </div>
        <Link to="/" className="text-white font-semibold text-base tracking-tight">DevTools</Link>
      </div>

      {/* Search */}
      <div className="px-3 py-3 border-b border-gray-800">
        <div className="relative">
          <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search tools..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={handleSearchKey}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        {/* Search results dropdown */}
        {filtered && (
          <div className="mt-1.5 bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
            {filtered.length === 0 ? (
              <p className="px-3 py-2 text-xs text-gray-500">No results</p>
            ) : (
              filtered.map(t => (
                <NavLink
                  key={t.path}
                  to={t.path}
                  onClick={() => setSearch('')}
                  className="block px-3 py-2 text-xs text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
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
            `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors mb-1 ${
              isActive ? 'bg-indigo-600/20 text-indigo-300' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
            }`
          }
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Home
        </NavLink>
        <NavLink
          to="/tools"
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors mb-3 ${
              isActive ? 'bg-indigo-600/20 text-indigo-300' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
            }`
          }
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          All Tools
        </NavLink>

        {categories.map(cat => (
          <div key={cat.name} className="mb-1">
            <button
              onClick={() => setExpanded(p => ({ ...p, [cat.name]: !p[cat.name] }))}
              className="flex items-center justify-between w-full px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-800"
            >
              <span className="flex items-center gap-1.5">
                <span className={cat.color}>{cat.icon}</span>
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
                      `block px-3 py-1.5 rounded-lg text-xs transition-colors ${
                        isActive
                          ? 'bg-indigo-600/20 text-indigo-300 font-medium'
                          : 'text-gray-500 hover:text-gray-200 hover:bg-gray-800'
                      }`
                    }
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
    <div className="flex h-screen overflow-hidden bg-gray-950">
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex flex-col flex-1 max-w-xs w-full">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar (mobile) */}
        <header className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-gray-800 bg-gray-900">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-400 hover:text-gray-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="text-white font-semibold">DevTools</span>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
