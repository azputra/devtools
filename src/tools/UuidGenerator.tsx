import { useState } from 'react'

export default function UuidGenerator() {
  const [count, setCount] = useState(10)
  const [uuids, setUuids] = useState<string[]>(() =>
    Array.from({ length: 10 }, () => crypto.randomUUID())
  )
  const [upper, setUpper] = useState(false)
  const [hyphens, setHyphens] = useState(true)
  const [copied, setCopied] = useState<number | 'all' | null>(null)

  const generate = () => {
    setUuids(Array.from({ length: count }, () => crypto.randomUUID()))
  }

  const format = (uuid: string) => {
    let s = uuid
    if (!hyphens) s = s.replace(/-/g, '')
    if (upper) s = s.toUpperCase()
    return s
  }

  const copy = (text: string, key: number | 'all') => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 1500)
  }

  const formatted = uuids.map(format)

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h1 className="tool-title">UUID Generator</h1>
        <p className="tool-description">Generate UUIDs (v4) using crypto.randomUUID()</p>
      </div>

      <div className="space-y-4">
        <div className="panel">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-400">Count:</label>
              <input
                type="number"
                min={1}
                max={50}
                value={count}
                onChange={e => setCount(Math.min(50, Math.max(1, Number(e.target.value))))}
                className="input-base w-20"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
              <input type="checkbox" checked={upper} onChange={e => setUpper(e.target.checked)} className="rounded border-gray-600 bg-gray-700 text-indigo-500 focus:ring-0" />
              Uppercase
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
              <input type="checkbox" checked={hyphens} onChange={e => setHyphens(e.target.checked)} className="rounded border-gray-600 bg-gray-700 text-indigo-500 focus:ring-0" />
              Hyphens
            </label>
            <button onClick={generate} className="btn-primary">Generate</button>
            <button onClick={() => copy(formatted.join('\n'), 'all')} className="btn-secondary flex items-center gap-1.5 ml-auto">
              {copied === 'all' ? (
                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
              Copy All
            </button>
          </div>
        </div>

        <div className="panel">
          <div className="space-y-1.5 max-h-[32rem] overflow-y-auto">
            {formatted.map((uuid, i) => (
              <div key={i} className="flex items-center gap-3 bg-gray-800 rounded-lg px-3 py-2 group">
                <span className="text-gray-600 text-xs w-6 text-right flex-shrink-0">{i + 1}</span>
                <span className="font-mono text-sm text-gray-200 flex-1 select-all">{uuid}</span>
                <button onClick={() => copy(uuid, i)} className="copy-btn opacity-0 group-hover:opacity-100 transition-opacity">
                  {copied === i ? (
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
      </div>
    </div>
  )
}
