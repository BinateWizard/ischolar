import { getVerificationRequests, reviewVerificationDocument, updateVerificationStatus } from "@/lib/actions/verification";
import { requireAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import VerificationReviewClient from "./VerificationReviewClient";

export default async function AdminVerificationsPage() {
  const user = await requireAuth();
  
  const profile = await prisma.profile.findUnique({
    where: { userId: user.id }
  });

  if (!profile || !['ADMIN', 'REVIEWER'].includes(profile.role)) {
    redirect('/profile');
  }

  const verificationRequests = await getVerificationRequests();

  return (
    <div className="min-h-[calc(100vh-5rem)] py-12 px-4 bg-gradient-to-b from-blue-50/30 to-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Verifications</h1>
          <p className="text-gray-600">Review and approve student verification requests</p>
        </div>

        <VerificationReviewClient requests={verificationRequests} />
      </div>
    </div>
  );
}
