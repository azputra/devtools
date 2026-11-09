import { Link } from 'react-router-dom'

// Map category to accent bar color
const accentBarColors: Record<string, string> = {
  'Text & Encoding': '#8b5cf6',
  'Data & Formats': '#3b82f6',
  'Network & Web': '#06b6d4',
  'Security & Crypto': '#22c55e',
  'Generators': '#eab308',
  'Date & Time': '#f97316',
  'Colors & Design': '#ec4899',
  'Media & Files': '#ef4444',
  'Dev Utilities': '#6366f1',
  // Home page short names
  'Data': '#3b82f6',
  'Security': '#22c55e',
  'Colors': '#ec4899',
}

interface ToolCardProps {
  path: string
  label: string
  description: string
  category: string
  categoryColor: string
  icon: string
}

export default function ToolCard({ path, label, description, category, categoryColor, icon }: ToolCardProps) {
  const barColor = accentBarColors[category] || 'var(--accent)'

  return (
    <Link
      to={path}
      className={`group block rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${categoryColor}`}
      style={{
        border: '1px solid var(--border)',
        background: 'var(--bg-surface)',
        textDecoration: 'none',
      }}
    >
      {/* Colored top bar */}
      <div className="h-1 w-full" style={{ background: barColor }} />
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <span className="text-2xl leading-none">{icon}</span>
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${categoryColor}`}
            style={{ background: 'var(--bg-elevated)' }}
          >
            {category}
          </span>
        </div>
        <h3
          className="font-semibold mb-1 group-hover:transition-colors text-sm"
          style={{ color: 'var(--text-primary)' }}
        >
          {label}
        </h3>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{description}</p>
      </div>
    </Link>
  )
}
