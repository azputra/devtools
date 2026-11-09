import { useState } from 'react'
import ToolCard from '../components/ToolCard'

const allTools = [
  // Text & Encoding
  { path: '/tools/base64', label: 'Base64', description: 'Encode and decode Base64 strings', category: 'Text & Encoding', categoryColor: 'text-violet-500', icon: 'B64' },
  { path: '/tools/text-escape', label: 'Text Escape', description: 'Encode/decode JSON strings and HTML entities', category: 'Text & Encoding', categoryColor: 'text-violet-500', icon: '\\n' },
  { path: '/tools/case-converter', label: 'Case Converter', description: 'Convert between camelCase, snake_case, kebab-case, UPPER, Title', category: 'Text & Encoding', categoryColor: 'text-violet-500', icon: 'Aa' },
  { path: '/tools/text-diff', label: 'Text Diff', description: 'Line-by-line diff of two texts using LCS algorithm', category: 'Text & Encoding', categoryColor: 'text-violet-500', icon: '±' },
  { path: '/tools/markdown', label: 'Markdown Preview', description: 'Split-pane markdown editor with live preview', category: 'Text & Encoding', categoryColor: 'text-violet-500', icon: 'MD' },
  // Data & Formats
  { path: '/tools/json-formatter', label: 'JSON Formatter', description: 'Prettify, minify and validate JSON with syntax highlighting', category: 'Data & Formats', categoryColor: 'text-blue-500', icon: '{}' },
  { path: '/tools/jsonpath', label: 'JSONPath Tester', description: 'Query JSON with dot/bracket notation path expressions', category: 'Data & Formats', categoryColor: 'text-blue-500', icon: '$.x' },
  { path: '/tools/csv-json', label: 'CSV ↔ JSON', description: 'Bidirectional CSV to JSON conversion with table preview', category: 'Data & Formats', categoryColor: 'text-blue-500', icon: 'CSV' },
  { path: '/tools/sql', label: 'SQL Formatter', description: 'Format SQL with keyword uppercase and proper indentation', category: 'Data & Formats', categoryColor: 'text-blue-500', icon: 'SQL' },
  // Network & Web
  { path: '/tools/url-builder', label: 'URL Builder', description: 'Parse and build URLs, edit query parameters visually', category: 'Network & Web', categoryColor: 'text-cyan-500', icon: '🔗' },
  { path: '/tools/http-headers', label: 'HTTP Headers', description: 'Inspect pasted headers, detect CORS, cache and duplicates', category: 'Network & Web', categoryColor: 'text-cyan-500', icon: 'HDR' },
  { path: '/tools/api-request', label: 'API Request Builder', description: 'Build and send HTTP requests from the browser, import cURL', category: 'Network & Web', categoryColor: 'text-cyan-500', icon: 'API' },
  { path: '/tools/http-status', label: 'HTTP Status', description: 'Look up HTTP status codes with descriptions and categories', category: 'Network & Web', categoryColor: 'text-cyan-500', icon: '200' },
  { path: '/tools/mime', label: 'MIME Lookup', description: 'Look up MIME types by file extension and vice versa', category: 'Network & Web', categoryColor: 'text-cyan-500', icon: 'MIME' },
  // Security & Crypto
  { path: '/tools/hash', label: 'Hash Generator', description: 'SHA-1, SHA-256, SHA-512 hashes via Web Crypto API', category: 'Security & Crypto', categoryColor: 'text-green-500', icon: '##' },
  { path: '/tools/jwt', label: 'JWT Inspector', description: 'Decode JWT header, payload and check expiry (no verification)', category: 'Security & Crypto', categoryColor: 'text-green-500', icon: 'JWT' },
  // Generators
  { path: '/tools/uuid', label: 'UUID Generator', description: 'Generate up to 50 UUIDs using crypto.randomUUID()', category: 'Generators', categoryColor: 'text-yellow-500', icon: 'UUID' },
  { path: '/tools/fixture', label: 'Fixture Generator', description: 'Lorem ipsum text and mock user data JSON generator', category: 'Generators', categoryColor: 'text-yellow-500', icon: '🎲' },
  { path: '/tools/regex', label: 'Regex Tester', description: 'Live regex matching with match highlighting and flags g/i/m', category: 'Generators', categoryColor: 'text-yellow-500', icon: '.*' },
  { path: '/tools/cron', label: 'Cron Parser', description: 'Explain cron expressions and show next 5 run times', category: 'Generators', categoryColor: 'text-yellow-500', icon: '⏱' },
  // Date & Time
  { path: '/tools/epoch', label: 'Epoch Converter', description: 'Convert Unix timestamps to human dates and all formats', category: 'Date & Time', categoryColor: 'text-orange-500', icon: '⌚' },
  // Colors & Design
  { path: '/tools/color-converter', label: 'Color Converter', description: 'Convert HEX, RGB, HSL with contrast ratio checker', category: 'Colors & Design', categoryColor: 'text-pink-500', icon: '🎨' },
  { path: '/tools/color-picker', label: 'Color Picker', description: 'Visual color picker with palette builder', category: 'Colors & Design', categoryColor: 'text-pink-500', icon: '🖌' },
  // Media & Files
  { path: '/tools/image', label: 'Image Utility', description: 'Resize and convert images using the Canvas API', category: 'Media & Files', categoryColor: 'text-red-500', icon: '🖼' },
  { path: '/tools/screenshot-framer', label: 'Screenshot Framer', description: 'Wrap screenshots in a browser chrome frame', category: 'Media & Files', categoryColor: 'text-red-500', icon: '📸' },
  // Dev Utilities
  { path: '/tools/permissions', label: 'Permissions Calc', description: 'Unix chmod octal ↔ rwx permissions calculator', category: 'Dev Utilities', categoryColor: 'text-indigo-500', icon: 'rwx' },
  { path: '/tools/invoice', label: 'Invoice Generator', description: 'Create invoices with line items, totals and print preview', category: 'Dev Utilities', categoryColor: 'text-indigo-500', icon: '🧾' },
]

const categories = ['All', ...Array.from(new Set(allTools.map(t => t.category)))]

export default function Tools() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = allTools.filter(t => {
    const matchSearch = t.label.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase())
    const matchCategory = activeCategory === 'All' || t.category === activeCategory
    return matchSearch && matchCategory
  })

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>All Tools</h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>27 developer utilities, all client-side</p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search tools..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input-base pl-10 py-3 text-base"
        />
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{
              background: activeCategory === cat ? 'var(--accent)' : 'var(--bg-elevated)',
              color: activeCategory === cat ? 'white' : 'var(--text-secondary)',
              border: `1px solid ${activeCategory === cat ? 'var(--accent)' : 'var(--border)'}`,
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map(t => (
          <ToolCard key={t.path} {...t} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16" style={{ color: 'var(--text-muted)' }}>
          <p className="text-lg mb-2">No tools found</p>
          <p className="text-sm">Try a different search term</p>
        </div>
      )}
    </div>
  )
}
