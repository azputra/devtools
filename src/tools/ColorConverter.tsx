import { useState, useCallback } from 'react'

function hexToRgb(hex: string): [number, number, number] | null {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h
  if (full.length !== 6) return null
  const n = parseInt(full, 16)
  if (isNaN(n)) return null
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(c => c.toString(16).padStart(2, '0')).join('')
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const rn = r / 255, gn = g / 255, bn = b / 255
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn)
  let h = 0, s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case rn: h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6; break
      case gn: h = ((bn - rn) / d + 2) / 6; break
      case bn: h = ((rn - gn) / d + 4) / 6; break
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const hn = h / 360, sn = s / 100, ln = l / 100
  if (sn === 0) {
    const v = Math.round(ln * 255)
    return [v, v, v]
  }
  const q = ln < 0.5 ? ln * (1 + sn) : ln + sn - ln * sn
  const p = 2 * ln - q
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
    return p
  }
  return [
    Math.round(hue2rgb(p, q, hn + 1 / 3) * 255),
    Math.round(hue2rgb(p, q, hn) * 255),
    Math.round(hue2rgb(p, q, hn - 1 / 3) * 255),
  ]
}

function luminance(r: number, g: number, b: number): number {
  const toLinear = (c: number) => {
    const cn = c / 255
    return cn <= 0.03928 ? cn / 12.92 : Math.pow((cn + 0.055) / 1.055, 2.4)
  }
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
}

function contrastRatio(r1: number, g1: number, b1: number, r2: number, g2: number, b2: number): number {
  const l1 = luminance(r1, g1, b1)
  const l2 = luminance(r2, g2, b2)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

export default function ColorConverter() {
  const [hex, setHex] = useState('#6366f1')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState<string | null>(null)

  const rgb = hexToRgb(hex)
  const hsl = rgb ? rgbToHsl(...rgb) : null

  const updateFromHex = useCallback((val: string) => {
    setHex(val)
    setError(hexToRgb(val) ? '' : 'Invalid hex color')
  }, [])

  const updateFromRgb = (idx: 0 | 1 | 2, val: string) => {
    const n = parseInt(val)
    if (isNaN(n) || !rgb) return
    const newRgb: [number, number, number] = [...rgb] as [number, number, number]
    newRgb[idx] = Math.max(0, Math.min(255, n))
    setHex(rgbToHex(...newRgb))
  }

  const updateFromHsl = (idx: 0 | 1 | 2, val: string) => {
    const n = parseInt(val)
    if (isNaN(n) || !hsl) return
    const newHsl: [number, number, number] = [...hsl] as [number, number, number]
    const max = idx === 0 ? 360 : 100
    newHsl[idx] = Math.max(0, Math.min(max, n))
    setHex(rgbToHex(...hslToRgb(...newHsl)))
  }

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 1500)
  }

  // Contrast with white and black
  const contrastWhite = rgb ? contrastRatio(...rgb, 255, 255, 255) : 0
  const contrastBlack = rgb ? contrastRatio(...rgb, 0, 0, 0) : 0
  const getWcag = (ratio: number) => ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : ratio >= 3 ? 'AA Large' : 'Fail'

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h1 className="tool-title">Color Converter</h1>
        <p className="tool-description">Convert between HEX, RGB, HSL and check contrast ratio</p>
      </div>

      <div className="space-y-4">
        {/* Swatch + hex input */}
        <div className="panel">
          <div className="flex items-center gap-4">
            <div
              className="w-20 h-20 rounded-xl flex-shrink-0"
              style={{ border: '1px solid var(--border)', backgroundColor: hex }}
            />
            <div className="flex-1">
              <div className="panel-label">HEX</div>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={rgb ? hex : '#000000'}
                  onChange={e => updateFromHex(e.target.value)}
                  className="w-10 h-10 rounded-lg border-0 bg-transparent cursor-pointer"
                />
                <input
                  className="input-base font-mono uppercase"
                  value={hex}
                  onChange={e => updateFromHex(e.target.value)}
                  placeholder="#rrggbb"
                  maxLength={7}
                />
                <button onClick={() => copy(hex, 'hex')} className="copy-btn">
                  {copied === 'hex' ? <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>}
                </button>
              </div>
              {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
            </div>
          </div>
        </div>

        {rgb && hsl && (
          <>
            {/* RGB */}
            <div className="panel">
              <div className="flex items-center justify-between mb-3">
                <div className="panel-label">RGB</div>
                <button onClick={() => copy(`rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`, 'rgb')} className="copy-btn">
                  {copied === 'rgb' ? <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>}
                </button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {(['R', 'G', 'B'] as const).map((ch, i) => (
                  <div key={ch}>
                    <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>{ch} (0–255)</label>
                    <input
                      type="number" min={0} max={255}
                      className="input-base"
                      value={rgb[i as 0|1|2]}
                      onChange={e => updateFromRgb(i as 0|1|2, e.target.value)}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-2 output-area text-xs">{`rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`}</div>
            </div>

            {/* HSL */}
            <div className="panel">
              <div className="flex items-center justify-between mb-3">
                <div className="panel-label">HSL</div>
                <button onClick={() => copy(`hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`, 'hsl')} className="copy-btn">
                  {copied === 'hsl' ? <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>}
                </button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[['H', 360], ['S', 100], ['L', 100]].map(([ch, max], i) => (
                  <div key={ch}>
                    <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>{ch} (0–{max})</label>
                    <input
                      type="number" min={0} max={max}
                      className="input-base"
                      value={hsl[i as 0|1|2]}
                      onChange={e => updateFromHsl(i as 0|1|2, e.target.value)}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-2 output-area text-xs">{`hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`}</div>
            </div>

            {/* Contrast */}
            <div className="panel">
              <div className="panel-label">Contrast Ratio (WCAG)</div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { bg: '#ffffff', label: 'vs White', contrast: contrastWhite },
                  { bg: '#000000', label: 'vs Black', contrast: contrastBlack },
                ].map(({ bg, label, contrast }) => (
                  <div key={label} className="rounded-xl p-4" style={{ background: 'var(--bg-elevated)' }}>
                    <div
                      className="rounded-lg p-3 mb-3 text-center text-sm font-medium"
                      style={{ backgroundColor: bg, color: hex }}
                    >
                      Sample Text
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{contrast.toFixed(2)}:1</div>
                      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</div>
                      <div className={`mt-1 text-xs font-medium ${
                        getWcag(contrast) === 'Fail' ? 'text-red-400' :
                        getWcag(contrast) === 'AA Large' ? 'text-yellow-400' :
                        'text-green-400'
                      }`}>{getWcag(contrast)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
