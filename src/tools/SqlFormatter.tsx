import { useState } from 'react'

const KEYWORDS = [
  'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'NOT', 'IN', 'BETWEEN', 'LIKE', 'IS', 'NULL',
  'ORDER', 'BY', 'GROUP', 'HAVING', 'LIMIT', 'OFFSET', 'JOIN', 'LEFT', 'RIGHT', 'INNER',
  'OUTER', 'FULL', 'CROSS', 'ON', 'AS', 'DISTINCT', 'TOP', 'INTO', 'VALUES', 'INSERT',
  'UPDATE', 'SET', 'DELETE', 'CREATE', 'DROP', 'ALTER', 'TABLE', 'INDEX', 'VIEW', 'DATABASE',
  'SCHEMA', 'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES', 'UNIQUE', 'NOT', 'NULL', 'DEFAULT',
  'AUTO_INCREMENT', 'IDENTITY', 'CONSTRAINT', 'CHECK', 'CASCADE', 'TRUNCATE', 'UNION',
  'ALL', 'EXISTS', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'IF', 'BEGIN', 'COMMIT', 'ROLLBACK',
  'WITH', 'RECURSIVE', 'WINDOW', 'OVER', 'PARTITION', 'ROWS', 'RANGE', 'ASC', 'DESC',
]

const NEWLINE_BEFORE = new Set(['SELECT', 'FROM', 'WHERE', 'ORDER', 'GROUP', 'HAVING', 'LIMIT', 'OFFSET', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'FULL', 'CROSS', 'UNION', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'DROP', 'ALTER', 'SET', 'WITH'])
const INDENT_AFTER = new Set(['SELECT', 'WHERE', 'SET'])

function formatSql(sql: string): string {
  if (!sql.trim()) return ''

  // tokenize: strings, identifiers, keywords, operators, etc.
  const tokens: string[] = []
  const re = /('(?:''|[^'])*'|"(?:""|[^"])*"|`(?:``|[^`])*`|--[^\n]*|\n|[a-zA-Z_]\w*|[0-9]+(?:\.[0-9]+)?|\S)/g
  let m: RegExpExecArray | null
  while ((m = re.exec(sql)) !== null) tokens.push(m[0])

  const lines: string[] = []
  let indent = 0
  let currentLine = ''

  const flush = () => {
    if (currentLine.trim()) lines.push('  '.repeat(indent) + currentLine.trim())
    currentLine = ''
  }

  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i]
    const upper = tok.toUpperCase()
    const isKeyword = KEYWORDS.includes(upper)

    if (tok === '\n') continue
    if (tok.startsWith('--')) {
      flush()
      lines.push('  '.repeat(indent) + tok)
      continue
    }

    if (isKeyword && NEWLINE_BEFORE.has(upper)) {
      flush()
      if (upper === 'SELECT' || upper === 'INSERT' || upper === 'UPDATE' || upper === 'DELETE' || upper === 'CREATE' || upper === 'DROP' || upper === 'ALTER' || upper === 'WITH') {
        indent = 0
      }
      currentLine = upper
      if (INDENT_AFTER.has(upper)) indent = 1
      else indent = 1
      continue
    }

    if (upper === 'AND' || upper === 'OR') {
      flush()
      indent = 1
      currentLine = upper
      continue
    }

    if (tok === ',') {
      currentLine += ','
      flush()
      continue
    }

    if (tok === '(') {
      currentLine += '('
      indent++
      continue
    }

    if (tok === ')') {
      indent = Math.max(0, indent - 1)
      currentLine += ')'
      continue
    }

    if (tok === ';') {
      currentLine += ';'
      flush()
      lines.push('')
      indent = 0
      continue
    }

    if (currentLine && !currentLine.endsWith('(') && !currentLine.endsWith('.')) {
      currentLine += ' '
    }
    currentLine += isKeyword ? upper : tok
  }
  flush()

  return lines.join('\n')
}

function syntaxHighlightSql(sql: string): string {
  const escaped = sql.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  return escaped
    .replace(/('(?:''|[^'])*')/g, '<span class="token-string">$1</span>')
    .replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="token-number">$1</span>')
    .replace(new RegExp(`\\b(${KEYWORDS.join('|')})\\b`, 'g'), '<span class="token-key">$1</span>')
    .replace(/(--[^\n]*)/g, '<span style="color:#6b7280">$1</span>')
}

const SAMPLE = `select u.id, u.name, u.email, count(o.id) as order_count, sum(o.total) as total_spent from users u left join orders o on u.id = o.user_id where u.created_at > '2023-01-01' and u.status = 'active' group by u.id, u.name, u.email having count(o.id) > 0 order by total_spent desc limit 50;`

export default function SqlFormatter() {
  const [input, setInput] = useState(SAMPLE)
  const [copied, setCopied] = useState(false)

  const formatted = formatSql(input)

  const copy = () => {
    navigator.clipboard.writeText(formatted)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="tool-container max-w-5xl">
      <div className="tool-header">
        <h1 className="tool-title">SQL Formatter</h1>
        <p className="tool-description">Format SQL with keyword uppercase and proper indentation</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="panel flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <div className="panel-label">Input SQL</div>
            <button onClick={() => setInput('')} className="btn-ghost text-xs">Clear</button>
          </div>
          <textarea
            className="textarea-base flex-1 min-h-80"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Paste SQL here..."
            spellCheck={false}
          />
        </div>

        <div className="panel flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <div className="panel-label">Formatted</div>
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
            dangerouslySetInnerHTML={{ __html: syntaxHighlightSql(formatted) }}
          />
        </div>
      </div>
    </div>
  )
}
