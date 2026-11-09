import { Link } from 'react-router-dom'
import { toolIcons, categoryColors } from '../lib/toolIcons'

interface ToolCardProps {
  path: string
  label: string
  description: string
  category: string
  categoryColor?: string
  icon?: string
}

export default function ToolCard({ path, label, description, category }: ToolCardProps) {
  const icon = toolIcons[path]
  const cat = categoryColors[category] ?? { text: 'var(--accent)', bg: 'var(--accent-muted)', dot: 'var(--accent)' }

  return (
    <Link
      to={path}
      style={{ textDecoration: 'none', display: 'block', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', transition: 'border-color 0.15s, box-shadow 0.15s, transform 0.15s' }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = cat.dot
        el.style.boxShadow = `0 4px 20px rgba(0,0,0,0.12)`
        el.style.transform = 'translateY(-1px)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = 'var(--border)'
        el.style.boxShadow = 'none'
        el.style.transform = 'none'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '10px' }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: cat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: cat.text }}>
          {icon ?? <span style={{ fontSize: 14, fontWeight: 600, color: cat.text }}>{label[0]}</span>}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: cat.dot, flexShrink: 0 }} />
            <span style={{ fontSize: 11, color: cat.text, fontWeight: 500 }}>{category}</span>
          </div>
        </div>
      </div>
      <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>{description}</p>
    </Link>
  )
}
