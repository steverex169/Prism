import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import OrderEmailActions from './OrderEmailActions';

interface PaymentOrder { id: number; order_number: string; customer_name: string; customer_email: string; total: number; payment: string; payment_method: string; status: string }

export default function PaymentQueue({ failed = false }: { failed?: boolean }) {
  const [orders, setOrders] = useState<PaymentOrder[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    setError('');
    try { setOrders(await api<PaymentOrder[]>('/orders/')); }
    catch (e) { setError(e instanceof Error ? e.message : 'Unable to load orders.'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { const timer = window.setTimeout(load, 0); return () => window.clearTimeout(timer); }, [load]);
  const visible = orders.filter(order => failed
    ? ['failed', 'declined'].includes(order.payment.toLowerCase()) || order.status.toLowerCase() === 'failed'
    : ['unpaid', 'pending'].includes(order.payment.toLowerCase()) && !['cancelled', 'canceled'].includes(order.status.toLowerCase()));
  return <section className="rounded-xl bg-white p-6 shadow-sm">
    <div className="flex items-center justify-between gap-4"><h1 className="text-2xl font-semibold text-slate-800">{failed ? 'Failed payments' : 'Payment review'}</h1><button className="rounded-lg border px-4 py-2 text-sm" onClick={load}>Refresh</button></div>
    <p className="mt-3 text-sm text-slate-600">{failed ? 'Orders with a recorded payment failure.' : 'Unpaid orders awaiting external payment confirmation.'} Verify the payment with your provider before recording a received payment.</p>
    {loading && <p role="status" className="mt-5">Loading orders…</p>}
    {error && <p role="alert" className="mt-5 text-red-700">{error}</p>}
    <div className="mt-6 space-y-4">{visible.map(order => <article className="rounded-lg border border-slate-200 p-5" key={order.id}>
      <div className="flex flex-wrap justify-between gap-3"><div><h2 className="font-semibold">{order.order_number}</h2><p className="mt-1 text-sm text-slate-600">{order.customer_name} · {order.customer_email}</p></div><div className="text-right"><p className="font-semibold">${order.total.toFixed(2)}</p><p className="mt-1 text-sm text-slate-500">{order.payment_method} · {order.payment}</p></div></div>
      <button onClick={() => setSelected(current => current === order.id ? null : order.id)} className="mt-4 text-sm text-blue-700 underline">{selected === order.id ? 'Close event controls' : 'Record payment update'}</button>
      {selected === order.id && <OrderEmailActions key={order.id} orderId={order.id} initialEvent="OrderConfirmation" onRecorded={load} />}
    </article>)}</div>
    {!loading && !visible.length && <p className="mt-6 text-sm text-slate-500">No {failed ? 'failed payments' : 'payments awaiting review'}.</p>}
    <Link to="/admin/orders" className="mt-6 inline-block text-sm text-blue-700 underline">View all orders</Link>
  </section>;
}
