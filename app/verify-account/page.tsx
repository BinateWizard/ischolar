"use client";

import { useState, useEffect } from "react";
import { getVerificationStatus, uploadVerificationDocument, updateProfileInfo } from "@/lib/actions/verification";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";

type VerificationStatus = "PENDING_VERIFICATION" | "UNDER_REVIEW" | "VERIFIED" | "REJECTED" | "SUSPENDED";
type DocumentType = "STUDENT_ID" | "PROOF_OF_ENROLLMENT" | "GOVERNMENT_ID";

export default function VerifyAccountPage() {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Profile form
  const [studentNumber, setStudentNumber] = useState("");
  const [campus, setCampus] = useState("");
  const [course, setCourse] = useState("");
  const [yearLevel, setYearLevel] = useState("");

  // Document uploads
  const [studentIdFile, setStudentIdFile] = useState<File | null>(null);
  const [enrollmentFile, setEnrollmentFile] = useState<File | null>(null);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  async function loadProfile() {
    if (!user) return;
    
    try {
      const data = await getVerificationStatus(user.uid);
      if (!data) {
        router.push("/signin");
        return;
      }
      setProfile(data);
      setStudentNumber(data.studentNumber || "");
      setCampus(data.campus || "");
      setCourse(data.course || "");
      setYearLevel(data.yearLevel || "");
      
      // Determine which step to show
      if (data.verificationStatus === "VERIFIED") {
        router.push("/profile");
      } else if (data.verificationStatus === "UNDER_REVIEW") {
        setStep(3); // Show status
      } else if (data.studentNumber && data.campus && data.course && data.yearLevel) {
        setStep(2); // Has profile info, needs documents
      } else {
        setStep(1); // Needs profile info
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  }

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    
    setError(null);
    setLoading(true);

    try {
      await updateProfileInfo(user.uid, { studentNumber, campus, course, yearLevel });
      setStep(2);
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  }

  async function handleDocumentUpload(docType: DocumentType, file: File) {
    if (!user) return;
    
    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("docType", docType);
      formData.append("file", file);
      
      await uploadVerificationDocument(user.uid, formData);
      await loadProfile();
    } catch (err: any) {
      setError(err.message || "Failed to upload document");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmitForReview() {
    if (!studentIdFile || !enrollmentFile) {
      setError("Please upload both required documents");
      return;
    }

    setUploading(true);
    try {
      await handleDocumentUpload("STUDENT_ID", studentIdFile);
      await handleDocumentUpload("PROOF_OF_ENROLLMENT", enrollmentFile);
      setStep(3);
    } catch (err: any) {
      setError(err.message || "Failed to submit documents");
    } finally {
      setUploading(false);
    }
  }

  if (loading && !profile) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] py-12 px-4 bg-gradient-to-b from-blue-50/30 to-slate-50">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Verification</h1>
          <p className="text-gray-600">Complete your profile and upload documents to verify your account</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
                {step > 1 ? '✓' : '1'}
              </div>
              <span className="text-sm font-medium">Profile Info</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-300"></div>
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
                {step > 2 ? '✓' : '2'}
              </div>
              <span className="text-sm font-medium">Upload Documents</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-300"></div>
            <div className={`flex items-center gap-2 ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
                {step > 3 ? '✓' : '3'}
              </div>
              <span className="text-sm font-medium">Review</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Step 1: Profile Information */}
        {step === 1 && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Complete Your Profile</h2>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student Number *</label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="2021-12345"
                  required
                  value={studentNumber}
                  onChange={(e) => setStudentNumber(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Campus *</label>
                <select
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  value={campus}
                  onChange={(e) => setCampus(e.target.value)}
                >
                  <option value="">Select Campus</option>
                  <option value="Main Campus">Main Campus</option>
                  <option value="North Campus">North Campus</option>
                  <option value="South Campus">South Campus</option>
                  <option value="East Campus">East Campus</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course/Program *</label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="BS Computer Science"
                  required
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year Level *</label>
                <select
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  value={yearLevel}
                  onChange={(e) => setYearLevel(e.target.value)}
                >
                  <option value="">Select Year Level</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="5th Year">5th Year</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
              >
                {loading ? "Saving..." : "Continue"}
              </button>
            </form>
          </div>
        )}

        {/* Step 2: Upload Documents */}
        {step === 2 && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Upload Verification Documents</h2>
            <p className="text-sm text-gray-600 mb-6">
              Upload clear, legible photos or scans of your documents. These will be reviewed by our team.
            </p>

            <div className="space-y-6">
              {/* Student ID */}
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">Student ID *</h3>
                    <p className="text-sm text-gray-600 mb-3">Upload a photo of your valid student ID (front and back)</p>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => setStudentIdFile(e.target.files?.[0] || null)}
                      className="text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
                    />
                    {studentIdFile && (
                      <p className="text-sm text-green-600 mt-2">✓ {studentIdFile.name}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Proof of Enrollment */}
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">Proof of Enrollment *</h3>
                    <p className="text-sm text-gray-600 mb-1">Certificate of Registration (COR) for current semester</p>
                    <p className="text-xs text-blue-600 mb-3">💡 This document will be reused for scholarship applications!</p>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => setEnrollmentFile(e.target.files?.[0] || null)}
                      className="text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-600 hover:file:bg-green-100"
                    />
                    {enrollmentFile && (
                      <p className="text-sm text-green-600 mt-2">✓ {enrollmentFile.name}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmitForReview}
                  disabled={!studentIdFile || !enrollmentFile || uploading}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
                >
                  {uploading ? "Uploading..." : "Submit for Review"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Under Review */}
        {step === 3 && profile && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
            {profile.verificationStatus === "UNDER_REVIEW" && (
              <>
                <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Under Review</h2>
                <p className="text-gray-600 mb-6">
                  Your documents have been submitted and are being reviewed by our team. 
                  This usually takes 1-3 business days.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-800">
                    📧 You'll receive an email notification once your account is verified.
                  </p>
                </div>
                <button
                  onClick={() => router.push("/profile")}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Go to Profile
                </button>
              </>
            )}

            {profile.verificationStatus === "REJECTED" && (
              <>
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Rejected</h2>
                <p className="text-gray-600 mb-6">
                  Unfortunately, your verification documents were rejected. Please review the feedback and resubmit.
                </p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
                  <h4 className="font-semibold text-red-900 mb-2">Rejection Reasons:</h4>
                  <ul className="text-sm text-red-800 space-y-1">
                    {profile.verificationDocuments
                      .filter((doc: any) => doc.status === 'INVALID' && doc.rejectionReason)
                      .map((doc: any) => (
                        <li key={doc.id}>• {doc.rejectionReason}</li>
                      ))}
                  </ul>
                </div>
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Resubmit Documents
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
