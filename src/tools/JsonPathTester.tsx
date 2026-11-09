import { useState, useMemo } from 'react'

// Simple JSONPath subset: dot notation, bracket notation, wildcards, array index
function jsonPath(obj: unknown, path: string): unknown[] {
  if (!path || path === '$') return [obj]
  // normalize: remove leading $. or $
  let p = path.replace(/^\$\.?/, '')
  if (!p) return [obj]

  function traverse(current: unknown, segments: string[]): unknown[] {
    if (segments.length === 0) return [current]
    const [seg, ...rest] = segments

    if (seg === '*') {
      if (Array.isArray(current)) {
        return current.flatMap(item => traverse(item, rest))
      }
      if (current && typeof current === 'object') {
        return Object.values(current as Record<string, unknown>).flatMap(v => traverse(v, rest))
      }
      return []
    }

    if (seg === '..') {
      // recursive descent
      const results: unknown[] = []
      function descend(node: unknown) {
        results.push(...traverse(node, rest))
        if (Array.isArray(node)) node.forEach(descend)
        else if (node && typeof node === 'object') Object.values(node as Record<string, unknown>).forEach(descend)
      }
      descend(current)
      return results
    }

    // array index or key
    if (Array.isArray(current)) {
      const idx = Number(seg)
      if (!isNaN(idx)) return traverse(current[idx], rest)
      return []
    }
    if (current && typeof current === 'object') {
      const val = (current as Record<string, unknown>)[seg]
      if (val === undefined) return []
      return traverse(val, rest)
    }
    return []
  }

  // Parse path into segments, handling bracket notation
  const segments: string[] = []
  let remaining = p
  while (remaining) {
    const dotIdx = remaining.indexOf('.')
    const bracketIdx = remaining.indexOf('[')
    if (bracketIdx !== -1 && (dotIdx === -1 || bracketIdx < dotIdx)) {
      if (bracketIdx > 0) segments.push(remaining.slice(0, bracketIdx))
      const closeIdx = remaining.indexOf(']', bracketIdx)
      if (closeIdx === -1) break
      const inner = remaining.slice(bracketIdx + 1, closeIdx).replace(/['"]/g, '')
      segments.push(inner === '*' ? '*' : inner)
      remaining = remaining.slice(closeIdx + 1).replace(/^\./, '')
    } else if (dotIdx !== -1) {
      const part = remaining.slice(0, dotIdx)
      if (part === '..') {
        segments.push('..')
      } else if (part) {
        segments.push(part)
      }
      remaining = remaining.slice(dotIdx + 1)
    } else {
      segments.push(remaining)
      break
    }
  }

  return traverse(obj, segments)
}

const SAMPLE = `{
  "store": {
    "books": [
      {"title": "Moby Dick", "price": 8.99, "author": "Melville"},
      {"title": "The Raven", "price": 12.99, "author": "Poe"},
      {"title": "1984", "price": 7.99, "author": "Orwell"}
    ],
    "name": "Corner Store"
  },
  "owner": "Alice"
}`

export default function JsonPathTester() {
  const [json, setJson] = useState(SAMPLE)
  const [path, setPath] = useState('$.store.books[0].title')
  const [copied, setCopied] = useState(false)

  const result = useMemo(() => {
    try {
      const parsed = JSON.parse(json)
      const matches = jsonPath(parsed, path)
      return { matches, error: null }
    } catch (e) {
      return { matches: [], error: (e as Error).message }
    }
  }, [json, path])

  const output = JSON.stringify(result.matches, null, 2)

  const copy = () => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h1 className="tool-title">JSONPath Tester</h1>
        <p className="tool-description">Query JSON using dot/bracket notation path expressions</p>
      </div>

      <div className="space-y-4">
        {/* Path input */}
        <div className="panel">
          <div className="panel-label">Path Expression</div>
          <input
            className="input-base font-mono"
            value={path}
            onChange={e => setPath(e.target.value)}
            placeholder="$.store.books[*].title"
          />
          <div className="mt-2 flex gap-2 flex-wrap">
            {['$.store.books[0].title', '$.store.books[*].title', '$.store.books[*].price', '$.owner', '$..author'].map(p => (
              <button key={p} onClick={() => setPath(p)} className="btn-ghost text-xs font-mono">{p}</button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* JSON input */}
          <div className="panel flex flex-col">
            <div className="panel-label">JSON Input</div>
            <textarea
              className="textarea-base flex-1 min-h-72"
              value={json}
              onChange={e => setJson(e.target.value)}
              spellCheck={false}
            />
          </div>

          {/* Result */}
          <div className="panel flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <div className="panel-label">
                Result
                {!result.error && (
                  <span className="ml-2 text-indigo-400 normal-case font-normal">
                    ({result.matches.length} match{result.matches.length !== 1 ? 'es' : ''})
                  </span>
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
            {result.error ? (
              <p className="text-red-400 text-sm">{result.error}</p>
            ) : (
              <pre className="output-area flex-1 min-h-72 overflow-auto">{output}</pre>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
