import { Link } from 'react-router-dom'

interface ToolCardProps {
  path: string
  label: string
  description: string
  category: string
  categoryColor: string
  icon: string
}

export default function ToolCard({ path, label, description, category, categoryColor, icon }: ToolCardProps) {
  return (
    <Link
      to={path}
      className="group block bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-gray-700 rounded-xl p-4 transition-all duration-150"
    >
      <div className="flex items-start gap-3">
        <div className={`text-2xl flex-shrink-0 ${categoryColor}`}>{icon}</div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors truncate">{label}</h3>
          </div>
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{description}</p>
          <span className={`inline-block mt-2 text-xs font-medium ${categoryColor} opacity-70`}>{category}</span>
        </div>
      </div>
    </Link>
  )
}
