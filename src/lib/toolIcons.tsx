import React from 'react'

const s = (d: string) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)

const m = (...paths: string[]) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    {paths.map((d, i) => <path key={i} d={d} />)}
  </svg>
)

export const toolIcons: Record<string, React.ReactElement> = {
  '/tools/base64': m('M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z', 'M14 2v6h6', 'M10 13l-2 2 2 2', 'M14 13l2 2-2 2'),
  '/tools/text-escape': m('M10 20l4-16', 'M6.228 6.228A10 10 0 003 12c0 2.598.99 4.964 2.618 6.741', 'M17.772 17.772A10 10 0 0021 12a10 10 0 00-2.618-6.741'),
  '/tools/case-converter': s('M6 10h12M6 14h12M9 10V6a3 3 0 016 0v4M9 14v4a3 3 0 006 0v-4'),
  '/tools/text-diff': m('M9 7h6', 'M9 12h6', 'M9 17h4', 'M5 3H3a2 2 0 00-2 2v14a2 2 0 002 2h2', 'M19 3h2a2 2 0 012 2v14a2 2 0 01-2 2h-2'),
  '/tools/markdown': m('M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z', 'M14 2v6h6', 'M8 13v4', 'M12 13v4', 'M8 15h4', 'M16 13l-2 2 2 2'),
  '/tools/json-formatter': m('M5 3a2 2 0 00-2 2', 'M19 3a2 2 0 012 2', 'M21 19a2 2 0 01-2 2', 'M5 21a2 2 0 01-2-2', 'M9 3h1M14 3h1', 'M9 21h6', 'M3 9v1M3 14v1', 'M21 9v6'),
  '/tools/jsonpath': m('M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z', 'M9 10h.01M12 10h.01M15 10h.01'),
  '/tools/csv-json': m('M3 10h18M3 6h18M3 14h18M3 18h18', 'M7 6v12', 'M12 6v12', 'M17 6v12'),
  '/tools/sql': m('M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z', 'M12 12h.01', 'M8 12h.01', 'M16 12h.01'),
  '/tools/url-builder': m('M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.1', 'M10.172 13.828a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.102-1.1'),
  '/tools/http-headers': m('M5 12h14', 'M12 5v14', 'M5 5l14 14', 'M19 5L5 19'),
  '/tools/api-request': m('M6 12l14-9-9 14-2.5-5L6 12z'),
  '/tools/http-status': m('M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'),
  '/tools/mime': m('M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z', 'M14 2v6h6', 'M8 13h8', 'M8 17h5'),
  '/tools/hash': m('M4 8h16', 'M4 16h16', 'M9 3v18', 'M15 3v18'),
  '/tools/jwt': m('M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'),
  '/tools/uuid': m('M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4'),
  '/tools/fixture': m('M4 6h16M4 10h16M4 14h8M4 18h8'),
  '/tools/regex': m('M4.5 12.75l6 6 9-13.5'),
  '/tools/cron': m('M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'),
  '/tools/epoch': m('M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'),
  '/tools/color-converter': m('M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01'),
  '/tools/color-picker': m('M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z'),
  '/tools/image': m('M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'),
  '/tools/screenshot-framer': m('M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'),
  '/tools/permissions': m('M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'),
  '/tools/invoice': m('M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01'),
}

export const categoryColors: Record<string, { text: string; bg: string; dot: string }> = {
  'Text & Encoding': { text: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', dot: '#8b5cf6' },
  'Data & Formats':  { text: '#3b82f6', bg: 'rgba(59,130,246,0.1)', dot: '#3b82f6' },
  'Network & Web':   { text: '#06b6d4', bg: 'rgba(6,182,212,0.1)',  dot: '#06b6d4' },
  'Security & Crypto': { text: '#10b981', bg: 'rgba(16,185,129,0.1)', dot: '#10b981' },
  'Generators':      { text: '#f59e0b', bg: 'rgba(245,158,11,0.1)', dot: '#f59e0b' },
  'Date & Time':     { text: '#f97316', bg: 'rgba(249,115,22,0.1)', dot: '#f97316' },
  'Colors & Design': { text: '#ec4899', bg: 'rgba(236,72,153,0.1)', dot: '#ec4899' },
  'Media & Files':   { text: '#ef4444', bg: 'rgba(239,68,68,0.1)',  dot: '#ef4444' },
  'Dev Utilities':   { text: '#6366f1', bg: 'rgba(99,102,241,0.1)', dot: '#6366f1' },
}
