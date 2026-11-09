import { useState } from 'react'

const LOREM = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium totam rem aperiam. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.'

const LOREM_WORDS = LOREM.split(' ')

const FIRST_NAMES = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry', 'Iris', 'Jack', 'Kate', 'Liam', 'Maya', 'Noah', 'Olivia', 'Paul', 'Quinn', 'Rachel', 'Sam', 'Tara']
const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Wilson', 'Anderson', 'Taylor', 'Thomas', 'Moore', 'Jackson', 'Martin', 'Lee']
const DOMAINS = ['gmail.com', 'yahoo.com', 'outlook.com', 'example.com', 'proton.me', 'dev.io']
const CITIES = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose']
const COUNTRIES = ['US', 'GB', 'CA', 'AU', 'DE', 'FR', 'JP', 'BR', 'IN', 'MX']
const JOB_TITLES = ['Software Engineer', 'Product Manager', 'Designer', 'Data Analyst', 'DevOps Engineer', 'Marketing Manager', 'Sales Rep', 'QA Engineer', 'CTO', 'CEO']
const COMPANIES = ['Acme Corp', 'TechFlow', 'DataSoft', 'CloudBridge', 'NextStep', 'Innovatech', 'BuildFast', 'CodeLabs', 'NetSphere', 'AlphaTech']

function rand<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)] }
function randInt(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min }

function generateLoremWords(count: number) {
  const result: string[] = []
  while (result.length < count) result.push(...LOREM_WORDS)
  return result.slice(0, count).join(' ')
}

function generateLoremSentences(count: number) {
  const sentences: string[] = []
  for (let i = 0; i < count; i++) {
    const wordCount = randInt(8, 20)
    const words = generateLoremWords(wordCount)
    sentences.push(words.charAt(0).toUpperCase() + words.slice(1) + '.')
  }
  return sentences.join(' ')
}

function generateUser() {
  const first = rand(FIRST_NAMES)
  const last = rand(LAST_NAMES)
  const email = `${first.toLowerCase()}.${last.toLowerCase()}${randInt(1, 999)}@${rand(DOMAINS)}`
  return {
    id: crypto.randomUUID(),
    firstName: first,
    lastName: last,
    name: `${first} ${last}`,
    email,
    age: randInt(18, 65),
    phone: `+1${randInt(2000000000, 9999999999)}`,
    city: rand(CITIES),
    country: rand(COUNTRIES),
    company: rand(COMPANIES),
    jobTitle: rand(JOB_TITLES),
    createdAt: new Date(Date.now() - randInt(0, 365 * 24 * 3600 * 1000)).toISOString(),
  }
}

export default function FixtureGenerator() {
  const [mode, setMode] = useState<'lorem' | 'users'>('lorem')
  const [loremType, setLoremType] = useState<'words' | 'sentences' | 'paragraphs'>('sentences')
  const [loremCount, setLoremCount] = useState(3)
  const [userCount, setUserCount] = useState(5)
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)

  const generate = () => {
    if (mode === 'lorem') {
      if (loremType === 'words') setOutput(generateLoremWords(loremCount))
      else if (loremType === 'sentences') setOutput(generateLoremSentences(loremCount))
      else {
        const paras = Array.from({ length: loremCount }, () => generateLoremSentences(randInt(4, 7)))
        setOutput(paras.join('\n\n'))
      }
    } else {
      const users = Array.from({ length: userCount }, generateUser)
      setOutput(JSON.stringify(users, null, 2))
    }
  }

  const copy = () => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h1 className="tool-title">Fixture Generator</h1>
        <p className="tool-description">Generate lorem ipsum text and mock user data JSON</p>
      </div>

      <div className="space-y-4">
        {/* Mode */}
        <div className="flex gap-2">
          {(['lorem', 'users'] as const).map(m => (
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
              {m === 'lorem' ? 'Lorem Ipsum' : 'Mock Users'}
            </button>
          ))}
        </div>

        <div className="panel">
          {mode === 'lorem' ? (
            <div className="flex flex-wrap gap-4 items-end">
              <div>
                <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>Type</label>
                <select
                  value={loremType}
                  onChange={e => setLoremType(e.target.value as typeof loremType)}
                  className="input-base"
                >
                  <option value="words">Words</option>
                  <option value="sentences">Sentences</option>
                  <option value="paragraphs">Paragraphs</option>
                </select>
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>Count</label>
                <input
                  type="number" min={1} max={100}
                  value={loremCount}
                  onChange={e => setLoremCount(Math.max(1, Math.min(100, Number(e.target.value))))}
                  className="input-base w-24"
                />
              </div>
              <button onClick={generate} className="btn-primary">Generate</button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-4 items-end">
              <div>
                <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>Number of users</label>
                <input
                  type="number" min={1} max={100}
                  value={userCount}
                  onChange={e => setUserCount(Math.max(1, Math.min(100, Number(e.target.value))))}
                  className="input-base w-24"
                />
              </div>
              <button onClick={generate} className="btn-primary">Generate</button>
            </div>
          )}
        </div>

        {output && (
          <div className="panel">
            <div className="flex items-center justify-between mb-2">
              <div className="panel-label">Output</div>
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
            <pre className="output-area max-h-96 overflow-auto whitespace-pre-wrap">{output}</pre>
          </div>
        )}

        {!output && (
          <div className="text-center py-12 text-gray-600">
            <p className="text-lg mb-2">Configure options above and click Generate</p>
          </div>
        )}
      </div>
    </div>
  )
}
