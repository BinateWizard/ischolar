"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { getVerificationRequests } from "@/lib/actions/verification";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import VerificationReviewClient from "./VerificationReviewClient";

type VerificationRequests = Awaited<ReturnType<typeof getVerificationRequests>>;

export default function AdminVerificationsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [requests, setRequests] = useState<VerificationRequests>([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!user) return;
      
      try {
        const data = await getVerificationRequests(user.uid);
        setRequests(data);
        setIsAdmin(true);
      } catch (error: any) {
        console.error('Failed to load verification requests:', error);
        if (error.message === 'Unauthorized') {
          router.push('/profile');
        }
      } finally {
        setRequestsLoading(false);
      }
    }

    loadData();
  }, [user, router]);

  if (loading || requestsLoading) {
    return (
      <div className="min-h-[calc(100vh-5rem)] py-12 px-4 bg-gradient-to-b from-blue-50/30 to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading verification requests...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] py-12 px-4 bg-gradient-to-b from-blue-50/30 to-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Verifications</h1>
          <p className="text-gray-600">Review and approve student verification requests</p>
        </div>

        <VerificationReviewClient requests={requests} />
      </div>
    </div>
  );
}
