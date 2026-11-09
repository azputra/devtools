import { useState } from 'react'

type Perm = { read: boolean; write: boolean; execute: boolean }
type Perms = { owner: Perm; group: Perm; other: Perm }

function permToOctal(p: Perm): number {
  return (p.read ? 4 : 0) + (p.write ? 2 : 0) + (p.execute ? 1 : 0)
}

function octalToPerm(n: number): Perm {
  return { read: !!(n & 4), write: !!(n & 2), execute: !!(n & 1) }
}

function permsToSymbolic(perms: Perms): string {
  const sym = (p: Perm, r: string, w: string, x: string) =>
    (p.read ? r : '-') + (p.write ? w : '-') + (p.execute ? x : '-')
  return sym(perms.owner, 'r', 'w', 'x') + sym(perms.group, 'r', 'w', 'x') + sym(perms.other, 'r', 'w', 'x')
}

function permsToOctal(perms: Perms): string {
  return `${permToOctal(perms.owner)}${permToOctal(perms.group)}${permToOctal(perms.other)}`
}

const PRESETS: { label: string; octal: string; desc: string }[] = [
  { label: '644', octal: '644', desc: 'rw-r--r-- | Owner read/write, others read' },
  { label: '755', octal: '755', desc: 'rwxr-xr-x | Owner full, others read/execute' },
  { label: '777', octal: '777', desc: 'rwxrwxrwx | Everyone full access (avoid!)' },
  { label: '600', octal: '600', desc: 'rw------- | Owner read/write only' },
  { label: '700', octal: '700', desc: 'rwx------ | Owner full, no one else' },
  { label: '664', octal: '664', desc: 'rw-rw-r-- | Owner and group read/write' },
  { label: '775', octal: '775', desc: 'rwxrwxr-x | Owner and group full, others read/exec' },
  { label: '400', octal: '400', desc: 'r-------- | Read-only by owner' },
]

export default function PermissionsCalculator() {
  const [perms, setPerms] = useState<Perms>({
    owner: { read: true, write: true, execute: false },
    group: { read: true, write: false, execute: false },
    other: { read: true, write: false, execute: false },
  })
  const [octalInput, setOctalInput] = useState('644')
  const [copied, setCopied] = useState<string | null>(null)

  const setFromOctal = (val: string) => {
    setOctalInput(val)
    if (/^[0-7]{3}$/.test(val)) {
      const [o, g, t] = val.split('').map(Number)
      setPerms({ owner: octalToPerm(o), group: octalToPerm(g), other: octalToPerm(t) })
    }
  }

  const togglePerm = (entity: keyof Perms, field: keyof Perm) => {
    setPerms(prev => {
      const updated = { ...prev, [entity]: { ...prev[entity], [field]: !prev[entity][field] } }
      setOctalInput(permsToOctal(updated))
      return updated
    })
  }

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 1500)
  }

  const octal = permsToOctal(perms)
  const symbolic = permsToSymbolic(perms)

  const entities: (keyof Perms)[] = ['owner', 'group', 'other']
  const fields: (keyof Perm)[] = ['read', 'write', 'execute']

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h1 className="tool-title">Permissions Calculator</h1>
        <p className="tool-description">Unix chmod octal ↔ rwx permissions calculator</p>
      </div>

      <div className="space-y-4">
        {/* Octal input */}
        <div className="panel">
          <div className="panel-label">Octal Value</div>
          <div className="flex gap-3 items-center">
            <input
              className="input-base w-28 font-mono text-2xl text-center"
              value={octalInput}
              onChange={e => setFromOctal(e.target.value)}
              maxLength={3}
              placeholder="644"
            />
            <div className="flex gap-2 items-center">
              <code className="output-area px-4 py-2 font-mono text-lg">{symbolic}</code>
              <button onClick={() => copy(`chmod ${octal} filename`, 'cmd')} className="btn-secondary text-xs">
                {copied === 'cmd' ? 'Copied!' : 'Copy chmod'}
              </button>
            </div>
          </div>
        </div>

        {/* Permission grid */}
        <div className="panel">
          <div className="grid grid-cols-4 gap-2 mb-3">
            <div />
            {fields.map(f => (
              <div key={f} className="text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </div>
            ))}
          </div>

          {entities.map(entity => (
            <div key={entity} className="grid grid-cols-4 gap-2 mb-3">
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-300 capitalize">{entity}</span>
                <span className="ml-2 text-xs text-gray-600">{permToOctal(perms[entity])}</span>
              </div>
              {fields.map(field => (
                <div key={field} className="flex justify-center">
                  <button
                    onClick={() => togglePerm(entity, field)}
                    className={`w-12 h-12 rounded-xl text-sm font-mono font-bold transition-all ${
                      perms[entity][field]
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50'
                        : 'bg-gray-800 text-gray-600 hover:bg-gray-700'
                    }`}
                  >
                    {field === 'read' ? 'r' : field === 'write' ? 'w' : 'x'}
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Result display */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { label: 'Octal', value: octal },
            { label: 'Symbolic', value: symbolic },
            { label: 'chmod Command', value: `chmod ${octal} filename` },
          ].map(({ label, value }) => (
            <div key={label} className="panel">
              <div className="flex items-center justify-between mb-1">
                <div className="panel-label">{label}</div>
                <button onClick={() => copy(value, label)} className="copy-btn">
                  {copied === label ? <svg className="w-3.5 h-3.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  : <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>}
                </button>
              </div>
              <div className="font-mono text-sm text-gray-200">{value}</div>
            </div>
          ))}
        </div>

        {/* Presets */}
        <div className="panel">
          <div className="panel-label">Common Presets</div>
          <div className="space-y-2">
            {PRESETS.map(p => (
              <button
                key={p.octal}
                onClick={() => setFromOctal(p.octal)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                  octal === p.octal ? 'bg-indigo-600/20 border border-indigo-500/40' : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                <span className="font-mono text-indigo-400 w-8 flex-shrink-0">{p.label}</span>
                <span className="text-gray-300 flex-1">{p.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
