interface Props {
  title: string
  description: string
  category: string
  categoryColor: string
  children: React.ReactNode
}

export default function ToolLayout({ title, description, category, categoryColor, children }: Props) {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${categoryColor}`}
            style={{ background: 'var(--bg-elevated)' }}
          >
            {category}
          </span>
        </div>
        <h1 className="tool-title">{title}</h1>
        <p className="tool-description">{description}</p>
      </div>
      <div>{children}</div>
    </div>
  )
}
