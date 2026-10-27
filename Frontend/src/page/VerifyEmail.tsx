import { useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import AccountPanel from '../component/AccountPanel';
import { api } from '../lib/api';

export default function VerifyEmail() {
  const [params, setParams] = useSearchParams();
  const token = params.get('token');
  const [email, setEmail] = useState(params.get('email') || '');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [verified, setVerified] = useState(false);
  const [resendAt, setResendAt] = useState(0);

  async function verify(event: FormEvent) {
    event.preventDefault();
    setBusy(true); setError(''); setMessage('');
    try {
      const data = await api<{ message: string }>('/user/verify-email', { method: 'POST', body: JSON.stringify(
        token ? { token, purpose: params.get('purpose') || 'verify' } : { email, code }) });
      setVerified(true); setMessage(data.message);
      // Remove the single-use secret from browser history after successful confirmation.
      setParams({}, { replace: true });
    } catch (e) { setError(e instanceof Error ? e.message : 'Verification failed.'); }
    finally { setBusy(false); }
  }

  async function resend(method: 'link' | 'otp') {
    if (Date.now() < resendAt) { setError('Please wait one minute before requesting another email.'); return; }
    setBusy(true); setError(''); setMessage('');
    try {
      const result = await api<{ message: string }>('/user/resend-verification', { method: 'POST', body: JSON.stringify({ email, method }) });
      setMessage(result.message); setResendAt(Date.now() + 60000);
    } catch (e) { setError(e instanceof Error ? e.message : 'Unable to resend.'); }
    finally { setBusy(false); }
  }

  return <AccountPanel title={verified ? 'Email verified' : 'Verify your email'} description="Confirm your email to activate your account. You can sign in and place orders after verification. Unverified new accounts expire after 48 hours.">
    {message && <p role="status" className="mb-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">{message}</p>}
    {error && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}
    {!verified && <>
      <form onSubmit={verify} className="space-y-4">
        {!token && <>
          <label className="block text-sm">Email address<input type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-2 w-full rounded-lg border p-3" /></label>
          <label className="block text-sm">Six-digit code<input inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} value={code} onChange={e => setCode(e.target.value.replace(/\D/g, ''))} required className="mt-2 w-full rounded-lg border p-3 text-center text-xl tracking-widest" /></label>
        </>}
        <button disabled={busy} className="w-full rounded-lg bg-[#0e2236] p-3 text-white disabled:opacity-50">{busy ? 'Please wait…' : 'Verify email'}</button>
      </form>
      <div className="mt-6 border-t pt-5">
        {token && <label className="block text-sm">Email for a new link or code<input type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-2 w-full rounded-lg border p-3" /></label>}
        <div className="mt-3 flex flex-wrap gap-4 text-sm text-[#1b8ec4]">
          <button disabled={busy || !email} onClick={() => resend('link')}>Resend verification link</button>
          <button disabled={busy || !email} onClick={() => resend('otp')}>Send a code instead</button>
        </div>
        {token && <button className="mt-4 text-sm underline" onClick={() => setParams(email ? { email } : {})}>Enter a code instead</button>}
        <p className="mt-4 text-xs leading-5 text-slate-500">Account expired? <Link to="/signup" className="text-[#1b8ec4] underline">Create a new account</Link>.</p>
      </div>
    </>}
  </AccountPanel>;
}
