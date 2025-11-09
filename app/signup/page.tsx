"use client";

import { useState } from "react";
import { signUp, signInWithGoogle } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";
import { FirebaseError } from "firebase/app";

export default function SignUpPage() {
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleInitial, setMiddleInitial] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Sign up with Firebase
        const result = await signUp(email, password, {
        lastName,
        firstName,
        middleInitial: middleInitial || undefined
      });

        // Redirect to verification waiting page with user data
        const params = new URLSearchParams({
          email,
          lastName,
          firstName,
          ...(middleInitial && { middleInitial })
        });
      
        router.push(`/verify-email?${params.toString()}`);
    } catch (err: any) {
      console.error('Signup error:', err);
      
      // Handle Firebase auth errors
      if (err instanceof FirebaseError) {
        switch (err.code) {
          case 'auth/email-already-in-use':
            setError('This email is already registered. Please sign in instead.');
            break;
          case 'auth/operation-not-allowed':
            setError('Sign up is disabled or Email/Password provider is not enabled. In Firebase Console, enable Authentication → Sign-in method → Email/Password and ensure Authentication → Settings → User account creation is ON.');
            break;
          case 'auth/invalid-email':
            setError('Invalid email address.');
            break;
          case 'auth/weak-password':
            setError('Password is too weak. Please use a stronger password.');
            break;
          default:
            setError(err.message || 'Failed to create account');
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      setLoading(false);
    }
  }

  return (
    <section className="snap-start min-h-[calc(100vh-5rem)] flex items-center bg-gradient-to-b from-white to-slate-50 py-12">
      <div className="max-w-md mx-auto w-full px-6">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Create your account</h1>
          <p className="text-gray-600 mb-6">Start your iScholar journey. It's quick and free.</p>

          <form className="space-y-4" onSubmit={onSubmit}>
            {/* Last Name and Middle Initial on same row */}
            <div className="grid grid-cols-[1fr_auto] gap-3">
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Dela Cruz"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>

              <div className="w-20">
                <label htmlFor="middleInitial" className="block text-sm font-medium text-gray-700 mb-1">M.I.</label>
                <input
                  id="middleInitial"
                  type="text"
                  placeholder="A"
                  maxLength={1}
                  className="w-full text-center rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={middleInitial}
                  onChange={(e) => setMiddleInitial(e.target.value.toUpperCase())}
                />
              </div>
            </div>

            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                id="firstName"
                type="text"
                placeholder="Juan"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

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
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="confirm" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input
                id="confirm"
                type="password"
                placeholder="••••••••"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                minLength={8}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200">
                <p className="text-sm text-rose-600">{error}</p>
              </div>
            )}
            
            {success && (
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-900 mb-1">Check Your Email</p>
                    <p className="text-sm text-blue-700">{success}</p>
                    <p className="text-xs text-blue-600 mt-2">After confirming your email, you can <a href="/signin" className="underline font-medium">sign in here</a>.</p>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-4 py-2 transition-colors disabled:opacity-60"
              disabled={loading || !!success}
            >
              {loading ? "Creating account..." : success ? "Email sent!" : "Create account"}
            </button>
          </form>

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
            onClick={async () => {
              setError(null);
              setGoogleLoading(true);
              try {
                await signInWithGoogle();
                // Google users are already verified; go straight to profile
                router.push('/profile');
                router.refresh();
              } catch (e: any) {
                setError(e.message || 'Google sign-in failed');
              } finally {
                setGoogleLoading(false);
              }
            }}
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

          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account? <a className="text-blue-600 hover:text-blue-700" href="/signin">Sign in</a>
          </div>
        </div>
      </div>
    </section>
  );
}
