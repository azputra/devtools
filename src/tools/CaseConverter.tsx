import { useState } from 'react'

function toWords(input: string): string[] {
  return input
    .replace(/([a-z])([A-Z])/g, '$1 $2') // camelCase split
    .replace(/[-_]+/g, ' ')              // snake/kebab to space
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
}

const cases = {
  'camelCase':    (words: string[]) => words.map((w, i) => i === 0 ? w : w[0].toUpperCase() + w.slice(1)).join(''),
  'PascalCase':   (words: string[]) => words.map(w => w[0].toUpperCase() + w.slice(1)).join(''),
  'snake_case':   (words: string[]) => words.join('_'),
  'SCREAMING':    (words: string[]) => words.join('_').toUpperCase(),
  'kebab-case':   (words: string[]) => words.join('-'),
  'COBOL-CASE':   (words: string[]) => words.join('-').toUpperCase(),
  'Title Case':   (words: string[]) => words.map(w => w[0].toUpperCase() + w.slice(1)).join(' '),
  'lowercase':    (words: string[]) => words.join(' '),
  'UPPERCASE':    (words: string[]) => words.join(' ').toUpperCase(),
  'dot.case':     (words: string[]) => words.join('.'),
}

export default function CaseConverter() {
  const [input, setInput] = useState('Hello World Example Text')
  const [copied, setCopied] = useState<string | null>(null)

  const words = toWords(input)
  const converted = Object.entries(cases).map(([name, fn]) => ({ name, value: fn(words) }))

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 1500)
  }

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h1 className="tool-title">Case Converter</h1>
        <p className="tool-description">Convert text between camelCase, snake_case, kebab-case, and more</p>
      </div>

      <div className="space-y-4">
        <div className="panel">
          <div className="panel-label">Input</div>
          <input
            className="input-base"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Enter text to convert..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {converted.map(({ name, value }) => (
            <div key={name} className="panel group">
              <div className="flex items-center justify-between mb-2">
                <div className="panel-label">{name}</div>
                <button onClick={() => copy(value, name)} className="copy-btn">
                  {copied === name ? (
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
              <div className="output-area font-mono text-sm break-all">{value || <span className="text-gray-600">—</span>}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
