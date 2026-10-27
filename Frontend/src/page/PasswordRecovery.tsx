import { useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import AccountPanel from '../component/AccountPanel';
import { api } from '../lib/api';

export default function PasswordRecovery({ reset = false }: { reset?: boolean }) {
  const [params, setParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault(); setError(''); setBusy(true);
    try {
      if (reset && password !== confirm) throw new Error('Passwords do not match.');
      const result = await api<{ message: string }>(reset ? '/user/reset-password' : '/user/forgot-password', {
        method: 'POST', body: JSON.stringify(reset ? { token: params.get('token'), password, confirm_password: confirm } : { email }),
      });
      setMessage(result.message); setDone(true);
      if (reset) { setParams({}, { replace: true }); setPassword(''); setConfirm(''); }
    } catch (e) { setError(e instanceof Error ? e.message : 'Unable to complete request.'); }
    finally { setBusy(false); }
  }
  return <AccountPanel title={reset ? 'Choose a new password' : 'Forgot your password?'} description={reset ? 'Use at least 12 characters, including uppercase, lowercase, a number and a special character.' : 'Enter your email and we’ll send you a single-use reset link, valid for one hour.'}>
    {message && <p role="status" className="mb-4 text-sm text-emerald-800">{message}</p>}
    {error && <p role="alert" className="mb-4 text-sm text-red-700">{error}</p>}
    {!done && <form onSubmit={submit} className="space-y-4">
      {reset ? <>
        <label className="block text-sm">New password<input required minLength={12} type="password" autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} className="mt-2 w-full rounded-lg border p-3" /></label>
        <label className="block text-sm">Confirm password<input required minLength={12} type="password" autoComplete="new-password" value={confirm} onChange={e => setConfirm(e.target.value)} className="mt-2 w-full rounded-lg border p-3" /></label>
      </> : <label className="block text-sm">Email<input required type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-2 w-full rounded-lg border p-3" /></label>}
      <button disabled={busy || (reset && !params.get('token'))} className="w-full rounded-lg bg-[#0e2236] p-3 text-white disabled:opacity-50">{busy ? 'Please wait…' : reset ? 'Update password' : 'Send reset link'}</button>
    </form>}
  </AccountPanel>;
}
