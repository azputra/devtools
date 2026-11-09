import { useState, useMemo } from 'react'

interface Header { name: string; value: string; line: number }

const CORS_HEADERS = new Set(['access-control-allow-origin', 'access-control-allow-methods', 'access-control-allow-headers', 'access-control-allow-credentials', 'access-control-expose-headers', 'access-control-max-age'])
const CACHE_HEADERS = new Set(['cache-control', 'expires', 'etag', 'last-modified', 'pragma', 'vary'])
const SECURITY_HEADERS = new Set(['strict-transport-security', 'x-frame-options', 'x-content-type-options', 'content-security-policy', 'x-xss-protection', 'referrer-policy', 'permissions-policy'])

function parseHeaders(raw: string): Header[] {
  return raw.trim().split('\n').map((line, i) => {
    const colon = line.indexOf(':')
    if (colon === -1) return null
    return { name: line.slice(0, colon).trim(), value: line.slice(colon + 1).trim(), line: i + 1 }
  }).filter(Boolean) as Header[]
}

const SAMPLE = `HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 1234
Cache-Control: max-age=3600, public
ETag: "abc123def456"
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=31536000; includeSubDomains
Server: nginx/1.21.0
Date: Mon, 01 Jan 2024 00:00:00 GMT`

export default function HttpHeaderInspector() {
  const [input, setInput] = useState(SAMPLE)

  const { headers, duplicates, cors, security } = useMemo(() => {
    const headers = parseHeaders(input)
    const counts: Record<string, number> = {}
    headers.forEach(h => { const k = h.name.toLowerCase(); counts[k] = (counts[k] || 0) + 1 })
    const duplicates = Object.entries(counts).filter(([, v]) => v > 1).map(([k]) => k)
    const cors = headers.filter(h => CORS_HEADERS.has(h.name.toLowerCase()))
    const security = headers.filter(h => SECURITY_HEADERS.has(h.name.toLowerCase()))
    return { headers, duplicates, cors, security }
  }, [input])

  const missingSecurity = [...SECURITY_HEADERS].filter(h =>
    !headers.some(hdr => hdr.name.toLowerCase() === h)
  )

  const getBadge = (name: string) => {
    const lc = name.toLowerCase()
    if (CORS_HEADERS.has(lc)) return { label: 'CORS', color: 'bg-blue-500/20 text-blue-400' }
    if (CACHE_HEADERS.has(lc)) return { label: 'Cache', color: 'bg-orange-500/20 text-orange-400' }
    if (SECURITY_HEADERS.has(lc)) return { label: 'Security', color: 'bg-green-500/20 text-green-400' }
    return null
  }

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h1 className="tool-title">HTTP Header Inspector</h1>
        <p className="tool-description">Paste HTTP headers to inspect CORS, cache, security and duplicates</p>
      </div>

      <div className="space-y-4">
        <div className="panel">
          <div className="panel-label">Raw Headers</div>
          <textarea
            className="textarea-base h-40"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Paste HTTP response headers here..."
            spellCheck={false}
          />
        </div>

        {/* Summary badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Total Headers', value: headers.length, color: '' },
            { label: 'Duplicates', value: duplicates.length, color: duplicates.length > 0 ? 'text-red-400' : 'text-green-400' },
            { label: 'CORS Headers', value: cors.length, color: 'text-blue-400' },
            { label: 'Security Headers', value: security.length, color: 'text-green-400' },
          ].map(s => (
            <div key={s.label} className="panel text-center">
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Duplicates warning */}
        {duplicates.length > 0 && (
          <div className="panel border-red-500/30 bg-red-500/5">
            <div className="text-sm text-red-400 font-medium mb-2">Duplicate Headers Detected</div>
            <div className="flex flex-wrap gap-2">
              {duplicates.map(d => (
                <span key={d} className="bg-red-500/20 text-red-300 text-xs px-2 py-1 rounded font-mono">{d}</span>
              ))}
            </div>
          </div>
        )}

        {/* Missing security */}
        {missingSecurity.length > 0 && (
          <div className="panel border-yellow-500/30 bg-yellow-500/5">
            <div className="text-sm text-yellow-400 font-medium mb-2">Missing Security Headers</div>
            <div className="flex flex-wrap gap-2">
              {missingSecurity.map(h => (
                <span key={h} className="bg-yellow-500/10 text-yellow-300 text-xs px-2 py-1 rounded font-mono">{h}</span>
              ))}
            </div>
          </div>
        )}

        {/* Header list */}
        {headers.length > 0 && (
          <div className="panel">
            <div className="panel-label">Parsed Headers</div>
            <div className="space-y-1.5">
              {headers.map((h, i) => {
                const badge = getBadge(h.name)
                const isDup = duplicates.includes(h.name.toLowerCase())
                return (
                  <div key={i} className="flex items-start gap-3 rounded-lg px-3 py-2" style={{
                    background: 'var(--bg-elevated)',
                    border: isDup ? '1px solid rgba(239,68,68,0.3)' : '1px solid transparent',
                  }}>
                    <span className="font-mono text-xs flex-shrink-0 w-56 truncate" style={{ color: 'var(--accent)' }}>{h.name}</span>
                    <span className="font-mono text-xs flex-1 break-all" style={{ color: 'var(--text-secondary)' }}>{h.value}</span>
                    {badge && (
                      <span className={`text-xs px-1.5 py-0.5 rounded flex-shrink-0 ${badge.color}`}>{badge.label}</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
