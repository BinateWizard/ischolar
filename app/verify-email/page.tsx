"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { auth, checkEmailVerified } from "@/lib/firebase/auth";
import { onAuthStateChanged } from "firebase/auth";

export default function VerifyEmailPage() {
  const [checking, setChecking] = useState(true);
  const [countdown, setCountdown] = useState(300); // 5 minutes
  const [email, setEmail] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get email and user data from URL params
    const emailParam = searchParams.get("email");
    const lastName = searchParams.get("lastName");
    const firstName = searchParams.get("firstName");
    const middleInitial = searchParams.get("middleInitial");

    if (emailParam) {
      setEmail(emailParam);
    }

    // Check email verification status every 3 seconds
    const checkInterval = setInterval(async () => {
      const user = auth.currentUser;
      if (user) {
        const isVerified = await checkEmailVerified(user);
        if (isVerified) {
          setChecking(false);
          
          // Create profile in MySQL
          try {
            const res = await fetch('/api/auth/sync-profile', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                uid: user.uid,
                email: user.email,
                lastName: lastName || '',
                firstName: firstName || '',
                middleInitial: middleInitial || null
              })
            });

            if (res.ok) {
              // Show success message then redirect
              setTimeout(() => {
                router.push("/?verified=true");
              }, 2000);
            }
          } catch (error) {
            console.error('Profile sync error:', error);
          }
        }
      }
    }, 3000);

    // Countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(checkInterval);
          clearInterval(countdownInterval);
          // Timeout - redirect to signup
          router.push("/signup?timeout=true");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(checkInterval);
      clearInterval(countdownInterval);
    };
  }, [router, searchParams]);

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  if (!checking) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-gradient-to-b from-green-50 to-slate-50 px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h1>
            <p className="text-gray-600 mb-4">Your account has been created successfully.</p>
            <p className="text-sm text-gray-500">Redirecting you to the home page...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-gradient-to-b from-blue-50 to-slate-50 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          {/* Email Icon */}
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
            Check Your Email
          </h1>
          <p className="text-gray-600 text-center mb-6">
            We've sent a verification link to:
          </p>
          <p className="text-blue-600 font-medium text-center mb-6">
            {email}
          </p>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              What's next?
            </h3>
            <ol className="text-sm text-blue-800 space-y-2 ml-7">
              <li>1. Open your email inbox</li>
              <li>2. Click the verification link we sent</li>
              <li>3. You'll be automatically redirected here</li>
            </ol>
          </div>

          {/* Status */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 text-gray-600">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
              <span className="text-sm">Waiting for verification...</span>
            </div>
          </div>

          {/* Countdown */}
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-2">This page will timeout in:</p>
            <p className="text-2xl font-bold text-gray-900 mb-4">
              {minutes}:{seconds.toString().padStart(2, '0')}
            </p>
          </div>

          {/* Help Text */}
          <div className="border-t border-gray-200 pt-4">
            <p className="text-xs text-gray-500 text-center mb-2">
              Didn't receive the email?
            </p>
            <div className="flex gap-2 text-xs">
              <button 
                onClick={() => window.location.reload()}
                className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Refresh Page
              </button>
              <button 
                onClick={() => router.push('/signup')}
                className="flex-1 px-3 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>

        {/* Additional Help */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Check your spam folder if you don't see the email
          </p>
        </div>
      </div>
    </div>
  );
}
