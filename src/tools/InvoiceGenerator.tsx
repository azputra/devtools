import { useState } from 'react'

interface LineItem { description: string; qty: number; rate: number }

export default function InvoiceGenerator() {
  const [from, setFrom] = useState('Acme Dev Studio\n123 Developer Lane\nSan Francisco, CA 94105\ndev@acme.io')
  const [to, setTo] = useState('Client Corp\n456 Business Ave\nNew York, NY 10001\nbilling@client.com')
  const [invoiceNo, setInvoiceNo] = useState('INV-001')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [dueDate, setDueDate] = useState('')
  const [items, setItems] = useState<LineItem[]>([
    { description: 'Web Development', qty: 40, rate: 150 },
    { description: 'UI Design', qty: 20, rate: 100 },
  ])
  const [taxRate, setTaxRate] = useState(0)
  const [notes, setNotes] = useState('Payment due within 30 days. Thank you for your business!')
  const [currency, setCurrency] = useState('USD')

  const addItem = () => setItems(i => [...i, { description: '', qty: 1, rate: 0 }])
  const removeItem = (i: number) => setItems(items => items.filter((_, idx) => idx !== i))
  const updateItem = (i: number, field: keyof LineItem, val: string | number) =>
    setItems(items => items.map((item, idx) => idx === i ? { ...item, [field]: val } : item))

  const subtotal = items.reduce((sum, item) => sum + item.qty * item.rate, 0)
  const tax = subtotal * (taxRate / 100)
  const total = subtotal + tax

  const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(n)

  const print = () => window.print()

  return (
    <div className="tool-container max-w-3xl">
      <div className="tool-header flex items-center justify-between">
        <div>
          <h1 className="tool-title">Invoice Generator</h1>
          <p className="tool-description">Create professional invoices with print preview</p>
        </div>
        <button onClick={print} className="btn-primary flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print / PDF
        </button>
      </div>

      <div id="invoice-content" className="space-y-4">
        {/* Header */}
        <div className="panel">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Invoice Number</label>
              <input className="input-base" value={invoiceNo} onChange={e => setInvoiceNo(e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Date</label>
              <input type="date" className="input-base" value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Due Date</label>
              <input type="date" className="input-base" value={dueDate} onChange={e => setDueDate(e.target.value)} />
            </div>
          </div>
        </div>

        {/* From / To */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="panel">
            <div className="panel-label">From</div>
            <textarea className="textarea-base h-28" value={from} onChange={e => setFrom(e.target.value)} />
          </div>
          <div className="panel">
            <div className="panel-label">Bill To</div>
            <textarea className="textarea-base h-28" value={to} onChange={e => setTo(e.target.value)} />
          </div>
        </div>

        {/* Line items */}
        <div className="panel">
          <div className="flex items-center justify-between mb-3">
            <div className="panel-label">Line Items</div>
            <button onClick={addItem} className="btn-ghost text-xs flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Add Item
            </button>
          </div>
          <div className="space-y-2">
            <div className="grid grid-cols-12 gap-2 text-xs text-gray-500 px-1">
              <span className="col-span-6">Description</span>
              <span className="col-span-2 text-right">Qty</span>
              <span className="col-span-2 text-right">Rate</span>
              <span className="col-span-2 text-right">Total</span>
            </div>
            {items.map((item, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-center">
                <input
                  className="input-base col-span-6 text-sm"
                  value={item.description}
                  onChange={e => updateItem(i, 'description', e.target.value)}
                  placeholder="Description"
                />
                <input
                  type="number" min={0}
                  className="input-base col-span-2 text-sm text-right"
                  value={item.qty}
                  onChange={e => updateItem(i, 'qty', Number(e.target.value))}
                />
                <input
                  type="number" min={0} step={0.01}
                  className="input-base col-span-2 text-sm text-right"
                  value={item.rate}
                  onChange={e => updateItem(i, 'rate', Number(e.target.value))}
                />
                <div className="col-span-1 text-right text-sm text-gray-300 font-mono">
                  {fmt(item.qty * item.rate)}
                </div>
                <button onClick={() => removeItem(i)} className="col-span-1 copy-btn text-red-500 justify-center flex">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="panel">
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Subtotal</span>
                <span className="font-mono text-gray-200">{fmt(subtotal)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400 flex-1">Tax (%)</span>
                <input
                  type="number" min={0} max={100} step={0.5}
                  className="input-base w-20 text-sm text-right"
                  value={taxRate}
                  onChange={e => setTaxRate(Number(e.target.value))}
                />
                <span className="font-mono text-sm text-gray-200 w-24 text-right">{fmt(tax)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 flex-1">Currency</span>
                <select
                  value={currency}
                  onChange={e => setCurrency(e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded-md text-xs text-gray-300 px-2 py-1 focus:outline-none"
                >
                  {['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="border-t border-gray-700 pt-2 flex justify-between">
                <span className="font-semibold text-white">Total</span>
                <span className="font-bold text-indigo-400 font-mono text-lg">{fmt(total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="panel">
          <div className="panel-label">Notes</div>
          <textarea
            className="textarea-base h-20"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Payment terms, notes..."
          />
        </div>
      </div>

      <style>{`
        @media print {
          body { background: white !important; color: black !important; }
          .tool-header button, .btn-ghost, .btn-primary, .btn-secondary { display: none !important; }
          #invoice-content { color: black; }
          .panel { border: 1px solid #ddd !important; background: white !important; }
          input, textarea, select { border: none !important; background: transparent !important; color: black !important; padding: 0 !important; }
          .panel-label { color: #666 !important; }
        }
      `}</style>
    </div>
  )
}
