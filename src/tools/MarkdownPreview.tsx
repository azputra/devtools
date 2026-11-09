import { useState } from 'react'

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function renderMarkdown(md: string): string {
  const lines = md.split('\n')
  const result: string[] = []
  let inCode = false
  let codeLang = ''
  let codeLines: string[] = []
  let inList = false
  let listItems: string[] = []

  const flushList = () => {
    if (listItems.length > 0) {
      result.push(`<ul class="list-disc list-inside space-y-1 my-3 md-text">${listItems.map(i => `<li>${i}</li>`).join('')}</ul>`)
      listItems = []
      inList = false
    }
  }

  const inlineFormat = (text: string): string => {
    return text
      .replace(/`([^`]+)`/g, '<code class="md-code px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong class="md-text font-semibold">$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em class="md-text italic">$1</em>')
      .replace(/~~([^~]+)~~/g, '<del class="md-muted">$1</del>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="md-link underline" target="_blank" rel="noopener">$1</a>')
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2" class="max-w-full rounded-lg my-2" />')
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Code block
    if (line.startsWith('```')) {
      if (!inCode) {
        flushList()
        inCode = true
        codeLang = line.slice(3).trim()
        codeLines = []
      } else {
        const escaped = codeLines.map(escapeHtml).join('\n')
        result.push(`<pre class="md-pre rounded-lg p-4 overflow-auto my-3"><code class="text-sm font-mono md-text language-${codeLang || 'text'}">${escaped}</code></pre>`)
        inCode = false
        codeLang = ''
        codeLines = []
      }
      continue
    }
    if (inCode) {
      codeLines.push(line)
      continue
    }

    // Headings
    const headingMatch = /^(#{1,6})\s+(.+)$/.exec(line)
    if (headingMatch) {
      flushList()
      const level = headingMatch[1].length
      const sizes = ['text-3xl', 'text-2xl', 'text-xl', 'text-lg', 'text-base', 'text-sm']
      result.push(`<h${level} class="${sizes[level-1]} font-bold md-heading mt-6 mb-3 md-border pb-1">${inlineFormat(headingMatch[2])}</h${level}>`)
      continue
    }

    // HR
    if (/^---+$/.test(line.trim()) || /^\*\*\*+$/.test(line.trim())) {
      flushList()
      result.push('<hr class="md-border-hr my-6" />')
      continue
    }

    // Blockquote
    if (line.startsWith('> ')) {
      flushList()
      result.push(`<blockquote class="md-blockquote pl-4 py-1 my-3 md-secondary italic">${inlineFormat(line.slice(2))}</blockquote>`)
      continue
    }

    // List
    if (/^[-*+]\s/.test(line) || /^\d+\.\s/.test(line)) {
      inList = true
      listItems.push(inlineFormat(line.replace(/^[-*+\d.]+\s/, '')))
      continue
    } else if (inList) {
      flushList()
    }

    // Table (simple)
    if (line.includes('|')) {
      flushList()
      const cells = line.split('|').filter((_, i, a) => i > 0 && i < a.length - 1).map(c => c.trim())
      const isSep = cells.every(c => /^[-:]+$/.test(c))
      if (!isSep) {
        const isHeader = lines[i + 1]?.includes('|') && lines[i + 1]?.split('|').filter((_, i, a) => i > 0 && i < a.length - 1).every(c => /^[-:]+$/.test(c.trim()))
        if (isHeader) {
          result.push('<table class="w-full text-sm my-4 border-collapse"><thead class="md-thead"><tr>' + cells.map(c => `<th class="px-3 py-2 text-left md-text font-medium">${inlineFormat(c)}</th>`).join('') + '</tr></thead><tbody>')
        } else {
          result.push('<tr class="md-tr">' + cells.map(c => `<td class="px-3 py-2 md-secondary">${inlineFormat(c)}</td>`).join('') + '</tr>')
          if (!lines[i + 1]?.includes('|')) result.push('</tbody></table>')
        }
      }
      continue
    }

    // Paragraph / blank
    if (line.trim() === '') {
      flushList()
      result.push('')
    } else {
      result.push(`<p class="md-text leading-relaxed my-2">${inlineFormat(line)}</p>`)
    }
  }
  flushList()
  return result.join('\n')
}

const SAMPLE = `# Markdown Preview

A **live** markdown editor with *instant* preview.

## Features

- Headings (h1-h6)
- **Bold** and *italic*
- \`inline code\`
- [Links](https://example.com)
- Tables, blockquotes, lists

## Code Block

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
console.log(greet("World"));
\`\`\`

## Table

| Column A | Column B | Column C |
|----------|----------|----------|
| Row 1    | Data     | More     |
| Row 2    | Data     | More     |

> This is a blockquote with important information.

---

Made with ❤️ using vanilla JS markdown parsing.`

export default function MarkdownPreview() {
  const [input, setInput] = useState(SAMPLE)
  const [view, setView] = useState<'split' | 'edit' | 'preview'>('split')
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(input)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const Preview = () => (
    <div
      className="prose prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: renderMarkdown(input) }}
    />
  )

  return (
    <div className="max-w-6xl mx-auto">
      <div className="tool-header flex items-center justify-between">
        <div>
          <h1 className="tool-title">Markdown Preview</h1>
          <p className="tool-description">Live markdown editor with instant preview</p>
        </div>
        <div className="flex gap-2 items-center">
          {(['edit', 'split', 'preview'] as const).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: view === v ? 'var(--accent)' : 'var(--bg-elevated)',
                color: view === v ? 'white' : 'var(--text-muted)',
                border: `1px solid ${view === v ? 'var(--accent)' : 'var(--border)'}`,
              }}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
          <button onClick={copy} className="copy-btn ml-1">
            {copied ? <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>}
          </button>
        </div>
      </div>

      {view === 'split' && (
        <div className="grid grid-cols-2 gap-4 h-[calc(100vh-10rem)]">
          <div className="panel flex flex-col">
            <div className="panel-label">Editor</div>
            <textarea
              className="textarea-base flex-1 resize-none"
              value={input}
              onChange={e => setInput(e.target.value)}
              spellCheck={false}
            />
          </div>
          <div className="panel overflow-y-auto">
            <div className="panel-label">Preview</div>
            <Preview />
          </div>
        </div>
      )}

      {view === 'edit' && (
        <div className="panel h-[calc(100vh-10rem)] flex flex-col">
          <div className="panel-label">Editor</div>
          <textarea
            className="textarea-base flex-1 resize-none"
            value={input}
            onChange={e => setInput(e.target.value)}
            spellCheck={false}
          />
        </div>
      )}

      {view === 'preview' && (
        <div className="panel min-h-96 overflow-y-auto">
          <Preview />
        </div>
      )}
    </div>
  )
}
