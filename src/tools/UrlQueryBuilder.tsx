import { useState, useMemo } from 'react'

interface Param { key: string; value: string; enabled: boolean }

function parseUrl(raw: string): { protocol: string; host: string; path: string; params: Param[]; hash: string } {
  try {
    const u = new URL(raw)
    const params: Param[] = []
    u.searchParams.forEach((v, k) => params.push({ key: k, value: v, enabled: true }))
    return { protocol: u.protocol.replace(':', ''), host: u.host, path: u.pathname, params, hash: u.hash.replace('#', '') }
  } catch {
    return { protocol: 'https', host: '', path: '/', params: [], hash: '' }
  }
}

export default function UrlQueryBuilder() {
  const [protocol, setProtocol] = useState('https')
  const [host, setHost] = useState('api.example.com')
  const [path, setPath] = useState('/v1/users')
  const [hash, setHash] = useState('')
  const [params, setParams] = useState<Param[]>([
    { key: 'page', value: '1', enabled: true },
    { key: 'limit', value: '20', enabled: true },
    { key: 'sort', value: 'created_at', enabled: false },
  ])
  const [rawInput, setRawInput] = useState('')
  const [copied, setCopied] = useState(false)

  const builtUrl = useMemo(() => {
    const sp = new URLSearchParams()
    params.filter(p => p.enabled && p.key).forEach(p => sp.append(p.key, p.value))
    const qs = sp.toString()
    return `${protocol}://${host}${path}${qs ? '?' + qs : ''}${hash ? '#' + hash : ''}`
  }, [protocol, host, path, params, hash])

  const parseRaw = () => {
    const parsed = parseUrl(rawInput)
    setProtocol(parsed.protocol)
    setHost(parsed.host)
    setPath(parsed.path)
    setParams(parsed.params)
    setHash(parsed.hash)
    setRawInput('')
  }

  const addParam = () => setParams(p => [...p, { key: '', value: '', enabled: true }])
  const removeParam = (i: number) => setParams(p => p.filter((_, idx) => idx !== i))
  const updateParam = (i: number, field: keyof Param, val: string | boolean) =>
    setParams(p => p.map((item, idx) => idx === i ? { ...item, [field]: val } : item))

  const copy = () => {
    navigator.clipboard.writeText(builtUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h1 className="tool-title">URL Query Builder</h1>
        <p className="tool-description">Parse and build URLs, edit query parameters visually</p>
      </div>

      <div className="space-y-4">
        {/* Parse raw */}
        <div className="panel">
          <div className="panel-label">Parse URL</div>
          <div className="flex gap-2">
            <input
              className="input-base flex-1"
              value={rawInput}
              onChange={e => setRawInput(e.target.value)}
              placeholder="Paste a URL to parse..."
              onKeyDown={e => e.key === 'Enter' && parseRaw()}
            />
            <button onClick={parseRaw} className="btn-primary">Parse</button>
          </div>
        </div>

        {/* URL parts */}
        <div className="panel">
          <div className="panel-label">URL Parts</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Protocol</label>
              <select
                value={protocol}
                onChange={e => setProtocol(e.target.value)}
                className="input-base"
              >
                <option>https</option>
                <option>http</option>
                <option>ws</option>
                <option>wss</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="text-xs text-gray-500 mb-1 block">Host</label>
              <input className="input-base" value={host} onChange={e => setHost(e.target.value)} placeholder="example.com" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Hash</label>
              <input className="input-base" value={hash} onChange={e => setHash(e.target.value)} placeholder="section" />
            </div>
            <div className="col-span-4">
              <label className="text-xs text-gray-500 mb-1 block">Path</label>
              <input className="input-base" value={path} onChange={e => setPath(e.target.value)} placeholder="/api/v1/resource" />
            </div>
          </div>
        </div>

        {/* Params */}
        <div className="panel">
          <div className="flex items-center justify-between mb-3">
            <div className="panel-label">Query Parameters</div>
            <button onClick={addParam} className="btn-ghost text-xs flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add
            </button>
          </div>
          <div className="space-y-2">
            {params.map((p, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={p.enabled}
                  onChange={e => updateParam(i, 'enabled', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-indigo-500 focus:ring-0"
                />
                <input
                  className="input-base flex-1 font-mono text-xs"
                  value={p.key}
                  onChange={e => updateParam(i, 'key', e.target.value)}
                  placeholder="key"
                />
                <span className="text-gray-600">=</span>
                <input
                  className="input-base flex-1 font-mono text-xs"
                  value={p.value}
                  onChange={e => updateParam(i, 'value', e.target.value)}
                  placeholder="value"
                />
                <button onClick={() => removeParam(i)} className="copy-btn text-red-500 hover:text-red-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Result */}
        <div className="panel">
          <div className="flex items-center justify-between mb-2">
            <div className="panel-label">Built URL</div>
            <button onClick={copy} className="copy-btn">
              {copied ? (
                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
          </div>
          <div className="output-area break-all text-indigo-300">{builtUrl}</div>
        </div>
      </div>
    </div>
  )
}
