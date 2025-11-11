"use client";

import { useState } from "react";
import { reviewVerificationDocument, updateVerificationStatus } from "@/lib/actions/verification";
import { useAuth } from "@/lib/hooks/useAuth";

export default function VerificationReviewClient({ requests }: { requests: any[] }) {
  const { user } = useAuth();
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [processing, setProcessing] = useState(false);

  async function handleApprove(profileId: string) {
    if (!user || !confirm("Approve this account?")) return;
    
    setProcessing(true);
    try {
      await updateVerificationStatus(user.id, profileId, 'VERIFIED');
      window.location.reload();
    } catch (err) {
      alert("Failed to approve account");
    } finally {
      setProcessing(false);
    }
  }

  async function handleReject(profileId: string) {
    if (!user) return;
    
    const reason = prompt("Reason for rejection:");
    if (!reason) return;
    
    setProcessing(true);
    try {
      await updateVerificationStatus(user.id, profileId, 'REJECTED');
      window.location.reload();
    } catch (err) {
      alert("Failed to reject account");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Requests List */}
      <div className="space-y-4">
        {requests.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
            <p className="text-gray-600">No pending verifications</p>
          </div>
        ) : (
          requests.map((profile) => (
            <div
              key={profile.id}
              className={`bg-white rounded-xl border-2 p-6 cursor-pointer transition-all ${
                selectedProfile?.id === profile.id
                  ? 'border-blue-500 shadow-lg'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => setSelectedProfile(profile)}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {profile.firstName} {profile.lastName}
                  </h3>
                  <p className="text-sm text-gray-600">{profile.email}</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                  profile.verificationStatus === 'UNDER_REVIEW'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {profile.verificationStatus.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Student #: {profile.studentNumber}</p>
                <p>Campus: {profile.campus}</p>
                <p>Course: {profile.course}</p>
                <p>Year: {profile.yearLevel}</p>
                <p className="text-xs text-gray-500 mt-2">
                  Submitted: {new Date(profile.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Document Review Panel */}
      <div>
        {selectedProfile ? (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sticky top-24">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Review Documents</h2>
            
            <div className="space-y-4 mb-6">
              {selectedProfile.verificationDocuments.map((doc: any) => (
                <div key={doc.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{doc.docType.replace(/_/g, ' ')}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      doc.status === 'VALID'
                        ? 'bg-green-100 text-green-800'
                        : doc.status === 'INVALID'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {doc.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{doc.fileName}</p>
                  <p className="text-xs text-gray-500">
                    Uploaded: {new Date(doc.createdAt).toLocaleDateString()}
                  </p>
                  {doc.rejectionReason && (
                    <p className="text-sm text-red-600 mt-2">Reason: {doc.rejectionReason}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleReject(selectedProfile.id)}
                disabled={processing}
                className="flex-1 px-4 py-3 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium disabled:opacity-50"
              >
                Reject
              </button>
              <button
                onClick={() => handleApprove(selectedProfile.id)}
                disabled={processing}
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
              >
                Approve
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300 p-12 text-center">
            <p className="text-gray-500">Select a profile to review documents</p>
          </div>
        )}
      </div>
    </div>
  );
}
