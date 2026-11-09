import { useState, useMemo } from 'react'

function csvToJson(csv: string): { data: Record<string, string>[]; error: string | null } {
  try {
    const lines = csv.trim().split('\n').filter(l => l.trim())
    if (lines.length < 2) return { data: [], error: 'Need at least a header row and one data row' }
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''))
    const data = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''))
      return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? '']))
    })
    return { data, error: null }
  } catch (e) {
    return { data: [], error: (e as Error).message }
  }
}

function jsonToCsv(json: string): { csv: string; error: string | null } {
  try {
    const arr = JSON.parse(json)
    if (!Array.isArray(arr)) return { csv: '', error: 'Input must be a JSON array' }
    if (arr.length === 0) return { csv: '', error: 'Array is empty' }
    const headers = Object.keys(arr[0])
    const rows = arr.map((row: Record<string, unknown>) =>
      headers.map(h => {
        const v = String(row[h] ?? '')
        return v.includes(',') ? `"${v}"` : v
      }).join(',')
    )
    return { csv: [headers.join(','), ...rows].join('\n'), error: null }
  } catch (e) {
    return { csv: '', error: (e as Error).message }
  }
}

const SAMPLE_CSV = `name,age,city,email
Alice,30,New York,alice@example.com
Bob,25,Los Angeles,bob@example.com
Charlie,35,Chicago,charlie@example.com`

export default function CsvJsonConverter() {
  const [mode, setMode] = useState<'csv-to-json' | 'json-to-csv'>('csv-to-json')
  const [input, setInput] = useState(SAMPLE_CSV)
  const [copied, setCopied] = useState(false)

  const result = useMemo(() => {
    if (mode === 'csv-to-json') {
      const { data, error } = csvToJson(input)
      return { output: error ? '' : JSON.stringify(data, null, 2), error, tableData: data }
    } else {
      const { csv, error } = jsonToCsv(input)
      return { output: csv, error, tableData: [] }
    }
  }, [input, mode])

  const copy = () => {
    navigator.clipboard.writeText(result.output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const switchMode = () => {
    if (mode === 'csv-to-json' && result.output) {
      setInput(result.output)
      setMode('json-to-csv')
    } else if (mode === 'json-to-csv' && result.output) {
      setInput(result.output)
      setMode('csv-to-json')
    } else {
      setMode(m => m === 'csv-to-json' ? 'json-to-csv' : 'csv-to-json')
    }
  }

  const headers = result.tableData.length > 0 ? Object.keys(result.tableData[0]) : []

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h1 className="tool-title">CSV ↔ JSON Converter</h1>
        <p className="tool-description">Bidirectional CSV to JSON conversion with table preview</p>
      </div>

      <div className="space-y-4">
        {/* Mode toggle */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium" style={{ color: mode === 'csv-to-json' ? 'var(--text-primary)' : 'var(--text-muted)' }}>CSV</span>
          <button onClick={switchMode} className="btn-secondary px-3 py-1.5 text-xs flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            Swap
          </button>
          <span className="text-sm font-medium" style={{ color: mode === 'json-to-csv' ? 'var(--text-primary)' : 'var(--text-muted)' }}>JSON</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="panel flex flex-col">
            <div className="panel-label">{mode === 'csv-to-json' ? 'CSV Input' : 'JSON Input'}</div>
            <textarea
              className="textarea-base flex-1 min-h-72"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={mode === 'csv-to-json' ? 'name,age\nAlice,30' : '[{"name":"Alice","age":30}]'}
              spellCheck={false}
            />
          </div>

          <div className="panel flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <div className="panel-label">{mode === 'csv-to-json' ? 'JSON Output' : 'CSV Output'}</div>
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
              <pre className="output-area flex-1 min-h-72 overflow-auto">{result.output}</pre>
            )}
          </div>
        </div>

        {/* Table preview */}
        {result.tableData.length > 0 && (
          <div className="panel">
            <div className="panel-label">Table Preview</div>
            <div className="overflow-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {headers.map(h => (
                      <th key={h} className="px-3 py-2 font-medium whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.tableData.map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                      {headers.map(h => (
                        <td key={h} className="px-3 py-2 font-mono whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>{row[h]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
