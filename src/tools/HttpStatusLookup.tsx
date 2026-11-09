import { useState } from 'react'

const STATUS_CODES: { code: number; text: string; desc: string; category: string }[] = [
  // 1xx
  { code: 100, text: 'Continue', desc: 'The server received the request headers and the client should proceed to send the request body.', category: '1xx Informational' },
  { code: 101, text: 'Switching Protocols', desc: 'The requester has asked the server to switch protocols and the server has agreed to do so.', category: '1xx Informational' },
  { code: 102, text: 'Processing', desc: 'A WebDAV request may contain many sub-requests involving file operations.', category: '1xx Informational' },
  // 2xx
  { code: 200, text: 'OK', desc: 'The request has succeeded.', category: '2xx Success' },
  { code: 201, text: 'Created', desc: 'The request has been fulfilled and resulted in a new resource being created.', category: '2xx Success' },
  { code: 202, text: 'Accepted', desc: 'The request has been accepted for processing, but the processing has not been completed.', category: '2xx Success' },
  { code: 204, text: 'No Content', desc: 'The server successfully processed the request, but is not returning any content.', category: '2xx Success' },
  { code: 206, text: 'Partial Content', desc: 'The server is delivering only part of the resource due to a range header.', category: '2xx Success' },
  // 3xx
  { code: 301, text: 'Moved Permanently', desc: 'This and all future requests should be directed to the given URI.', category: '3xx Redirection' },
  { code: 302, text: 'Found', desc: 'The resource has been temporarily moved to another URI.', category: '3xx Redirection' },
  { code: 303, text: 'See Other', desc: 'The response can be found under a different URI using the GET method.', category: '3xx Redirection' },
  { code: 304, text: 'Not Modified', desc: 'The resource has not been modified since the last request.', category: '3xx Redirection' },
  { code: 307, text: 'Temporary Redirect', desc: 'The request should be repeated with another URI but future requests should still use the original URI.', category: '3xx Redirection' },
  { code: 308, text: 'Permanent Redirect', desc: 'The request and all future requests should be repeated using another URI.', category: '3xx Redirection' },
  // 4xx
  { code: 400, text: 'Bad Request', desc: 'The server cannot or will not process the request due to an apparent client error.', category: '4xx Client Error' },
  { code: 401, text: 'Unauthorized', desc: 'Authentication is required and has failed or has not been provided.', category: '4xx Client Error' },
  { code: 403, text: 'Forbidden', desc: 'The client does not have access rights to the content.', category: '4xx Client Error' },
  { code: 404, text: 'Not Found', desc: 'The requested resource could not be found.', category: '4xx Client Error' },
  { code: 405, text: 'Method Not Allowed', desc: 'The method specified in the Request-Line is not allowed.', category: '4xx Client Error' },
  { code: 408, text: 'Request Timeout', desc: 'The server timed out waiting for the request.', category: '4xx Client Error' },
  { code: 409, text: 'Conflict', desc: 'The request conflicts with the current state of the server.', category: '4xx Client Error' },
  { code: 410, text: 'Gone', desc: 'The resource requested is no longer available and will not be available again.', category: '4xx Client Error' },
  { code: 411, text: 'Length Required', desc: 'The request did not specify the length of its content.', category: '4xx Client Error' },
  { code: 413, text: 'Payload Too Large', desc: 'The request is larger than the server is willing or able to process.', category: '4xx Client Error' },
  { code: 414, text: 'URI Too Long', desc: 'The URI provided was too long for the server to process.', category: '4xx Client Error' },
  { code: 415, text: 'Unsupported Media Type', desc: 'The request entity has a media type which the server does not support.', category: '4xx Client Error' },
  { code: 422, text: 'Unprocessable Entity', desc: 'The request was well-formed but was unable to be followed due to semantic errors.', category: '4xx Client Error' },
  { code: 429, text: 'Too Many Requests', desc: 'The user has sent too many requests in a given amount of time (rate limiting).', category: '4xx Client Error' },
  // 5xx
  { code: 500, text: 'Internal Server Error', desc: 'An unexpected condition was encountered by the server.', category: '5xx Server Error' },
  { code: 501, text: 'Not Implemented', desc: 'The server either does not recognize the request method, or lacks the ability to fulfil it.', category: '5xx Server Error' },
  { code: 502, text: 'Bad Gateway', desc: 'The server was acting as a gateway and received an invalid response from the upstream server.', category: '5xx Server Error' },
  { code: 503, text: 'Service Unavailable', desc: 'The server cannot handle the request (because it is overloaded or down for maintenance).', category: '5xx Server Error' },
  { code: 504, text: 'Gateway Timeout', desc: 'The server was acting as a gateway and did not receive a timely response from the upstream server.', category: '5xx Server Error' },
  { code: 505, text: 'HTTP Version Not Supported', desc: 'The server does not support the HTTP version used in the request.', category: '5xx Server Error' },
]

function getCategoryColor(cat: string) {
  if (cat.startsWith('1xx')) return 'text-slate-400'
  if (cat.startsWith('2xx')) return 'text-green-500'
  if (cat.startsWith('3xx')) return 'text-blue-500'
  if (cat.startsWith('4xx')) return 'text-orange-500'
  return 'text-red-500'
}

export default function HttpStatusLookup() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const categories = ['All', ...Array.from(new Set(STATUS_CODES.map(s => s.category)))]

  const filtered = STATUS_CODES.filter(s => {
    const q = search.toLowerCase()
    const matchSearch = !q || String(s.code).includes(q) || s.text.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q)
    const matchCat = activeCategory === 'All' || s.category === activeCategory
    return matchSearch && matchCat
  })

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h1 className="tool-title">HTTP Status Lookup</h1>
        <p className="tool-description">Search and browse HTTP status codes with descriptions</p>
      </div>

      <div className="space-y-4">
        <div className="panel">
          <input
            className="input-base"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by code, name or description..."
            autoFocus
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: activeCategory === cat ? 'var(--accent)' : 'var(--bg-elevated)',
                color: activeCategory === cat ? 'white' : 'var(--text-secondary)',
                border: `1px solid ${activeCategory === cat ? 'var(--accent)' : 'var(--border)'}`,
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {filtered.map(s => (
            <div key={s.code} className="panel">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <span className={`text-2xl font-bold font-mono ${getCategoryColor(s.category)}`}>{s.code}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{s.text}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getCategoryColor(s.category)}`} style={{ background: 'var(--bg-elevated)' }}>{s.category}</span>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{s.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-600">No status codes found</div>
        )}
      </div>
    </div>
  )
}
