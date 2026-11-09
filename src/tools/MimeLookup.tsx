import { useState } from 'react'

const MIME_DB: Record<string, string[]> = {
  'application/json': ['.json'],
  'application/xml': ['.xml'],
  'application/pdf': ['.pdf'],
  'application/zip': ['.zip'],
  'application/gzip': ['.gz', '.gzip'],
  'application/x-tar': ['.tar'],
  'application/x-rar-compressed': ['.rar'],
  'application/x-7z-compressed': ['.7z'],
  'application/octet-stream': ['.bin', '.exe', '.dll'],
  'application/javascript': ['.js', '.mjs'],
  'application/typescript': ['.ts'],
  'application/wasm': ['.wasm'],
  'application/sql': ['.sql'],
  'application/graphql': ['.graphql', '.gql'],
  'application/x-www-form-urlencoded': [],
  'application/vnd.ms-excel': ['.xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'application/vnd.ms-powerpoint': ['.ppt'],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'text/html': ['.html', '.htm'],
  'text/css': ['.css'],
  'text/plain': ['.txt', '.text', '.log'],
  'text/csv': ['.csv'],
  'text/markdown': ['.md', '.markdown'],
  'text/javascript': ['.js'],
  'text/xml': ['.xml'],
  'text/yaml': ['.yaml', '.yml'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/gif': ['.gif'],
  'image/webp': ['.webp'],
  'image/svg+xml': ['.svg'],
  'image/ico': ['.ico'],
  'image/bmp': ['.bmp'],
  'image/tiff': ['.tiff', '.tif'],
  'image/avif': ['.avif'],
  'image/heic': ['.heic'],
  'audio/mpeg': ['.mp3'],
  'audio/ogg': ['.ogg'],
  'audio/wav': ['.wav'],
  'audio/webm': ['.weba'],
  'audio/flac': ['.flac'],
  'audio/aac': ['.aac'],
  'video/mp4': ['.mp4'],
  'video/webm': ['.webm'],
  'video/ogg': ['.ogv'],
  'video/quicktime': ['.mov'],
  'video/x-msvideo': ['.avi'],
  'video/x-matroska': ['.mkv'],
  'font/woff': ['.woff'],
  'font/woff2': ['.woff2'],
  'font/ttf': ['.ttf'],
  'font/otf': ['.otf'],
  'multipart/form-data': [],
}

// Build reverse index: ext -> mime
const EXT_TO_MIME: Record<string, string> = {}
Object.entries(MIME_DB).forEach(([mime, exts]) => {
  exts.forEach(ext => { EXT_TO_MIME[ext] = mime })
})

function getCategoryColor(mime: string) {
  if (mime.startsWith('image/')) return 'text-pink-400 bg-pink-500/10'
  if (mime.startsWith('video/')) return 'text-red-400 bg-red-500/10'
  if (mime.startsWith('audio/')) return 'text-purple-400 bg-purple-500/10'
  if (mime.startsWith('text/')) return 'text-green-400 bg-green-500/10'
  if (mime.startsWith('font/')) return 'text-yellow-400 bg-yellow-500/10'
  if (mime.startsWith('application/')) return 'text-blue-400 bg-blue-500/10'
  return 'text-gray-400 bg-gray-500/10'
}

export default function MimeLookup() {
  const [search, setSearch] = useState('')
  const [copied, setCopied] = useState<string | null>(null)

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 1500)
  }

  const q = search.toLowerCase().trim()
  const results = !q ? Object.entries(MIME_DB).slice(0, 30) : Object.entries(MIME_DB).filter(([mime, exts]) =>
    mime.includes(q) || exts.some(e => e.includes(q))
  )

  // If search looks like an extension, also check reverse
  const extMatch = q.startsWith('.') ? EXT_TO_MIME[q] : q ? EXT_TO_MIME['.' + q] : null

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h1 className="tool-title">MIME Lookup</h1>
        <p className="tool-description">Look up MIME types by file extension and vice versa</p>
      </div>

      <div className="space-y-4">
        <div className="panel">
          <input
            className="input-base"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by MIME type or file extension (e.g. .json, image/png)..."
            autoFocus
          />
        </div>

        {extMatch && (
          <div className="panel border border-indigo-500/30 bg-indigo-500/5">
            <div className="text-xs text-indigo-400 mb-1">Extension match</div>
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-white">{q.startsWith('.') ? q : '.' + q}</span>
                <span className="text-gray-500 mx-3">→</span>
                <span className="font-mono text-indigo-300">{extMatch}</span>
              </div>
              <button onClick={() => copy(extMatch, 'ext')} className="copy-btn">
                {copied === 'ext' ? <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>}
              </button>
            </div>
          </div>
        )}

        <div className="space-y-1.5">
          {results.map(([mime, exts]) => (
            <div key={mime} className="panel group">
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-0.5 rounded font-medium flex-shrink-0 ${getCategoryColor(mime)}`}>
                  {mime.split('/')[0]}
                </span>
                <span className="font-mono text-sm text-gray-200 flex-1">{mime}</span>
                <div className="flex gap-1.5 flex-wrap">
                  {exts.map(ext => (
                    <span key={ext} className="text-xs bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded font-mono">{ext}</span>
                  ))}
                </div>
                <button onClick={() => copy(mime, mime)} className="copy-btn opacity-0 group-hover:opacity-100 transition-opacity">
                  {copied === mime ? <svg className="w-3.5 h-3.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  : <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>}
                </button>
              </div>
            </div>
          ))}
        </div>

        {results.length === 0 && (
          <div className="text-center py-12 text-gray-600">No MIME types found</div>
        )}
      </div>
    </div>
  )
}
