import { useState, useMemo } from 'react'

function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function highlightMatches(text: string, regex: RegExp): string {
  const parts: string[] = []
  let last = 0
  let m: RegExpExecArray | null
  const re = new RegExp(regex.source, regex.flags.includes('g') ? regex.flags : regex.flags + 'g')
  while ((m = re.exec(text)) !== null) {
    parts.push(escapeHtml(text.slice(last, m.index)))
    parts.push(`<mark class="match-highlight">${escapeHtml(m[0])}</mark>`)
    last = m.index + m[0].length
    if (m[0].length === 0) re.lastIndex++ // avoid infinite loop on zero-length match
  }
  parts.push(escapeHtml(text.slice(last)))
  return parts.join('')
}

export default function RegexTester() {
  const [pattern, setPattern] = useState('(\\w+)')
  const [flags, setFlags] = useState('g')
  const [testText, setTestText] = useState('Hello world, foo bar baz!')

  const toggleFlag = (f: string) =>
    setFlags(prev => prev.includes(f) ? prev.replace(f, '') : prev + f)

  const result = useMemo(() => {
    if (!pattern) return { error: null, matches: [], highlighted: escapeHtml(testText) }
    try {
      const re = new RegExp(pattern, flags.includes('g') ? flags : flags)
      const allFlags = flags.includes('g') ? flags : 'g' + flags
      const reG = new RegExp(pattern, allFlags)
      const matches: RegExpExecArray[] = []
      let m: RegExpExecArray | null
      while ((m = reG.exec(testText)) !== null) {
        matches.push({ ...m, index: m.index, input: m.input, groups: m.groups })
        if (m[0].length === 0) reG.lastIndex++
      }
      return { error: null, matches, highlighted: highlightMatches(testText, re) }
    } catch (e) {
      return { error: (e as Error).message, matches: [], highlighted: escapeHtml(testText) }
    }
  }, [pattern, flags, testText])

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h1 className="tool-title">Regex Tester</h1>
        <p className="tool-description">Live regular expression matching with match highlighting</p>
      </div>

      <div className="space-y-4">
        {/* Pattern + flags */}
        <div className="panel">
          <div className="panel-label">Pattern</div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-lg font-mono">/</span>
            <input
              className="input-base flex-1"
              value={pattern}
              onChange={e => setPattern(e.target.value)}
              placeholder="Enter regex pattern..."
              spellCheck={false}
            />
            <span className="text-gray-500 text-lg font-mono">/</span>
            <div className="flex gap-1">
              {['g', 'i', 'm', 's'].map(f => (
                <button
                  key={f}
                  onClick={() => toggleFlag(f)}
                  className={`w-8 h-8 rounded-md text-sm font-mono font-medium transition-colors ${
                    flags.includes(f)
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          {result.error && (
            <p className="mt-2 text-xs text-red-400">{result.error}</p>
          )}
        </div>

        {/* Test string */}
        <div className="panel">
          <div className="panel-label">Test String</div>
          <textarea
            className="textarea-base h-28"
            value={testText}
            onChange={e => setTestText(e.target.value)}
            placeholder="Enter text to test against..."
          />
        </div>

        {/* Result */}
        <div className="panel">
          <div className="flex items-center justify-between mb-2">
            <div className="panel-label">Match Preview</div>
            <span className="text-xs text-indigo-400 font-medium">
              {result.matches.length} match{result.matches.length !== 1 ? 'es' : ''}
            </span>
          </div>
          <div
            className="output-area leading-relaxed whitespace-pre-wrap break-all"
            dangerouslySetInnerHTML={{ __html: result.highlighted }}
          />
        </div>

        {/* Match list */}
        {result.matches.length > 0 && (
          <div className="panel">
            <div className="panel-label">Match List</div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {result.matches.map((m, i) => (
                <div key={i} className="bg-gray-800 rounded-lg p-3 text-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-indigo-400 text-xs font-medium">Match {i + 1}</span>
                    <span className="text-gray-500 text-xs">index {m.index}</span>
                  </div>
                  <div className="font-mono text-green-300">"{m[0]}"</div>
                  {m.length > 1 && (
                    <div className="mt-1 space-y-0.5">
                      {Array.from({ length: m.length - 1 }, (_, g) => (
                        <div key={g} className="text-xs text-gray-400">
                          Group {g + 1}: <span className="text-yellow-300 font-mono">"{m[g + 1]}"</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
