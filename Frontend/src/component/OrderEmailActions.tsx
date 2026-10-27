import { useState } from 'react';
import { api } from '../lib/api';

const fields: Record<string, Array<[string, string]>> = {
  OrderShipped: [['carrier', 'Carrier'], ['trackingNumber', 'Tracking number'], ['trackingUrl', 'Tracking URL (HTTPS)'], ['estimatedDelivery', 'Estimated delivery']],
  OutForDelivery: [['carrier', 'Carrier'], ['trackingNumber', 'Tracking number'], ['trackingUrl', 'Tracking URL (HTTPS)']],
  OrderDelivered: [], OrderCancelled: [['reason', 'Reason']],
  RefundIssued: [['refundAmount', 'Refund amount (USD)']],
  PaymentFailed: [], OrderOnHold: [], OrderConfirmation: [],
  ReturnReceived: [['returnNumber', 'Return number'], ['carrier', 'Return carrier'], ['returnLabelUrl', 'Return label URL (HTTPS)']],
  CustomerNote: [['note', 'Message to customer']],
};
const labels: Record<string, string> = {
  OrderShipped: 'Dispatched with tracking', OutForDelivery: 'Out for delivery', OrderDelivered: 'Delivered',
  OrderCancelled: 'Cancelled', RefundIssued: 'Refund issued', PaymentFailed: 'Payment failed',
  OrderOnHold: 'Awaiting payment', OrderConfirmation: 'Payment received', ReturnReceived: 'Return approved', CustomerNote: 'Customer note',
};

export default function OrderEmailActions({ orderId, onRecorded, initialEvent = 'OrderShipped' }: { orderId: number; onRecorded: () => void; initialEvent?: string }) {
  const [event, setEvent] = useState(initialEvent);
  const [details, setDetails] = useState<Record<string, string>>({});
  const [reference, setReference] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function send() {
    if (!confirmed || !reference.trim() || fields[event].some(([key]) => !details[key]?.trim())) {
      setError('Complete the event details and reference, then confirm this event occurred.'); return;
    }
    setBusy(true); setError(''); setMessage('');
    try {
      const result = await api<{ message: string }>(`/admin/orders/${orderId}/events`, {
        method: 'POST', body: JSON.stringify({ event, reference, details }),
      });
      setMessage(result.message); setConfirmed(false); onRecorded();
    } catch (e) { setError(e instanceof Error ? e.message : 'Unable to record event.'); }
    finally { setBusy(false); }
  }
  return <section className="mt-8 border-t pt-6">
    <h3 className="font-semibold text-slate-800">Customer email & order event</h3>
    <p className="mt-2 text-xs leading-5 text-slate-500">Record confirmed store or carrier updates. Recording payment or refund events sends a notification; it does not charge a card or move money.</p>
    <label className="mt-4 block text-sm">Event<select value={event} onChange={e => { setEvent(e.target.value); setDetails({}); setConfirmed(false); setMessage(''); }} className="mt-2 w-full rounded-lg border p-3">{Object.entries(labels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label>
    <label className="mt-4 block text-sm">Event reference<input required maxLength={100} placeholder="Payment, refund, carrier or staff reference" value={reference} onChange={e => setReference(e.target.value)} className="mt-2 w-full rounded-lg border p-3" /></label>
    {fields[event].map(([key, label]) => <label key={key} className="mt-4 block text-sm">{label}
      <input required value={details[key] || ''} onChange={e => setDetails(current => ({ ...current, [key]: e.target.value }))} type={key.endsWith('Url') ? 'url' : key === 'refundAmount' ? 'number' : 'text'} min={key === 'refundAmount' ? '0.01' : undefined} step={key === 'refundAmount' ? '0.01' : undefined} className="mt-2 w-full rounded-lg border p-3" />
    </label>)}
    <label className="mt-4 flex items-start gap-2 text-sm"><input type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)} className="mt-1" />I confirm this event occurred and the details are correct.</label>
    {message && <p role="status" className="mt-3 text-sm text-emerald-700">{message}</p>}
    {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
    <button type="button" disabled={busy || !confirmed} onClick={send} className="mt-4 rounded-lg bg-blue-700 px-4 py-3 text-sm text-white disabled:opacity-50">{busy ? 'Recording…' : 'Record event & notify customer'}</button>
  </section>;
}
