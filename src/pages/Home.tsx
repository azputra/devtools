import { Link } from 'react-router-dom'
import ToolCard from '../components/ToolCard'

const featured = [
  { path: '/tools/json-formatter', label: 'JSON Formatter', description: 'Prettify, minify and validate JSON with syntax highlighting', category: 'Data', categoryColor: 'text-blue-400', icon: '{}' },
  { path: '/tools/regex', label: 'Regex Tester', description: 'Live regex matching with match highlighting and flags', category: 'Generators', categoryColor: 'text-yellow-400', icon: '.*' },
  { path: '/tools/jwt', label: 'JWT Inspector', description: 'Decode JWT header, payload and check expiry instantly', category: 'Security', categoryColor: 'text-green-400', icon: '🔑' },
  { path: '/tools/uuid', label: 'UUID Generator', description: 'Generate up to 50 UUIDs at once', category: 'Generators', categoryColor: 'text-yellow-400', icon: '#' },
  { path: '/tools/hash', label: 'Hash Generator', description: 'SHA-1, SHA-256, SHA-512 via Web Crypto API', category: 'Security', categoryColor: 'text-green-400', icon: '##' },
  { path: '/tools/color-converter', label: 'Color Converter', description: 'Convert HEX, RGB, HSL + contrast ratio checker', category: 'Colors', categoryColor: 'text-pink-400', icon: '🎨' },
]

const stats = [
  { label: 'Total Tools', value: '27' },
  { label: 'Categories', value: '9' },
  { label: 'No Backend', value: '100%' },
  { label: 'Open Source', value: '✓' },
]

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero */}
      <div className="text-center py-12 mb-10">
        <div className="inline-flex items-center gap-2 bg-indigo-600/10 border border-indigo-500/20 rounded-full px-4 py-1.5 text-xs text-indigo-400 font-medium mb-6">
          <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
          27 tools · all client-side
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
          Developer<span className="text-indigo-400">Tools</span>
        </h1>
        <p className="text-lg text-gray-400 max-w-xl mx-auto leading-relaxed">
          Every tool a developer needs, in one place. No sign-up, no tracking, no server round-trips.
        </p>
        <div className="flex items-center justify-center gap-3 mt-6">
          <Link to="/tools" className="btn-primary px-6 py-2.5">Browse all tools</Link>
          <Link to="/tools/json-formatter" className="btn-secondary px-6 py-2.5">Try JSON Formatter</Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        {stats.map(s => (
          <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-indigo-400 mb-1">{s.value}</div>
            <div className="text-xs text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Featured */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Featured Tools</h2>
          <Link to="/tools" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">View all →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {featured.map(t => (
            <ToolCard key={t.path} {...t} />
          ))}
        </div>
      </div>
    </div>
  )
}
