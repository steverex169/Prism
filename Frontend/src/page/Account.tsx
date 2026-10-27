import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { api, ApiError } from '../lib/api';

interface Customer { full_name: string; email: string }
interface CustomerOrder { id: number; order_number: string; payment: string; status: string; total: number; details: { carrier?: string; trackingNumber?: string; trackingUrl?: string } }

export default function Account() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [user, setUser] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [email, setEmail] = useState('');
  const [reviewOrder, setReviewOrder] = useState<number | null>(() => Number(params.get('review')) || null);
  const [rating, setRating] = useState(() => ['1', '2', '3', '4', '5'].includes(params.get('rating') || '') ? params.get('rating')! : '5');
  const [comment, setComment] = useState('');

  useEffect(() => {
    let active = true;
    Promise.all([api<{ user: Customer }>('/user/me'), api<CustomerOrder[]>('/user/orders')])
      .then(([data, list]) => { if (active) { setUser(data.user); setOrders(list); } })
      .catch(e => { if (!active) return; if (e instanceof ApiError && [401, 403].includes(e.status)) navigate('/login', { replace: true, state: { from: { pathname: '/account' } } }); else setError(e.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [navigate]);

  async function change(event: FormEvent<HTMLFormElement>, kind: 'email' | 'password') {
    event.preventDefault(); setBusy(true); setError(''); setMessage('');
    try {
      const result = await api<{ message: string }>(`/user/${kind}`, { method: 'PUT', body: JSON.stringify(kind === 'email'
        ? { email, current_password: currentPassword }
        : { password, confirm_password: confirm, current_password: currentPassword }) });
      setMessage(result.message); setCurrentPassword(''); setPassword(''); setConfirm('');
      if (kind === 'password') navigate('/login', { replace: true });
    } catch (e) { setError(e instanceof Error ? e.message : 'Unable to update account.'); }
    finally { setBusy(false); }
  }

  async function review(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError('');
    try { const result = await api<{ message: string }>(`/user/orders/${reviewOrder}/review`, { method: 'POST', body: JSON.stringify({ rating: Number(rating), comment }) }); setMessage(result.message); setReviewOrder(null); setComment(''); }
    catch (e) { setError(e instanceof Error ? e.message : 'Unable to save review.'); }
    finally { setBusy(false); }
  }
  const input = 'mt-2 w-full rounded-lg border border-slate-300 p-3';
  const button = 'rounded-lg bg-[#0e2236] px-5 py-3 text-sm text-white disabled:opacity-50';
  return <main className="min-h-[70vh] bg-slate-50 px-4 py-12"><div className="mx-auto max-w-5xl space-y-8">
    <h1 className="text-3xl font-semibold text-[#0e2236]">My account</h1>
    {loading && <p role="status">Loading your account…</p>}
    {error && <p role="alert" className="rounded-lg bg-red-50 p-4 text-red-800">{error}</p>}
    {message && <p role="status" className="rounded-lg bg-emerald-50 p-4 text-emerald-800">{message}</p>}
    {user && <>
      <p className="text-slate-600">{user.full_name} · {user.email} · Email verified</p>
      <section className="rounded-xl bg-white p-6 shadow-sm"><h2 className="mb-5 text-xl font-semibold">Your orders</h2>
        {!orders.length && <p>No orders yet. <Link to="/catalog" className="underline">Browse the catalog</Link>.</p>}
        <div className="space-y-4">{orders.map(order => <article key={order.id} className="rounded-lg border p-4">
          <div className="flex flex-wrap justify-between gap-2"><h3 className="font-semibold">{order.order_number}</h3><span>${order.total.toFixed(2)}</span></div>
          <p className="mt-2 text-sm text-slate-600">{order.status.replaceAll('_', ' ')} · {order.payment}</p>
          {order.details.trackingUrl && /^https:\/\//.test(order.details.trackingUrl) && <a href={order.details.trackingUrl} target="_blank" rel="noreferrer" className="mt-3 block text-sm text-blue-700 underline">Track with {order.details.carrier || 'carrier'} · {order.details.trackingNumber}</a>}
          {['delivered', 'completed'].includes(order.status.toLowerCase()) && <button className="mt-3 text-sm text-blue-700 underline" onClick={() => setReviewOrder(order.id)}>Write or update a review</button>}
        </article>)}</div>
      </section>
      {reviewOrder && <form onSubmit={review} className="space-y-4 rounded-xl bg-white p-6"><h2 className="text-xl font-semibold">Review your order</h2>
        <label className="block">Rating<select className={input} value={rating} onChange={e => setRating(e.target.value)}>{[5,4,3,2,1].map(v => <option key={v} value={v}>{v} stars</option>)}</select></label>
        <label className="block">Your review<textarea required minLength={3} maxLength={3000} className={input} value={comment} onChange={e => setComment(e.target.value)} /></label>
        <button disabled={busy} className={button}>Save review</button>
      </form>}
      <div className="grid gap-6 md:grid-cols-2">
        <form className="space-y-4 rounded-xl bg-white p-6 shadow-sm" onSubmit={e => change(e, 'email')}><h2 className="text-xl font-semibold">Change email</h2><p className="text-sm text-slate-600">We’ll verify the new address before changing your account.</p>
          <label className="block text-sm">New email<input type="email" autoComplete="email" required className={input} value={email} onChange={e => setEmail(e.target.value)} /></label>
          <label className="block text-sm">Current password<input type="password" autoComplete="current-password" required className={input} value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} /></label>
          <button disabled={busy} className={button}>Verify new email</button>
        </form>
        <form className="space-y-4 rounded-xl bg-white p-6 shadow-sm" onSubmit={e => change(e, 'password')}><h2 className="text-xl font-semibold">Change password</h2><p className="text-sm text-slate-600">At least 12 characters, with uppercase, lowercase, a number and a symbol.</p>
          <label className="block text-sm">Current password<input type="password" autoComplete="current-password" required className={input} value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} /></label>
          <label className="block text-sm">New password<input type="password" autoComplete="new-password" required minLength={12} className={input} value={password} onChange={e => setPassword(e.target.value)} /></label>
          <label className="block text-sm">Confirm password<input type="password" autoComplete="new-password" required minLength={12} className={input} value={confirm} onChange={e => setConfirm(e.target.value)} /></label>
          <button disabled={busy} className={button}>Update password</button>
        </form>
      </div>
    </>}
  </div></main>;
}
