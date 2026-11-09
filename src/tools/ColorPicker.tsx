import { useState } from 'react'

const PRESETS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4',
  '#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#14b8a6',
  '#6366f1', '#a855f7', '#10b981', '#0ea5e9', '#f59e0b',
  '#84cc16', '#06b6d4', '#f43f5e', '#8b5cf6', '#6366f1',
]

interface PaletteColor { hex: string; label: string }

export default function ColorPicker() {
  const [current, setCurrent] = useState('#6366f1')
  const [palette, setPalette] = useState<PaletteColor[]>([
    { hex: '#6366f1', label: 'Primary' },
    { hex: '#8b5cf6', label: 'Secondary' },
  ])
  const [copied, setCopied] = useState<string | null>(null)
  const [editLabel, setEditLabel] = useState<number | null>(null)

  const addToPalette = () => {
    setPalette(p => [...p, { hex: current, label: `Color ${p.length + 1}` }])
  }

  const removeFromPalette = (i: number) => {
    setPalette(p => p.filter((_, idx) => idx !== i))
  }

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 1500)
  }

  const exportPalette = () => {
    const css = palette.map(c => `  --color-${c.label.toLowerCase().replace(/\s+/g, '-')}: ${c.hex};`).join('\n')
    copy(`:root {\n${css}\n}`, 'export')
  }

  const generateShades = (hex: string) => {
    // simple lightness steps
    const shades: string[] = []
    for (let l = 90; l >= 10; l -= 10) {
      const r = parseInt(hex.slice(1, 3), 16)
      const g = parseInt(hex.slice(3, 5), 16)
      const b = parseInt(hex.slice(5, 7), 16)
      // adjust toward white or black based on target lightness
      const factor = l / 50 - 1
      const mix = (c: number) => Math.min(255, Math.max(0, Math.round(factor > 0 ? c + (255 - c) * factor : c * (1 + factor))))
      shades.push(`#${[mix(r), mix(g), mix(b)].map(c => c.toString(16).padStart(2, '0')).join('')}`)
    }
    return shades
  }

  const shades = generateShades(current)

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h1 className="tool-title">Color Picker</h1>
        <p className="tool-description">Visual color picker with palette builder and shade generator</p>
      </div>

      <div className="space-y-4">
        {/* Main picker */}
        <div className="panel">
          <div className="flex items-center gap-6">
            <div
              className="w-24 h-24 rounded-xl border border-gray-700 flex-shrink-0"
              style={{ backgroundColor: current }}
            />
            <div className="flex-1">
              <div className="panel-label">Pick Color</div>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={current}
                  onChange={e => setCurrent(e.target.value)}
                  className="w-12 h-12 rounded-lg border-0 bg-transparent cursor-pointer"
                />
                <input
                  className="input-base font-mono uppercase flex-1"
                  value={current}
                  onChange={e => {
                    const v = e.target.value
                    if (/^#[0-9a-fA-F]{0,6}$/.test(v)) setCurrent(v)
                  }}
                  maxLength={7}
                />
                <button onClick={() => copy(current, 'current')} className="copy-btn">
                  {copied === 'current' ? <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>}
                </button>
                <button onClick={addToPalette} className="btn-primary text-xs">Add to Palette</button>
              </div>
            </div>
          </div>
        </div>

        {/* Presets */}
        <div className="panel">
          <div className="panel-label">Presets</div>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map(color => (
              <button
                key={color}
                onClick={() => setCurrent(color)}
                className={`w-8 h-8 rounded-lg border-2 transition-transform hover:scale-110 ${current === color ? 'border-white' : 'border-transparent'}`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>

        {/* Shades */}
        <div className="panel">
          <div className="panel-label">Shades</div>
          <div className="flex gap-1.5">
            {shades.map((shade, i) => (
              <div key={i} className="flex-1 group relative">
                <button
                  onClick={() => setCurrent(shade)}
                  className="w-full h-10 rounded-lg border border-gray-700 hover:border-white transition-colors"
                  style={{ backgroundColor: shade }}
                  title={shade}
                />
                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-gray-600 font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  {(9 - i) * 100}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Palette */}
        <div className="panel">
          <div className="flex items-center justify-between mb-3">
            <div className="panel-label">Palette ({palette.length} colors)</div>
            <button onClick={exportPalette} className="btn-ghost text-xs flex items-center gap-1">
              {copied === 'export' ? 'Copied CSS!' : 'Export as CSS vars'}
            </button>
          </div>
          {palette.length === 0 ? (
            <p className="text-gray-600 text-sm text-center py-4">Add colors to build your palette</p>
          ) : (
            <div className="space-y-2">
              {palette.map((c, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg border border-gray-700 flex-shrink-0 cursor-pointer hover:border-white transition-colors" style={{ backgroundColor: c.hex }} onClick={() => setCurrent(c.hex)} />
                  {editLabel === i ? (
                    <input
                      autoFocus
                      className="input-base flex-1 text-xs"
                      value={c.label}
                      onChange={e => setPalette(p => p.map((item, idx) => idx === i ? { ...item, label: e.target.value } : item))}
                      onBlur={() => setEditLabel(null)}
                      onKeyDown={e => e.key === 'Enter' && setEditLabel(null)}
                    />
                  ) : (
                    <span className="text-sm text-gray-300 flex-1 cursor-pointer hover:text-white" onClick={() => setEditLabel(i)}>{c.label}</span>
                  )}
                  <span className="font-mono text-xs text-gray-500">{c.hex}</span>
                  <button onClick={() => copy(c.hex, `pal-${i}`)} className="copy-btn">
                    {copied === `pal-${i}` ? <svg className="w-3.5 h-3.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    : <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>}
                  </button>
                  <button onClick={() => removeFromPalette(i)} className="copy-btn text-red-500">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
