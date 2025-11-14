"use client";

import { useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";

export default function AdminDebugEmailPage() {
  const { user, loading } = useAuth();
  const [to, setTo] = useState(process.env.NEXT_PUBLIC_DEBUG_TEST_RECIPIENT || "");
  const [loadingSend, setLoadingSend] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setResult(null);
    setLoadingSend(true);

    try {
      const res = await fetch('/api/_debug/send-test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to }),
      });

      const data = await res.json();
      if (!res.ok) {
        setResult(`Error: ${data?.error || res.statusText}`);
      } else {
        setResult(`Success: id=${data.id} status=${data.status}`);
      }
    } catch (err: any) {
      setResult(`Request failed: ${err?.message || String(err)}`);
    } finally {
      setLoadingSend(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-40 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6">
        <p className="text-gray-700">You must be signed in to access this page.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">Debug: Send Test Email</h1>
      <p className="text-sm text-gray-600 mb-4">Use this page to trigger a server-side test email using the `RESEND_API_KEY` configured on the server. Only works in development (or when `DEBUG_SEND_TEST=true`).</p>

      <form onSubmit={handleSend} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Recipient</label>
          <input
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="you@your-email.com"
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loadingSend}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
          >
            {loadingSend ? 'Sending...' : 'Send Test Email'}
          </button>

          <button
            type="button"
            onClick={() => { setResult(null); setTo(process.env.NEXT_PUBLIC_DEBUG_TEST_RECIPIENT || ''); }}
            className="px-4 py-2 bg-gray-100 rounded"
          >
            Reset
          </button>
        </div>

        {result && (
          <div className="mt-4 p-3 rounded bg-gray-50 border">
            <pre className="text-sm text-gray-800 whitespace-pre-wrap">{result}</pre>
          </div>
        )}
      </form>

      <div className="mt-8 text-sm text-gray-500">
        <p>Notes:</p>
        <ul className="list-disc pl-5 mt-2">
          <li>The server will return an error if `RESEND_API_KEY` is not configured.</li>
          <li>Check the server terminal output and the Resend dashboard for delivery/bounce details.</li>
          <li>For convenience set `DEBUG_TEST_RECIPIENT` or `NEXT_PUBLIC_DEBUG_TEST_RECIPIENT` in your `.env.local`.</li>
        </ul>
      </div>
    </div>
  );
}
