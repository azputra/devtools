import { useState, useMemo } from 'react'

function syntaxHighlight(json: string): string {
  return json
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
      let cls = 'token-number'
      if (/^"/.test(match)) {
        cls = /:$/.test(match) ? 'token-key' : 'token-string'
      } else if (/true|false/.test(match)) {
        cls = 'token-bool'
      } else if (/null/.test(match)) {
        cls = 'token-null'
      }
      return `<span class="${cls}">${match}</span>`
    })
}

export default function JsonFormatter() {
  const [input, setInput] = useState('{"name":"John","age":30,"hobbies":["reading","coding"],"address":{"city":"NYC","zip":"10001"}}')
  const [indent, setIndent] = useState(2)
  const [copied, setCopied] = useState(false)

  const result = useMemo(() => {
    if (!input.trim()) return { pretty: '', minified: '', error: null, valid: false }
    try {
      const parsed = JSON.parse(input)
      const pretty = JSON.stringify(parsed, null, indent)
      const minified = JSON.stringify(parsed)
      return { pretty, minified, error: null, valid: true }
    } catch (e) {
      return { pretty: '', minified: '', error: (e as Error).message, valid: false }
    }
  }, [input, indent])

  const [mode, setMode] = useState<'pretty' | 'minified'>('pretty')
  const output = mode === 'pretty' ? result.pretty : result.minified

  const copy = () => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h1 className="tool-title">JSON Formatter</h1>
        <p className="tool-description">Prettify, minify and validate JSON with syntax highlighting</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div className="panel flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <div className="panel-label">Input JSON</div>
            <button onClick={() => setInput('')} className="btn-ghost text-xs">Clear</button>
          </div>
          <textarea
            className="textarea-base flex-1 min-h-80"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Paste JSON here..."
            spellCheck={false}
          />
          <div className="mt-2 flex items-center gap-2">
            {result.valid ? (
              <span className="text-xs text-green-400 flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                Valid JSON
              </span>
            ) : input.trim() ? (
              <span className="text-xs text-red-400">{result.error}</span>
            ) : null}
          </div>
        </div>

        {/* Output */}
        <div className="panel flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <div className="flex gap-1">
              {(['pretty', 'minified'] as const).map(m => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className="px-3 py-1 rounded-md text-xs font-medium transition-colors"
                  style={{
                    background: mode === m ? 'var(--accent)' : 'var(--bg-elevated)',
                    color: mode === m ? 'white' : 'var(--text-muted)',
                  }}
                >
                  {m === 'pretty' ? 'Prettify' : 'Minify'}
                </button>
              ))}
              {mode === 'pretty' && (
                <select
                  value={indent}
                  onChange={e => setIndent(Number(e.target.value))}
                  className="ml-2 select-inline"
                >
                  <option value={2}>2 spaces</option>
                  <option value={4}>4 spaces</option>
                  <option value={1}>1 tab</option>
                </select>
              )}
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
          <div
            className="output-area flex-1 min-h-80 overflow-auto whitespace-pre leading-relaxed"
            dangerouslySetInnerHTML={{ __html: output ? syntaxHighlight(output) : '' }}
          />
        </div>
      </div>
    </div>
  )
}
