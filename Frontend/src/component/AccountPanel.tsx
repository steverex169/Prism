import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export default function AccountPanel({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return <main className="min-h-[70vh] bg-[#eef4f9] px-4 py-16">
    <section className="mx-auto max-w-lg rounded-2xl bg-white p-6 shadow-sm sm:p-10">
      <h1 className="text-3xl font-semibold text-[#0e2236]">{title}</h1>
      <p className="mb-7 mt-3 text-sm leading-6 text-slate-600">{description}</p>
      {children}
      <Link className="mt-6 block text-sm text-[#1b8ec4] underline" to="/login">Return to sign in</Link>
    </section>
  </main>;
}
