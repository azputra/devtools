import { useState } from 'react'

const HTML_ENTITIES: [string, string][] = [
  ['&', '&amp;'], ['<', '&lt;'], ['>', '&gt;'], ['"', '&quot;'], ["'", '&#39;'],
]

function escapeJson(s: string): string {
  return JSON.stringify(s).slice(1, -1) // remove surrounding quotes
}
function unescapeJson(s: string): string {
  try { return JSON.parse('"' + s + '"') } catch { return s }
}
function escapeHtml(s: string): string {
  return HTML_ENTITIES.reduce((acc, [ch, ent]) => acc.replace(new RegExp(ch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), ent), s)
}
function unescapeHtml(s: string): string {
  return HTML_ENTITIES.reduceRight((acc, [ch, ent]) => acc.replace(new RegExp(ent.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), ch), s)
}
function escapeUrl(s: string): string { return encodeURIComponent(s) }
function unescapeUrl(s: string): string { try { return decodeURIComponent(s) } catch { return s } }

type Mode = 'json' | 'html' | 'url'

export default function TextEscape() {
  const [input, setInput] = useState('Hello <World> & "everyone"\nNew line here')
  const [mode, setMode] = useState<Mode>('json')
  const [copied, setCopied] = useState<'enc' | 'dec' | null>(null)

  const encoded = mode === 'json' ? escapeJson(input)
    : mode === 'html' ? escapeHtml(input)
    : escapeUrl(input)

  const decoded = mode === 'json' ? unescapeJson(input)
    : mode === 'html' ? unescapeHtml(input)
    : unescapeUrl(input)

  const copy = (text: string, key: 'enc' | 'dec') => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 1500)
  }

  const CopyBtn = ({ text, k }: { text: string; k: 'enc' | 'dec' }) => (
    <button onClick={() => copy(text, k)} className="copy-btn">
      {copied === k ? (
        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )}
    </button>
  )

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h1 className="tool-title">Text Escape</h1>
        <p className="tool-description">Encode and decode JSON strings, HTML entities, and URL encoding</p>
      </div>

      <div className="space-y-4">
        {/* Mode selector */}
        <div className="flex gap-2">
          {(['json', 'html', 'url'] as const).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: mode === m ? 'var(--accent)' : 'var(--bg-elevated)',
                color: mode === m ? 'white' : 'var(--text-primary)',
                border: `1px solid ${mode === m ? 'var(--accent)' : 'var(--border)'}`,
              }}
            >
              {m.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="panel">
          <div className="panel-label">Input</div>
          <textarea
            className="textarea-base h-32"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Enter text..."
          />
        </div>

        {/* Encoded */}
        <div className="panel">
          <div className="flex items-center justify-between mb-2">
            <div className="panel-label">Encoded</div>
            <CopyBtn text={encoded} k="enc" />
          </div>
          <div className="output-area whitespace-pre-wrap break-all">{encoded}</div>
        </div>

        {/* Decoded */}
        <div className="panel">
          <div className="flex items-center justify-between mb-2">
            <div className="panel-label">Decoded</div>
            <CopyBtn text={decoded} k="dec" />
          </div>
          <div className="output-area whitespace-pre-wrap break-all">{decoded}</div>
        </div>
      </div>
    </div>
  )
}
