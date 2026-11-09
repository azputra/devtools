import { useState, useEffect } from 'react'

function pad(n: number) { return String(n).padStart(2, '0') }

function formatDate(d: Date) {
  const formats: Record<string, string> = {
    'ISO 8601': d.toISOString(),
    'UTC': d.toUTCString(),
    'Local': d.toLocaleString(),
    'Date only': d.toLocaleDateString(),
    'Time only': d.toLocaleTimeString(),
    'RFC 2822': d.toString(),
    'YYYY-MM-DD HH:mm:ss': `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`,
    'Unix (ms)': String(d.getTime()),
  }
  return formats
}

export default function EpochConverter() {
  const [epoch, setEpoch] = useState(() => String(Math.floor(Date.now() / 1000)))
  const [humanInput, setHumanInput] = useState('')
  const [copied, setCopied] = useState('')

  useEffect(() => {
    const t = setInterval(() => {}, 1000)
    return () => clearInterval(t)
  }, [])

  const setNow = () => setEpoch(String(Math.floor(Date.now() / 1000)))

  const epochNum = Number(epoch)
  const isMs = epochNum > 1e12
  const date = !isNaN(epochNum) && epoch !== ''
    ? new Date(isMs ? epochNum : epochNum * 1000)
    : null

  const formats = date && !isNaN(date.getTime()) ? formatDate(date) : null

  const humanToEpoch = () => {
    if (!humanInput) return
    const d = new Date(humanInput)
    if (!isNaN(d.getTime())) setEpoch(String(Math.floor(d.getTime() / 1000)))
  }

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(''), 1500)
  }

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h1 className="tool-title">Epoch Converter</h1>
        <p className="tool-description">Convert Unix timestamps to human-readable dates and all formats</p>
      </div>

      <div className="space-y-4">
        {/* Epoch input */}
        <div className="panel">
          <div className="panel-label">Unix Timestamp</div>
          <div className="flex gap-2">
            <input
              className="input-base flex-1"
              value={epoch}
              onChange={e => setEpoch(e.target.value)}
              placeholder="e.g. 1700000000"
            />
            <button onClick={setNow} className="btn-secondary whitespace-nowrap">Now</button>
          </div>
          {date && (
            <p className="mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
              Detected as: <span style={{ color: 'var(--accent)' }}>{isMs ? 'milliseconds' : 'seconds'}</span>
            </p>
          )}
        </div>

        {/* Human input */}
        <div className="panel">
          <div className="panel-label">Human Date → Epoch</div>
          <div className="flex gap-2">
            <input
              className="input-base flex-1"
              value={humanInput}
              onChange={e => setHumanInput(e.target.value)}
              placeholder="e.g. 2024-01-15 10:30:00 or any parseable date"
            />
            <button onClick={humanToEpoch} className="btn-primary">Convert</button>
          </div>
        </div>

        {/* Formats */}
        {formats ? (
          <div className="panel">
            <div className="panel-label">All Formats</div>
            <div className="space-y-2">
              {Object.entries(formats).map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-3 rounded-lg px-3 py-2" style={{ background: 'var(--bg-elevated)' }}>
                  <span className="text-xs w-32 flex-shrink-0" style={{ color: 'var(--text-muted)' }}>{label}</span>
                  <span className="font-mono text-xs text-gray-200 flex-1 truncate">{value}</span>
                  <button onClick={() => copy(value, label)} className="copy-btn flex-shrink-0">
                    {copied === label ? (
                      <svg className="w-3.5 h-3.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : epoch !== '' && (
          <div className="panel">
            <p className="text-red-400 text-sm">Invalid timestamp</p>
          </div>
        )}
      </div>
    </div>
  )
}
