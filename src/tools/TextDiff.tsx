import { useState, useMemo } from 'react'

interface DiffLine { type: 'add' | 'remove' | 'same'; text: string; lineA?: number; lineB?: number }

function lcs(a: string[], b: string[]): number[][] {
  const m = a.length, n = b.length
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1] + 1 : Math.max(dp[i-1][j], dp[i][j-1])
  return dp
}

function diff(a: string[], b: string[]): DiffLine[] {
  const dp = lcs(a, b)
  const result: DiffLine[] = []
  let i = a.length, j = b.length
  let lineA = i, lineB = j
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i-1] === b[j-1]) {
      result.unshift({ type: 'same', text: a[i-1], lineA: i, lineB: j })
      i--; j--
    } else if (j > 0 && (i === 0 || dp[i][j-1] >= dp[i-1][j])) {
      result.unshift({ type: 'add', text: b[j-1], lineB: j })
      j--
    } else {
      result.unshift({ type: 'remove', text: a[i-1], lineA: i })
      i--
    }
  }
  void lineA; void lineB
  return result
}

const SAMPLE_A = `function greet(name) {
  console.log("Hello, " + name);
  return name;
}

const user = "Alice";
greet(user);`

const SAMPLE_B = `function greet(name, greeting = "Hello") {
  console.log(\`\${greeting}, \${name}!\`);
  return { name, greeting };
}

const user = "Bob";
greet(user, "Hi");`

export default function TextDiff() {
  const [textA, setTextA] = useState(SAMPLE_A)
  const [textB, setTextB] = useState(SAMPLE_B)

  const diffLines = useMemo(() => {
    const a = textA.split('\n')
    const b = textB.split('\n')
    return diff(a, b)
  }, [textA, textB])

  const added = diffLines.filter(l => l.type === 'add').length
  const removed = diffLines.filter(l => l.type === 'remove').length

  return (
    <div className="tool-container max-w-6xl">
      <div className="tool-header">
        <h1 className="tool-title">Text Diff</h1>
        <p className="tool-description">Line-by-line diff using LCS algorithm</p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="panel">
            <div className="panel-label">Original</div>
            <textarea
              className="textarea-base h-56"
              value={textA}
              onChange={e => setTextA(e.target.value)}
              placeholder="Paste original text..."
            />
          </div>
          <div className="panel">
            <div className="panel-label">Modified</div>
            <textarea
              className="textarea-base h-56"
              value={textB}
              onChange={e => setTextB(e.target.value)}
              placeholder="Paste modified text..."
            />
          </div>
        </div>

        {/* Summary */}
        <div className="flex items-center gap-4 text-sm">
          <span className="text-green-400 font-medium">+{added} added</span>
          <span className="text-red-400 font-medium">-{removed} removed</span>
          <span style={{ color: 'var(--text-muted)' }}>{diffLines.filter(l => l.type === 'same').length} unchanged</span>
        </div>

        {/* Diff output */}
        <div className="panel">
          <div className="panel-label">Diff</div>
          <div className="font-mono text-xs overflow-auto max-h-96">
            {diffLines.map((line, i) => (
              <div
                key={i}
                className={`flex gap-2 px-2 py-0.5 ${
                  line.type === 'add' ? 'diff-add' :
                  line.type === 'remove' ? 'diff-remove' :
                  'diff-same'
                }`}
              >
                <span className="w-4 flex-shrink-0 select-none">
                  {line.type === 'add' ? '+' : line.type === 'remove' ? '-' : ' '}
                </span>
                <span className="w-8 text-right flex-shrink-0 select-none" style={{ color: 'var(--text-muted)' }}>
                  {line.type === 'remove' ? line.lineA : line.type === 'add' ? line.lineB : line.lineA}
                </span>
                <span className="whitespace-pre flex-1">{line.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
