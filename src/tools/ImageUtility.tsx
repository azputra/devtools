import { useState, useRef } from 'react'

type OutputFormat = 'image/jpeg' | 'image/png' | 'image/webp'

export default function ImageUtility() {
  const [originalUrl, setOriginalUrl] = useState<string | null>(null)
  const [originalSize, setOriginalSize] = useState<{ w: number; h: number } | null>(null)
  const [outputUrl, setOutputUrl] = useState<string | null>(null)
  const [width, setWidth] = useState(800)
  const [height, setHeight] = useState(600)
  const [maintainAspect, setMaintainAspect] = useState(true)
  const [format, setFormat] = useState<OutputFormat>('image/jpeg')
  const [quality, setQuality] = useState(90)
  const [outputSize, setOutputSize] = useState<number | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return
    const url = URL.createObjectURL(file)
    setOriginalUrl(url)
    const img = new Image()
    img.onload = () => {
      setOriginalSize({ w: img.naturalWidth, h: img.naturalHeight })
      setWidth(img.naturalWidth)
      setHeight(img.naturalHeight)
    }
    img.src = url
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const updateWidth = (w: number) => {
    setWidth(w)
    if (maintainAspect && originalSize) {
      setHeight(Math.round(w * originalSize.h / originalSize.w))
    }
  }

  const updateHeight = (h: number) => {
    setHeight(h)
    if (maintainAspect && originalSize) {
      setWidth(Math.round(h * originalSize.w / originalSize.h))
    }
  }

  const process = () => {
    if (!originalUrl || !canvasRef.current) return
    const img = new Image()
    img.onload = () => {
      const canvas = canvasRef.current!
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, width, height)
      const dataUrl = canvas.toDataURL(format, quality / 100)
      setOutputUrl(dataUrl)
      // estimate size from base64
      const base64 = dataUrl.split(',')[1]
      setOutputSize(Math.round((base64.length * 3) / 4 / 1024))
    }
    img.src = originalUrl
  }

  const download = () => {
    if (!outputUrl) return
    const a = document.createElement('a')
    const ext = format.split('/')[1]
    a.href = outputUrl
    a.download = `output.${ext}`
    a.click()
  }

  const fmtBytes = (kb: number) => kb < 1024 ? `${kb} KB` : `${(kb / 1024).toFixed(2)} MB`

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h1 className="tool-title">Image Utility</h1>
        <p className="tool-description">Resize and convert images using the Canvas API</p>
      </div>

      <div className="space-y-4">
        {/* Drop zone */}
        <div
          className="panel border-2 border-dashed transition-colors cursor-pointer text-center py-8"
          style={{ borderColor: 'var(--border)' }}
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          onClick={() => fileRef.current?.click()}
        >
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          {originalUrl ? (
            <div className="space-y-2">
              <img src={originalUrl} alt="Preview" className="max-h-32 mx-auto rounded-lg" />
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {originalSize?.w} × {originalSize?.h}px · Click to change
              </p>
            </div>
          ) : (
            <>
              <svg className="w-10 h-10 text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p style={{ color: 'var(--text-muted)' }}>Drop an image here or click to upload</p>
              <p className="text-xs text-gray-600 mt-1">Supports JPG, PNG, WebP, GIF, BMP</p>
            </>
          )}
        </div>

        {originalUrl && (
          <>
            {/* Options */}
            <div className="panel">
              <div className="panel-label">Options</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>Width (px)</label>
                  <input
                    type="number" min={1}
                    className="input-base"
                    value={width}
                    onChange={e => updateWidth(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>Height (px)</label>
                  <input
                    type="number" min={1}
                    className="input-base"
                    value={height}
                    onChange={e => updateHeight(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>Format</label>
                  <select value={format} onChange={e => setFormat(e.target.value as OutputFormat)} className="input-base">
                    <option value="image/jpeg">JPEG</option>
                    <option value="image/png">PNG</option>
                    <option value="image/webp">WebP</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>Quality ({quality}%)</label>
                  <input
                    type="range" min={10} max={100} step={5}
                    className="w-full"
                    value={quality}
                    onChange={e => setQuality(Number(e.target.value))}
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 mt-3 text-sm cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
                <input
                  type="checkbox"
                  checked={maintainAspect}
                  onChange={e => setMaintainAspect(e.target.checked)}
                  className="rounded"
                />
                Maintain aspect ratio
              </label>
              <div className="flex gap-2 mt-4">
                <button onClick={process} className="btn-primary">Process Image</button>
                {outputUrl && (
                  <button onClick={download} className="btn-secondary flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download
                  </button>
                )}
              </div>
            </div>

            {/* Output preview */}
            {outputUrl && (
              <div className="panel">
                <div className="flex items-center justify-between mb-3">
                  <div className="panel-label">Output</div>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {width} × {height}px · {outputSize !== null ? fmtBytes(outputSize) : ''}
                  </span>
                </div>
                <img src={outputUrl} alt="Output" className="max-w-full max-h-64 mx-auto rounded-lg" style={{ border: '1px solid var(--border)' }} />
              </div>
            )}
          </>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
