import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import AccountPanel from '../component/AccountPanel';
import { api } from '../lib/api';

export default function Unsubscribe() {
  const [params] = useSearchParams();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function unsubscribe() {
    setBusy(true); setError('');
    try { const result = await api<{ message: string }>('/email/unsubscribe', { method: 'POST', body: JSON.stringify({ token: params.get('token') }) }); setMessage(result.message); }
    catch (e) { setError(e instanceof Error ? e.message : 'Unable to unsubscribe.'); }
    finally { setBusy(false); }
  }
  return <AccountPanel title="Email preferences" description="Unsubscribe from the newsletter. You’ll still receive essential account and order messages.">
    {message ? <p role="status">{message}</p> : <button disabled={busy || !params.get('token')} className="rounded-lg bg-[#0e2236] p-3 text-white disabled:opacity-50" onClick={unsubscribe}>{busy ? 'Please wait…' : 'Unsubscribe'}</button>}
    {error && <p role="alert" className="mt-4 text-red-700">{error}</p>}
  </AccountPanel>;
}
