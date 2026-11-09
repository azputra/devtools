import { useState, useMemo } from 'react'

function b64Decode(s: string): string {
  try {
    const std = s.replace(/-/g, '+').replace(/_/g, '/')
    const padded = std.padEnd(std.length + (4 - std.length % 4) % 4, '=')
    return decodeURIComponent(escape(atob(padded)))
  } catch {
    return ''
  }
}

function syntaxHighlight(json: string): string {
  return json
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
      let cls = 'token-number'
      if (/^"/.test(match)) cls = /:$/.test(match) ? 'token-key' : 'token-string'
      else if (/true|false/.test(match)) cls = 'token-bool'
      else if (/null/.test(match)) cls = 'token-null'
      return `<span class="${cls}">${match}</span>`
    })
}

const SAMPLE_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTl9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

export default function JwtInspector() {
  const [input, setInput] = useState(SAMPLE_JWT)

  const result = useMemo(() => {
    const parts = input.trim().split('.')
    if (parts.length !== 3) return null
    try {
      const header = JSON.parse(b64Decode(parts[0]))
      const payload = JSON.parse(b64Decode(parts[1]))
      const now = Math.floor(Date.now() / 1000)
      const exp = typeof payload.exp === 'number' ? payload.exp : null
      const iat = typeof payload.iat === 'number' ? payload.iat : null
      const expired = exp !== null && exp < now
      const expiresIn = exp !== null ? exp - now : null
      return { header, payload, signature: parts[2], exp, iat, expired, expiresIn }
    } catch {
      return null
    }
  }, [input])

  const formatExpiry = (secs: number) => {
    const abs = Math.abs(secs)
    if (abs < 60) return `${abs}s`
    if (abs < 3600) return `${Math.floor(abs / 60)}m ${abs % 60}s`
    if (abs < 86400) return `${Math.floor(abs / 3600)}h ${Math.floor((abs % 3600) / 60)}m`
    return `${Math.floor(abs / 86400)}d`
  }

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h1 className="tool-title">JWT Inspector</h1>
        <p className="tool-description">Decode JWT header and payload, check expiry (no signature verification)</p>
      </div>

      <div className="space-y-4">
        <div className="panel">
          <div className="panel-label">JWT Token</div>
          <textarea
            className="textarea-base h-28 text-xs"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Paste JWT token here..."
            spellCheck={false}
          />
        </div>

        {input.trim() && !result && (
          <div className="panel">
            <p className="text-red-400 text-sm">Invalid JWT format — expected 3 base64url-encoded parts separated by dots</p>
          </div>
        )}

        {result && (
          <>
            {/* Expiry status */}
            {result.exp !== null && (
              <div className={`panel ${result.expired ? 'border-red-500/30 bg-red-500/5' : 'border-green-500/30 bg-green-500/5'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${result.expired ? 'bg-red-500' : 'bg-green-500'}`} />
                  <div>
                    <span className={`text-sm font-medium ${result.expired ? 'text-red-400' : 'text-green-400'}`}>
                      {result.expired ? 'Token Expired' : 'Token Valid'}
                    </span>
                    {result.expiresIn !== null && (
                      <span className="text-xs ml-2" style={{ color: 'var(--text-muted)' }}>
                        {result.expired
                          ? `Expired ${formatExpiry(result.expiresIn)} ago`
                          : `Expires in ${formatExpiry(result.expiresIn)}`}
                      </span>
                    )}
                  </div>
                  <div className="ml-auto text-xs" style={{ color: 'var(--text-muted)' }}>
                    {result.exp && new Date(result.exp * 1000).toLocaleString()}
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Header */}
              <div className="panel">
                <div className="panel-label text-blue-400">Header</div>
                <div
                  className="output-area overflow-auto max-h-48 whitespace-pre leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: syntaxHighlight(JSON.stringify(result.header, null, 2)) }}
                />
              </div>

              {/* Payload */}
              <div className="panel">
                <div className="panel-label text-green-400">Payload</div>
                <div
                  className="output-area overflow-auto max-h-48 whitespace-pre leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: syntaxHighlight(JSON.stringify(result.payload, null, 2)) }}
                />
              </div>
            </div>

            {/* Signature */}
            <div className="panel">
              <div className="panel-label text-red-400">Signature (not verified)</div>
              <div className="output-area font-mono text-xs text-red-300 break-all">{result.signature}</div>
            </div>

            {/* Claims summary */}
            {(result.iat || result.exp || result.payload.sub || result.payload.iss) && (
              <div className="panel">
                <div className="panel-label">Standard Claims</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: 'Subject (sub)', value: result.payload.sub },
                    { label: 'Issuer (iss)', value: result.payload.iss },
                    { label: 'Issued At', value: result.iat ? new Date(result.iat * 1000).toLocaleString() : null },
                    { label: 'Expires', value: result.exp ? new Date(result.exp * 1000).toLocaleString() : null },
                  ].filter(c => c.value).map(c => (
                    <div key={c.label} className="rounded-lg p-3" style={{ background: 'var(--bg-elevated)' }}>
                      <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{c.label}</div>
                      <div className="text-xs font-mono break-all" style={{ color: 'var(--text-primary)' }}>{String(c.value)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
