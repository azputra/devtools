import { useState } from 'react'

function toBase64(s: string): string {
  try { return btoa(unescape(encodeURIComponent(s))) } catch { return '' }
}
function fromBase64(s: string): string {
  try { return decodeURIComponent(escape(atob(s.trim()))) } catch { return 'Invalid Base64' }
}
function toBase64Url(s: string): string {
  return toBase64(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}
function fromBase64Url(s: string): string {
  const std = s.replace(/-/g, '+').replace(/_/g, '/')
  return fromBase64(std)
}

export default function Base64Tool() {
  const [input, setInput] = useState('Hello, World!')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [variant, setVariant] = useState<'standard' | 'url'>('standard')
  const [copied, setCopied] = useState(false)

  const output = mode === 'encode'
    ? (variant === 'standard' ? toBase64(input) : toBase64Url(input))
    : (variant === 'standard' ? fromBase64(input) : fromBase64Url(input))

  const copy = () => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const swap = () => {
    setInput(output)
    setMode(m => m === 'encode' ? 'decode' : 'encode')
  }

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h1 className="tool-title">Base64 Tool</h1>
        <p className="tool-description">Encode and decode Base64 strings, standard and URL-safe variants</p>
      </div>

      <div className="space-y-4">
        {/* Controls */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex gap-1">
            {(['encode', 'decode'] as const).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  mode === m ? 'bg-indigo-600 text-white' : 'btn-secondary'
                }`}
              >
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex gap-1">
            {(['standard', 'url'] as const).map(v => (
              <button
                key={v}
                onClick={() => setVariant(v)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  variant === v ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-500 hover:text-gray-300'
                }`}
              >
                {v === 'url' ? 'URL-safe' : 'Standard'}
              </button>
            ))}
          </div>
          <button onClick={swap} className="btn-ghost text-xs flex items-center gap-1 ml-auto">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            Swap
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="panel">
            <div className="panel-label">
              {mode === 'encode' ? 'Plain Text' : 'Base64'}
            </div>
            <textarea
              className="textarea-base h-48"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 to decode...'}
              spellCheck={false}
            />
            <p className="mt-2 text-xs text-gray-600">{input.length} characters</p>
          </div>

          <div className="panel">
            <div className="flex items-center justify-between mb-2">
              <div className="panel-label">
                {mode === 'encode' ? 'Base64' : 'Plain Text'}
              </div>
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
            <div className="output-area h-48 overflow-auto break-all">{output}</div>
            <p className="mt-2 text-xs text-gray-600">{output.length} characters</p>
          </div>
        </div>
      </div>
    </div>
  )
}
