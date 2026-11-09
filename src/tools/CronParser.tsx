import { useState, useMemo } from 'react'

function parseField(field: string, min: number, max: number): number[] | null {
  const result = new Set<number>()
  for (const part of field.split(',')) {
    if (part === '*') {
      for (let i = min; i <= max; i++) result.add(i)
    } else if (part.includes('/')) {
      const [range, step] = part.split('/')
      const stepNum = parseInt(step)
      if (isNaN(stepNum) || stepNum <= 0) return null
      const [start, end] = range === '*' ? [min, max] : range.split('-').map(Number)
      for (let i = start; i <= (end || max); i += stepNum) result.add(i)
    } else if (part.includes('-')) {
      const [start, end] = part.split('-').map(Number)
      if (isNaN(start) || isNaN(end)) return null
      for (let i = start; i <= end; i++) result.add(i)
    } else {
      const n = parseInt(part)
      if (isNaN(n)) return null
      result.add(n)
    }
  }
  return [...result].filter(n => n >= min && n <= max).sort((a, b) => a - b)
}

function parseCron(expr: string): { minutes: number[], hours: number[], days: number[], months: number[], weekdays: number[], error: string | null } {
  const parts = expr.trim().split(/\s+/)
  if (parts.length !== 5) return { minutes: [], hours: [], days: [], months: [], weekdays: [], error: 'Cron must have exactly 5 fields' }
  const [minuteField, hourField, dayField, monthField, weekdayField] = parts
  const minutes = parseField(minuteField, 0, 59)
  const hours = parseField(hourField, 0, 23)
  const days = parseField(dayField, 1, 31)
  const months = parseField(monthField, 1, 12)
  const weekdays = parseField(weekdayField, 0, 6)
  if (!minutes || !hours || !days || !months || !weekdays)
    return { minutes: [], hours: [], days: [], months: [], weekdays: [], error: 'Invalid field value' }
  return { minutes, hours, days, months, weekdays, error: null }
}

function getNextRuns(expr: string, count: number): Date[] {
  const { minutes, hours, days, months, weekdays, error } = parseCron(expr)
  if (error) return []
  const runs: Date[] = []
  const d = new Date()
  d.setSeconds(0, 0)
  d.setMinutes(d.getMinutes() + 1)
  let iterations = 0
  while (runs.length < count && iterations++ < 100000) {
    const monthMatch = months.includes(d.getMonth() + 1)
    const dayMatch = days.includes(d.getDate())
    const weekdayMatch = weekdays.includes(d.getDay())
    const hourMatch = hours.includes(d.getHours())
    const minuteMatch = minutes.includes(d.getMinutes())
    if (monthMatch && (dayMatch || weekdayMatch) && hourMatch && minuteMatch) {
      runs.push(new Date(d))
    }
    d.setMinutes(d.getMinutes() + 1)
  }
  return runs
}

function explainCron(expr: string): string {
  const { minutes, hours, days, months, weekdays, error } = parseCron(expr)
  if (error) return error
  const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const parts = expr.split(/\s+/)

  const fmtMin = parts[0] === '*' ? 'every minute' : `at minute ${minutes.join(', ')}`
  const fmtHour = parts[1] === '*' ? 'every hour' : `hour ${hours.join(', ')}`
  const fmtDay = parts[2] === '*' ? 'every day' : `day ${days.join(', ')}`
  const fmtMonth = parts[3] === '*' ? 'every month' : `in ${months.map(m => monthNames[m]).join(', ')}`
  const fmtWeekday = parts[4] === '*' ? '' : ` on ${weekdays.map(w => dayNames[w]).join(', ')}`

  return `Runs ${fmtMin} of ${fmtHour}, ${fmtDay} of ${fmtMonth}${fmtWeekday}`
}

const PRESETS = [
  { label: 'Every minute', expr: '* * * * *' },
  { label: 'Every hour', expr: '0 * * * *' },
  { label: 'Daily at midnight', expr: '0 0 * * *' },
  { label: 'Weekly on Sunday', expr: '0 0 * * 0' },
  { label: 'Monthly on 1st', expr: '0 0 1 * *' },
  { label: 'Weekdays at 9am', expr: '0 9 * * 1-5' },
  { label: 'Every 15 min', expr: '*/15 * * * *' },
  { label: 'Every 6 hours', expr: '0 */6 * * *' },
]

export default function CronParser() {
  const [expr, setExpr] = useState('*/15 * * * *')

  const explanation = useMemo(() => explainCron(expr), [expr])
  const nextRuns = useMemo(() => getNextRuns(expr, 5), [expr])
  const { error } = useMemo(() => parseCron(expr), [expr])

  const fields = expr.trim().split(/\s+/)

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h1 className="tool-title">Cron Parser</h1>
        <p className="tool-description">Explain cron expressions and show next 5 run times</p>
      </div>

      <div className="space-y-4">
        <div className="panel">
          <div className="panel-label">Cron Expression</div>
          <input
            className="input-base font-mono text-lg"
            value={expr}
            onChange={e => setExpr(e.target.value)}
            placeholder="* * * * *"
            spellCheck={false}
          />
          {/* Field labels */}
          <div className="mt-2 grid grid-cols-5 gap-1 text-xs text-center">
            {['Minute\n(0-59)', 'Hour\n(0-23)', 'Day\n(1-31)', 'Month\n(1-12)', 'Weekday\n(0-6)'].map((l, i) => (
              <div key={i} className="rounded px-1 py-1" style={{
                background: 'var(--bg-elevated)',
                border: `1px solid ${fields[i] && fields[i] !== '*' ? 'var(--accent)' : 'transparent'}`,
                color: fields[i] && fields[i] !== '*' ? 'var(--accent)' : 'var(--text-secondary)',
              }}>
                <div className="font-mono">{fields[i] || '*'}</div>
                <div className="whitespace-pre text-xs leading-tight mt-0.5" style={{ color: 'var(--text-muted)' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Presets */}
        <div className="panel">
          <div className="panel-label">Presets</div>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map(p => (
              <button
                key={p.expr}
                onClick={() => setExpr(p.expr)}
                className="btn-ghost text-xs font-mono"
                style={{ border: '1px solid var(--border)' }}
              >
                {p.label} <span className="ml-1" style={{ color: 'var(--text-muted)' }}>{p.expr}</span>
              </button>
            ))}
          </div>
        </div>

        {error ? (
          <div className="panel">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        ) : (
          <>
            {/* Explanation */}
            <div className="panel">
              <div className="panel-label">Human-readable</div>
              <p className="text-indigo-300 text-sm font-medium">{explanation}</p>
            </div>

            {/* Next runs */}
            <div className="panel">
              <div className="panel-label">Next 5 Run Times</div>
              <div className="space-y-2">
                {nextRuns.map((date, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-lg px-3 py-2" style={{ background: 'var(--bg-elevated)' }}>
                    <span className="text-xs w-4" style={{ color: 'var(--accent)' }}>{i + 1}</span>
                    <span className="font-mono text-sm" style={{ color: 'var(--text-primary)' }}>{date.toLocaleString()}</span>
                    <span className="text-xs ml-auto" style={{ color: 'var(--text-muted)' }}>
                      {Math.round((date.getTime() - Date.now()) / 60000)} min from now
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
