import { useState, useEffect } from 'react'

type Algo = 'SHA-1' | 'SHA-256' | 'SHA-512'

async function hashText(text: string, algo: Algo): Promise<string> {
  const buf = new TextEncoder().encode(text)
  const hash = await crypto.subtle.digest(algo, buf)
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export default function HashGenerator() {
  const [input, setInput] = useState('Hello, World!')
  const [hashes, setHashes] = useState<Record<Algo, string>>({ 'SHA-1': '', 'SHA-256': '', 'SHA-512': '' })
  const [copied, setCopied] = useState<string | null>(null)
  const [format, setFormat] = useState<'hex' | 'base64'>('hex')

  useEffect(() => {
    if (!input) {
      setHashes({ 'SHA-1': '', 'SHA-256': '', 'SHA-512': '' })
      return
    }
    const algos: Algo[] = ['SHA-1', 'SHA-256', 'SHA-512']
    Promise.all(algos.map(a => hashText(input, a))).then(([h1, h256, h512]) => {
      if (format === 'hex') {
        setHashes({ 'SHA-1': h1, 'SHA-256': h256, 'SHA-512': h512 })
      } else {
        const toB64 = (hex: string) => {
          const bytes = hex.match(/.{1,2}/g)!.map(b => parseInt(b, 16))
          return btoa(String.fromCharCode(...bytes))
        }
        setHashes({ 'SHA-1': toB64(h1), 'SHA-256': toB64(h256), 'SHA-512': toB64(h512) })
      }
    })
  }, [input, format])

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 1500)
  }

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h1 className="tool-title">Hash Generator</h1>
        <p className="tool-description">Generate SHA-1, SHA-256, SHA-512 hashes via Web Crypto API</p>
      </div>

      <div className="space-y-4">
        <div className="panel">
          <div className="flex items-center justify-between mb-2">
            <div className="panel-label">Input</div>
            <div className="flex gap-1">
              {(['hex', 'base64'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className="px-3 py-1 rounded-md text-xs font-medium transition-all"
                  style={{
                    background: format === f ? 'var(--accent)' : 'var(--bg-elevated)',
                    color: format === f ? 'white' : 'var(--text-muted)',
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <textarea
            className="textarea-base h-28"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Enter text to hash..."
          />
        </div>

        {(['SHA-1', 'SHA-256', 'SHA-512'] as Algo[]).map(algo => (
          <div key={algo} className="panel">
            <div className="flex items-center justify-between mb-2">
              <div className="panel-label">{algo}</div>
              <button onClick={() => copy(hashes[algo], algo)} className="copy-btn">
                {copied === algo ? (
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
            <div className="output-area font-mono text-xs break-all leading-relaxed">
              {hashes[algo] || <span className="text-gray-600">—</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
