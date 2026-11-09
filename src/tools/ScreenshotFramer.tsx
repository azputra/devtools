import { useState, useRef } from 'react'

type Theme = 'dark' | 'light' | 'colorful'
type Device = 'browser' | 'macbook' | 'iphone'

const THEMES: Record<Theme, { chrome: string; dot1: string; dot2: string; dot3: string; urlbar: string; urlText: string }> = {
  dark: { chrome: '#1e1e2e', dot1: '#ff5f57', dot2: '#febc2e', dot3: '#28c840', urlbar: '#2a2a3c', urlText: '#6b7280' },
  light: { chrome: '#e8e8e8', dot1: '#ff5f57', dot2: '#febc2e', dot3: '#28c840', urlbar: '#ffffff', urlText: '#9ca3af' },
  colorful: { chrome: '#6366f1', dot1: '#f43f5e', dot2: '#fb923c', dot3: '#4ade80', urlbar: '#4338ca', urlText: '#c7d2fe' },
}

export default function ScreenshotFramer() {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [theme, setTheme] = useState<Theme>('dark')
  const [device] = useState<Device>('browser')
  const [url, setUrl] = useState('https://example.com')
  const [padding, setPadding] = useState(32)
  const [bg, setBg] = useState('#0f0f1a')
  const fileRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return
    setImageUrl(URL.createObjectURL(file))
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const download = async () => {
    if (!imageUrl || !canvasRef.current) return
    const img = new Image()
    img.onload = () => {
      const canvas = canvasRef.current!
      const t = THEMES[theme]
      const chromeH = 36
      const imgW = img.naturalWidth
      const imgH = img.naturalHeight
      const totalW = imgW + padding * 2
      const totalH = imgH + chromeH + padding * 2

      canvas.width = totalW
      canvas.height = totalH

      const ctx = canvas.getContext('2d')!

      // Background
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, totalW, totalH)

      // Browser frame
      const frameX = padding
      const frameY = padding
      const frameW = imgW
      const frameH = imgH + chromeH

      // Chrome bar
      ctx.fillStyle = t.chrome
      ctx.beginPath()
      ctx.roundRect(frameX, frameY, frameW, frameH, 8)
      ctx.fill()

      // Traffic lights
      const dotY = frameY + chromeH / 2
      const dots = [{ x: frameX + 14, color: t.dot1 }, { x: frameX + 32, color: t.dot2 }, { x: frameX + 50, color: t.dot3 }]
      dots.forEach(({ x, color }) => {
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(x, dotY, 5, 0, Math.PI * 2)
        ctx.fill()
      })

      // URL bar
      const urlBarX = frameX + 70
      const urlBarW = frameW - 90
      ctx.fillStyle = t.urlbar
      ctx.beginPath()
      ctx.roundRect(urlBarX, frameY + 7, urlBarW, 22, 4)
      ctx.fill()

      // URL text
      ctx.fillStyle = t.urlText
      ctx.font = '11px -apple-system, system-ui, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(url.slice(0, 50), urlBarX + urlBarW / 2, frameY + 22, urlBarW - 10)

      // Screenshot
      ctx.drawImage(img, frameX, frameY + chromeH, imgW, imgH)

      const a = document.createElement('a')
      a.href = canvas.toDataURL('image/png')
      a.download = 'framed-screenshot.png'
      a.click()
    }
    img.src = imageUrl
  }

  const t = THEMES[theme]
  void device

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h1 className="tool-title">Screenshot Framer</h1>
        <p className="tool-description">Wrap screenshots in a browser chrome frame for presentations</p>
      </div>

      <div className="space-y-4">
        {/* Upload */}
        <div
          className="panel border-2 border-dashed border-gray-700 hover:border-indigo-500 transition-colors cursor-pointer text-center py-8"
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          onClick={() => fileRef.current?.click()}
        >
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
          {!imageUrl ? (
            <>
              <svg className="w-10 h-10 text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-500">Drop a screenshot here or click to upload</p>
            </>
          ) : (
            <p className="text-sm text-gray-400">Screenshot loaded · Click to change</p>
          )}
        </div>

        {/* Options */}
        <div className="panel">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Theme</label>
              <select value={theme} onChange={e => setTheme(e.target.value as Theme)} className="input-base">
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="colorful">Colorful</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">URL Bar Text</label>
              <input className="input-base text-xs" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://..." />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Padding ({padding}px)</label>
              <input type="range" min={0} max={80} step={4} value={padding} onChange={e => setPadding(Number(e.target.value))} className="w-full mt-2" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Background</label>
              <div className="flex gap-2 items-center">
                <input type="color" value={bg} onChange={e => setBg(e.target.value)} className="w-10 h-10 rounded-lg border-0 bg-transparent cursor-pointer" />
                <input className="input-base text-xs flex-1 font-mono" value={bg} onChange={e => setBg(e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="panel overflow-auto">
          <div className="panel-label">Preview</div>
          <div
            className="rounded-xl inline-block"
            style={{ backgroundColor: bg, padding: `${padding}px` }}
          >
            <div className="rounded-lg overflow-hidden shadow-2xl" style={{ minWidth: '400px' }}>
              {/* Chrome bar */}
              <div className="flex items-center px-3 py-2.5 gap-2" style={{ backgroundColor: t.chrome }}>
                <div className="flex gap-1.5">
                  {[t.dot1, t.dot2, t.dot3].map((c, i) => (
                    <div key={i} className="w-3 h-3 rounded-full" style={{ backgroundColor: c }} />
                  ))}
                </div>
                <div className="flex-1 mx-2 rounded px-3 py-1 text-xs text-center" style={{ backgroundColor: t.urlbar, color: t.urlText }}>
                  {url.slice(0, 60)}
                </div>
              </div>
              {/* Screenshot */}
              {imageUrl ? (
                <img src={imageUrl} alt="Screenshot" className="w-full block" />
              ) : (
                <div className="w-full h-40 bg-gray-800 flex items-center justify-center">
                  <span className="text-gray-600 text-sm">Upload a screenshot to preview</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {imageUrl && (
          <button onClick={download} className="btn-primary flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Framed Screenshot
          </button>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
