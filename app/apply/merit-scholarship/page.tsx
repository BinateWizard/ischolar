"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { submitApplication } from "@/lib/actions/application";

export default function MeritScholarshipApplicationPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    gwa: "",
    yearLevel: "",
    course: "",
    campus: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const MERIT_PROGRAM_CYCLE_ID = "d7bcebdb-37ce-4830-9f25-1821ae89813f"; // Merit Scholarship AY2025-2026

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError("Please sign in to submit an application");
      return;
    }

    const gwaValue = parseFloat(formData.gwa);
    if (gwaValue > 1.75) {
      setError("GWA must be 1.75 or higher to qualify for Merit Scholarship");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await submitApplication(user.id, {
        programCycleId: MERIT_PROGRAM_CYCLE_ID,
        gwa: gwaValue,
        yearLevel: formData.yearLevel,
        course: formData.course,
        campus: formData.campus,
      });

      // Redirect to status page
      router.push("/status?success=true&scholarship=merit");
    } catch (err: any) {
      setError(err.message || "Failed to submit application");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] py-12 px-4 bg-gradient-to-b from-blue-50/30 to-slate-50">
      <div className="max-w-3xl mx-auto">
        {/* Back button */}
        <Link href="/apply" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Programs
        </Link>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Merit Scholarship Application</h1>
            <p className="text-gray-600">For top-performing students with GWA 1.75 or higher</p>
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>Requirements:</strong> GWA 1.75 or higher, Certificate of Enrollment, Valid Student ID
              </p>
              <p className="text-sm text-blue-700 mt-1">
                Stipend: ₱5,000/month | Deadline: December 15, 2025
              </p>
            </div>
          </div>

          {/* Application Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="gwa" className="block text-sm font-medium text-gray-700 mb-2">
                General Weighted Average (GWA) <span className="text-red-500">*</span>
              </label>
              <input
                id="gwa"
                type="number"
                step="0.01"
                min="1.00"
                max="5.00"
                required
                value={formData.gwa}
                onChange={(e) => setFormData({ ...formData, gwa: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 1.50"
              />
              <p className="text-xs text-gray-500 mt-1">Must be 1.75 or higher to qualify</p>
            </div>

            <div>
              <label htmlFor="yearLevel" className="block text-sm font-medium text-gray-700 mb-2">
                Year Level <span className="text-red-500">*</span>
              </label>
              <select
                id="yearLevel"
                required
                value={formData.yearLevel}
                onChange={(e) => setFormData({ ...formData, yearLevel: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select year level</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="5th Year">5th Year</option>
              </select>
            </div>

            <div>
              <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-2">
                Course/Program <span className="text-red-500">*</span>
              </label>
              <input
                id="course"
                type="text"
                required
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., BS Computer Science"
              />
            </div>

            <div>
              <label htmlFor="campus" className="block text-sm font-medium text-gray-700 mb-2">
                Campus <span className="text-red-500">*</span>
              </label>
              <select
                id="campus"
                required
                value={formData.campus}
                onChange={(e) => setFormData({ ...formData, campus: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select campus</option>
                <option value="Main Campus">Main Campus</option>
                <option value="North Campus">North Campus</option>
                <option value="South Campus">South Campus</option>
              </select>
            </div>

            {/* Document Upload Section (Placeholder) */}
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Required Documents</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Certificate of Enrollment <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valid Student ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transcript of Records / Grade Sheet <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200">
                <p className="text-sm text-rose-600">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-6 py-3 transition-colors disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Application"}
              </button>
              <Link
                href="/apply"
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
