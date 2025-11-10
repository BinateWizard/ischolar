"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import Link from "next/link";

export default function ApplyPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <section className="snap-start min-h-[calc(100vh-5rem)] bg-gradient-to-b from-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="snap-start min-h-[calc(100vh-5rem)] bg-gradient-to-b from-white to-blue-50 flex items-center">
      <div className="max-w-5xl mx-auto px-6 w-full">
        <div className="bg-white/80 backdrop-blur rounded-2xl shadow-sm border border-gray-200 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Apply for Scholarships</h1>
          <p className="text-gray-600 mb-8">
            Start your scholarship application in a few simple steps. You can save your progress and return anytime.
          </p>

          <ol className="grid sm:grid-cols-3 gap-6 mb-10">
            <li className="p-5 rounded-xl border border-gray-200 bg-white">
              <div className="text-sm text-gray-500 mb-1">Step 1</div>
              <div className="font-semibold mb-2">Create your profile</div>
              <p className="text-sm text-gray-600">Provide your personal and academic details.</p>
            </li>
            <li className="p-5 rounded-xl border border-gray-200 bg-white">
              <div className="text-sm text-gray-500 mb-1">Step 2</div>
              <div className="font-semibold mb-2">Choose a program</div>
              <p className="text-sm text-gray-600">Find scholarships that match your qualifications.</p>
            </li>
            <li className="p-5 rounded-xl border border-gray-200 bg-white">
              <div className="text-sm text-gray-500 mb-1">Step 3</div>
              <div className="font-semibold mb-2">Upload documents</div>
              <p className="text-sm text-gray-600">Submit required IDs, grades, and certifications.</p>
            </li>
          </ol>

          <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Programs</h2>
          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 flex flex-col">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">Merit Scholarship</h3>
                  <p className="text-sm text-gray-600">For top-performing students</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Open</span>
              </div>
              <ul className="text-sm text-gray-700 list-disc list-inside space-y-1 mb-4">
                <li>GWA 1.75 or higher</li>
                <li>Certificate of Enrollment</li>
                <li>Valid Student ID</li>
              </ul>
              <div className="mt-auto flex items-center justify-between text-sm text-gray-500">
                <span>Stipend: ₱5,000/mo</span>
                <span>Deadline: Dec 15</span>
              </div>
              {user ? (
                <Link href="/apply/merit-scholarship" className="mt-4 inline-flex justify-center rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 transition-colors">
                  Apply now
                </Link>
              ) : (
                <Link href="/signin" className="mt-4 inline-flex justify-center rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 transition-colors">
                  Sign in to apply
                </Link>
              )}
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 flex flex-col">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">Needs-Based Grant</h3>
                  <p className="text-sm text-gray-600">For students requiring financial support</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Open</span>
              </div>
              <ul className="text-sm text-gray-700 list-disc list-inside space-y-1 mb-4">
                <li>Proof of household income</li>
                <li>GWA 2.25 or higher</li>
                <li>Barangay clearance</li>
              </ul>
              <div className="mt-auto flex items-center justify-between text-sm text-gray-500">
                <span>Stipend: ₱3,000/mo</span>
                <span>Deadline: Jan 5</span>
              </div>
              {user ? (
                <Link href="/apply/needs-based-grant" className="mt-4 inline-flex justify-center rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 transition-colors">
                  Apply now
                </Link>
              ) : (
                <Link href="/signin" className="mt-4 inline-flex justify-center rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 transition-colors">
                  Sign in to apply
                </Link>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {user ? (
              <Link
                href="/apply/merit-scholarship"
                className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Start Application
              </Link>
            ) : (
              <Link
                href="/signin"
                className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Sign in to Start Application
              </Link>
            )}
            <Link href="/faqs" className="text-blue-600 hover:text-blue-700">Read FAQs</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
