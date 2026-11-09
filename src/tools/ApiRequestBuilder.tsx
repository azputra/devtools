import { useState } from 'react'

interface Header { key: string; value: string; enabled: boolean }

function parseCurl(curl: string): { method: string; url: string; headers: Header[]; body: string } {
  const method = /-X\s+(\w+)/.exec(curl)?.[1] || 'GET'
  const url = /curl\s+['"]?([^'" ]+)['"]?/.exec(curl)?.[1] || ''
  const headers: Header[] = []
  const headerRe = /-H\s+['"]([^'"]+)['"]/g
  let m: RegExpExecArray | null
  while ((m = headerRe.exec(curl)) !== null) {
    const colon = m[1].indexOf(':')
    if (colon !== -1) {
      headers.push({ key: m[1].slice(0, colon).trim(), value: m[1].slice(colon + 1).trim(), enabled: true })
    }
  }
  const body = /(?:-d|--data)\s+['"]([^'"]+)['"]/.exec(curl)?.[1] || ''
  return { method, url, headers, body }
}

export default function ApiRequestBuilder() {
  const [method, setMethod] = useState('GET')
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/posts/1')
  const [headers, setHeaders] = useState<Header[]>([
    { key: 'Content-Type', value: 'application/json', enabled: true },
  ])
  const [body, setBody] = useState('')
  const [curl, setCurl] = useState('')
  const [response, setResponse] = useState<{ status: number; statusText: string; headers: Record<string, string>; body: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'body' | 'headers' | 'curl'>('headers')

  const addHeader = () => setHeaders(h => [...h, { key: '', value: '', enabled: true }])
  const removeHeader = (i: number) => setHeaders(h => h.filter((_, idx) => idx !== i))
  const updateHeader = (i: number, field: keyof Header, val: string | boolean) =>
    setHeaders(h => h.map((item, idx) => idx === i ? { ...item, [field]: val } : item))

  const importCurl = () => {
    const parsed = parseCurl(curl)
    setMethod(parsed.method)
    setUrl(parsed.url)
    setHeaders(parsed.headers.length > 0 ? parsed.headers : headers)
    setBody(parsed.body)
    setCurl('')
  }

  const send = async () => {
    setLoading(true)
    setError(null)
    setResponse(null)
    try {
      const reqHeaders: Record<string, string> = {}
      headers.filter(h => h.enabled && h.key).forEach(h => { reqHeaders[h.key] = h.value })
      const opts: RequestInit = { method, headers: reqHeaders }
      if (body && !['GET', 'HEAD'].includes(method)) opts.body = body
      const res = await fetch(url, opts)
      const resBody = await res.text()
      const resHeaders: Record<string, string> = {}
      res.headers.forEach((v, k) => { resHeaders[k] = v })
      setResponse({ status: res.status, statusText: res.statusText, headers: resHeaders, body: resBody })
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const exportCurl = () => {
    const parts = [`curl -X ${method}`]
    headers.filter(h => h.enabled && h.key).forEach(h => parts.push(`  -H '${h.key}: ${h.value}'`))
    if (body) parts.push(`  -d '${body}'`)
    parts.push(`  '${url}'`)
    navigator.clipboard.writeText(parts.join(' \\\n'))
  }

  const prettyBody = () => {
    if (!response) return ''
    try { return JSON.stringify(JSON.parse(response.body), null, 2) } catch { return response.body }
  }

  const statusColor = response
    ? response.status < 300 ? 'text-green-400' : response.status < 400 ? 'text-yellow-400' : 'text-red-400'
    : ''

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h1 className="tool-title">API Request Builder</h1>
        <p className="tool-description">Build and send HTTP requests from the browser, import cURL</p>
      </div>

      <div className="space-y-4">
        {/* URL bar */}
        <div className="panel">
          <div className="flex gap-2">
            <select
              value={method}
              onChange={e => setMethod(e.target.value)}
              className="select-inline rounded-lg px-3 py-2 text-sm font-medium"
              style={{ color: { GET: '#6ee7b7', POST: '#93c5fd', PUT: '#fcd34d', DELETE: '#fca5a5', PATCH: '#c4b5fd' }[method] || '#e5e7eb' }}
            >
              {['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'].map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <input
              className="input-base flex-1"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://api.example.com/endpoint"
              onKeyDown={e => e.key === 'Enter' && send()}
            />
            <button onClick={send} disabled={loading} className="btn-primary whitespace-nowrap">
              {loading ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="panel">
          <div className="flex gap-1 mb-4 -mx-4 px-4" style={{ borderBottom: '1px solid var(--border)' }}>
            {(['headers', 'body', 'curl'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px"
                style={{
                  color: activeTab === tab ? 'var(--accent)' : 'var(--text-muted)',
                  borderBottomColor: activeTab === tab ? 'var(--accent)' : 'transparent',
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
            <div className="flex-1" />
            <button onClick={exportCurl} className="btn-ghost text-xs mb-2">Copy as cURL</button>
          </div>

          {activeTab === 'headers' && (
            <div className="space-y-2">
              {headers.map((h, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input type="checkbox" checked={h.enabled} onChange={e => updateHeader(i, 'enabled', e.target.checked)} className="w-4 h-4 rounded" />
                  <input className="input-base flex-1 text-xs font-mono" value={h.key} onChange={e => updateHeader(i, 'key', e.target.value)} placeholder="Header-Name" />
                  <input className="input-base flex-1 text-xs font-mono" value={h.value} onChange={e => updateHeader(i, 'value', e.target.value)} placeholder="value" />
                  <button onClick={() => removeHeader(i)} className="copy-btn text-red-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              ))}
              <button onClick={addHeader} className="btn-ghost text-xs flex items-center gap-1 mt-2">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                Add Header
              </button>
            </div>
          )}

          {activeTab === 'body' && (
            <textarea
              className="textarea-base h-40"
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder='{"key": "value"}'
              spellCheck={false}
            />
          )}

          {activeTab === 'curl' && (
            <div>
              <textarea
                className="textarea-base h-28"
                value={curl}
                onChange={e => setCurl(e.target.value)}
                placeholder={'curl -X POST https://api.example.com -H \'Content-Type: application/json\' -d \'{"key":"value"}\''}
                spellCheck={false}
              />
              <button onClick={importCurl} className="btn-secondary mt-2 text-xs">Import cURL</button>
            </div>
          )}
        </div>

        {/* Response */}
        {(response || error) && (
          <div className="panel">
            {error ? (
              <p className="text-red-400 text-sm">{error}</p>
            ) : response && (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <span className={`text-lg font-bold ${statusColor}`}>{response.status}</span>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{response.statusText}</span>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="panel-label">Response Headers</div>
                    <div className="space-y-1">
                      {Object.entries(response.headers).map(([k, v]) => (
                        <div key={k} className="flex gap-3 text-xs font-mono">
                          <span className="w-40 flex-shrink-0 truncate" style={{ color: 'var(--accent)' }}>{k}</span>
                          <span style={{ color: 'var(--text-secondary)' }}>{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="panel-label">Response Body</div>
                    <pre className="output-area max-h-64 overflow-auto">{prettyBody()}</pre>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
