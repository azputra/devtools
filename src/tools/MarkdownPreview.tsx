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
  let listItems: string[] = []
  let listOrdered = false

  const flushList = () => {
    if (listItems.length > 0) {
      const tag = listOrdered ? 'ol' : 'ul'
      const cls = listOrdered ? 'list-decimal' : 'list-disc'
      result.push(`<${tag} class="${cls} list-inside space-y-1 my-3 md-text">${listItems.map(i => `<li>${i}</li>`).join('')}</${tag}>`)
      listItems = []
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
    if (inCode) { codeLines.push(line); continue }

    const headingMatch = /^(#{1,6})\s+(.+)$/.exec(line)
    if (headingMatch) {
      flushList()
      const level = headingMatch[1].length
      const sizes = ['text-3xl', 'text-2xl', 'text-xl', 'text-lg', 'text-base', 'text-sm']
      result.push(`<h${level} class="${sizes[level-1]} font-bold md-heading mt-6 mb-3 md-border pb-1">${inlineFormat(headingMatch[2])}</h${level}>`)
      continue
    }

    if (/^---+$/.test(line.trim()) || /^\*\*\*+$/.test(line.trim())) {
      flushList()
      result.push('<hr class="md-border-hr my-6" />')
      continue
    }

    if (line.startsWith('> ')) {
      flushList()
      result.push(`<blockquote class="md-blockquote pl-4 py-1 my-3 md-secondary italic">${inlineFormat(line.slice(2))}</blockquote>`)
      continue
    }

    const orderedMatch = /^\d+\.\s/.exec(line)
    const unorderedMatch = /^[-*+]\s/.exec(line)
    if (unorderedMatch || orderedMatch) {
      const isOrdered = !!orderedMatch
      if (listItems.length > 0 && isOrdered !== listOrdered) flushList()
      listOrdered = isOrdered
      listItems.push(inlineFormat(line.replace(/^[-*+\d.]+\s/, '')))
      continue
    } else if (listItems.length > 0) {
      flushList()
    }

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

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
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

Made with love using vanilla JS markdown parsing.`

export default function MarkdownPreview() {
  const [input, setInput] = useState(SAMPLE)
  const [view, setView] = useState<'split' | 'edit' | 'preview' | 'html'>('split')
  const [copied, setCopied] = useState<'md' | 'html' | null>(null)

  const html = renderMarkdown(input)
  const words = wordCount(input)

  const copy = (text: string, key: 'md' | 'html') => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 1500)
  }

  const previewContent = (
    <div
      className="prose prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )

  return (
    <div className="max-w-6xl mx-auto">
      <div className="tool-header flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="tool-title">Markdown Preview</h1>
          <p className="tool-description">Live markdown editor with instant preview</p>
        </div>
        <div className="flex gap-2 items-center flex-wrap">
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{words} words · {input.length} chars</span>
          {(['edit', 'split', 'preview', 'html'] as const).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: view === v ? 'var(--accent)' : 'var(--bg-elevated)',
                color: view === v ? '#0f1218' : 'var(--text-muted)',
                border: `1px solid ${view === v ? 'var(--accent)' : 'var(--border)'}`,
              }}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
          <button onClick={() => copy(input, 'md')} className="copy-btn ml-1" title="Copy Markdown">
            MD {copied === 'md' ? '✓' : ''}
          </button>
          <button onClick={() => copy(html, 'html')} className="copy-btn" title="Copy HTML">
            HTML {copied === 'html' ? '✓' : ''}
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
            {previewContent}
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
          {previewContent}
        </div>
      )}

      {view === 'html' && (
        <div className="panel min-h-96 overflow-y-auto">
          <div className="panel-label">Raw HTML</div>
          <pre className="output-area overflow-auto whitespace-pre-wrap text-xs">{html}</pre>
        </div>
      )}
    </div>
  )
}
