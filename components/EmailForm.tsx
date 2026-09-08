'use client';

import { useState } from 'react';
import { Mail, CheckCircle, Loader2 } from 'lucide-react';

export function EmailForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Erreur lors de l'inscription");
      }

      setStatus('success');
      setMessage("Merci ! Vous êtes sur la liste. On vous écrit avant le 13 septembre.");
      setEmail('');
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  }

  if (status === 'success') {
    return (
      <div className="mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-petale-200 bg-white p-4 shadow-sm">
        <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-600" />
        <p className="text-sm text-petale-900">{message}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex max-w-md flex-col gap-2 rounded-2xl border border-petale-200 bg-white p-2 shadow-sm sm:flex-row sm:items-center"
    >
      <div className="relative flex-1">
        <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-petale-400" />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="votre@email.fr"
          required
          disabled={status === 'loading'}
          className="w-full rounded-xl border-0 bg-transparent py-3 pl-10 pr-3 text-sm text-petale-950 placeholder-petale-400 focus:outline-none focus:ring-0 disabled:opacity-50"
          aria-label="Votre adresse email"
        />
      </div>
      <button
        type="submit"
        disabled={status === 'loading'}
        className="btn-primary !px-5 !py-2.5 text-sm"
      >
        {status === 'loading' ? (
          <>
            <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
            Inscription…
          </>
        ) : (
          'Être notifié'
        )}
      </button>
      {status === 'error' && (
        <p className="text-xs text-red-600 sm:col-span-2 sm:basis-full">{message}</p>
      )}
    </form>
  );
}