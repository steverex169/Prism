import { useEffect, useState } from 'react';
import { api } from '../lib/api';

interface Mail { id: number; template: string; recipient: string; status: string; attempts: number; last_error?: string; created_at: string }

export default function EmailActivity() {
  const [emails, setEmails] = useState<Mail[]>([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const load = async () => { setBusy(true); setError(''); try { setEmails(await api<Mail[]>('/admin/emails')); } catch (e) { setError(e instanceof Error ? e.message : 'Unable to load emails.'); } finally { setBusy(false); } };
  useEffect(() => { let active = true; api<Mail[]>('/admin/emails').then(data => { if (active) setEmails(data); }).catch(e => { if (active) setError(e.message); }); return () => { active = false; }; }, []);
  async function retry(id: number) { setBusy(true); try { await api(`/admin/emails/${id}/retry`, { method: 'POST' }); await load(); } catch (e) { setError(e instanceof Error ? e.message : 'Unable to retry email.'); } finally { setBusy(false); } }
  return <section className="rounded-xl bg-white p-6 shadow-sm">
    <div className="flex items-center justify-between"><h1 className="text-2xl font-semibold text-slate-800">Email activity</h1><button onClick={load} disabled={busy} className="rounded-lg border px-4 py-2 text-sm">Refresh</button></div>
    <p className="mt-3 text-sm text-slate-600">Latest 200 messages. Sent means the email provider accepted the message. Messages remain pending when the provider key or sender is missing. Failed messages can be retried after resolving the configuration or delivery error.</p>
    {error && <p role="alert" className="mt-4 text-red-700">{error}</p>}
    <div className="mt-6 overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b"><th className="p-3">Email</th><th className="p-3">Recipient</th><th className="p-3">Status</th><th className="p-3">Attempts</th><th className="p-3">Action</th></tr></thead>
      <tbody>{emails.map(email => <tr key={email.id} className="border-b"><td className="p-3">{email.template}</td><td className="p-3">{email.recipient}</td><td className="p-3">{email.status}{email.last_error && <span className="block text-xs text-red-600">{email.last_error}</span>}</td><td className="p-3">{email.attempts}</td><td className="p-3">{email.status === 'failed' && <button disabled={busy} onClick={() => retry(email.id)} className="text-blue-700 underline">Retry</button>}</td></tr>)}</tbody>
    </table>{!emails.length && <p className="p-4 text-slate-500">No email activity yet.</p>}</div>
  </section>;
}
