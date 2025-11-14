"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      });

      if (result?.error) {
        setError('Invalid email or password');
        setLoading(false);
      } else {
        // Determine role from session and redirect appropriately
        const session = await getSession();
        const role = session?.user?.role as string | undefined;
        const adminRoles = ['ADMIN', 'REVIEWER', 'APPROVER'];
        if (role && adminRoles.includes(role)) {
          router.push('/admin');
        } else {
          router.push('/profile');
        }
        router.refresh();
      }
    } catch (err: any) {
      console.error('Sign in error:', err);
      setError('An unexpected error occurred');
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setGoogleLoading(true);
    try {
      await signIn('google', { callbackUrl: '/profile' });
    } catch (err: any) {
      setError('Google sign-in failed');
      setGoogleLoading(false);
    }
  }

  return (
    <section className="snap-start min-h-[calc(100vh-5rem)] flex items-center bg-gradient-to-b from-white to-slate-50 py-12">
      <div className="max-w-md mx-auto w-full px-6">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Sign in</h1>
          <p className="text-gray-600 mb-6">Access your applications and profile.</p>

          <form className="space-y-4" onSubmit={onSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200">
                <p className="text-sm text-rose-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-4 py-2 transition-colors disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Continue"}
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 border rounded bg-white hover:bg-gray-50 text-gray-700 disabled:opacity-50"
            >
              {googleLoading ? 'Continuing…' : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.52 12.272c0-.816-.072-1.632-.216-2.424H12v4.584h6.48a5.54 5.54 0 0 1-2.4 3.648v3.024h3.888c2.28-2.088 3.552-5.16 3.552-8.832Z" fill="#4285F4"/>
                    <path d="M12 24c3.24 0 5.976-1.056 7.968-2.88l-3.888-3.024c-1.08.744-2.472 1.176-4.08 1.176-3.12 0-5.76-2.088-6.72-4.92H1.248v3.096A12.004 12.004 0 0 0 12 24Z" fill="#34A853"/>
                    <path d="M5.28 14.352A7.21 7.21 0 0 1 4.968 12c0-.816.144-1.608.312-2.352V6.552H1.248A12.004 12.004 0 0 0 0 12c0 1.92.456 3.744 1.248 5.448l4.032-3.096Z" fill="#FBBC05"/>
                    <path d="M12 4.776c1.764 0 3.336.6 4.584 1.776l3.432-3.432C17.976 1.26 15.24 0 12 0 7.248 0 2.88 2.736 1.248 6.552l4.032 3.096c.96-2.832 3.6-4.872 6.72-4.872Z" fill="#EA4335"/>
                  </svg>
                  <span>Google</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Don't have an account? <Link className="text-blue-600 hover:text-blue-700" href="/signup">Sign up</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
