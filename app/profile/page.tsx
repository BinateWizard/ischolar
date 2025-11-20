"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { getUserProfile } from "@/lib/actions/profile";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import Link from "next/link";

type ProfileData = Awaited<ReturnType<typeof getUserProfile>>;
type Application = NonNullable<ProfileData>['applications'][number];

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<ProfileData>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      if (!user) return;
      
      try {
        const data = await getUserProfile(user.id);
        setProfile(data);
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        setProfileLoading(false);
      }
    }

    loadProfile();
  }, [user]);

  const router = useRouter();

  // If logged-in user's role is not a STUDENT, redirect to admin area
  useEffect(() => {
    if (!profileLoading && profile && profile.role && profile.role !== 'STUDENT') {
      router.push('/admin');
    }
  }, [profileLoading, profile, router]);

  if (loading || profileLoading) {
    return (
      <div className="snap-start min-h-[calc(100vh-5rem)] py-10 px-4 bg-gradient-to-b from-white to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="snap-start min-h-[calc(100vh-5rem)] py-10 px-4 bg-gradient-to-b from-white to-slate-50">
        <div className="w-full max-w-5xl mx-auto text-center">
          <p className="text-gray-600">Profile not found. Please try signing out and back in.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="snap-start min-h-[calc(100vh-5rem)] py-12 px-4 bg-gradient-to-b from-blue-50/30 to-slate-50">
      <div className="w-full max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
          <p className="text-gray-600">Manage your account information and scholarship applications</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">Personal Information</h2>
                  <Link href="/profile/edit">
                    <button className="px-4 py-2 text-sm bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium">
                      Edit Profile
                    </button>
                  </Link>
                </div>
              </div>
              <div className="p-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Last Name</label>
                    <div className="text-gray-900 font-medium">{profile.lastName || 'Not set'}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">First Name</label>
                    <div className="text-gray-900 font-medium">{profile.firstName || 'Not set'}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Middle Initial</label>
                    <div className="text-gray-900 font-medium">{profile.middleInitial || 'N/A'}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Student Number</label>
                    <div className="text-gray-900 font-medium">{profile.studentNumber || 'Not set'}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Email</label>
                    <div className="text-gray-900 font-medium">{profile.email}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Campus</label>
                    <div className="text-gray-900 font-medium">{profile.campus || 'Not set'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Scholarship Applications Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Scholarship Applications</h2>
              </div>
              <div className="p-6">
                {profile.applications.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-gray-600 mb-4">No applications yet.</p>
                    <a href="/apply" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                      Apply for Scholarship
                    </a>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {profile.applications.map((app: Application) => (
                      <div key={app.id} className="rounded-xl border border-gray-200 p-5 hover:border-blue-300 hover:shadow-md transition-all">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 text-lg mb-1">{app.programCycle.program.name}</h3>
                            <p className="text-sm text-gray-600">{app.programCycle.ayTerm}</p>
                          </div>
                          <span className={`text-xs px-3 py-1.5 rounded-full font-medium whitespace-nowrap ${
                            app.status === 'SUBMITTED' ? 'bg-amber-100 text-amber-800' :
                            app.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                            app.status === 'DENIED' ? 'bg-red-100 text-red-800' :
                            app.status === 'IN_VERIFICATION' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {app.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : 'Not submitted'}
                          </span>
                          {app.score && (
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                              </svg>
                              Score: {app.score}
                            </span>
                          )}
                        </div>
                        <a href="/status" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium">
                          View detailed status
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-6">
            {/* Account Info Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Account Info
              </h3>
              <div className="space-y-3">
                {profile.role !== 'STUDENT' && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Role</span>
                    <span className="text-sm font-medium text-gray-900 px-2 py-1 bg-blue-50 text-blue-700 rounded">{profile.role}</span>
                  </div>
                )}
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">User ID</span>
                  <span className="text-xs font-mono text-gray-900">{profile.userId.slice(0, 8)}...</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">Member Since</span>
                  <span className="text-sm font-medium text-gray-900">{new Date(profile.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Uploaded Documents Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Uploaded Documents
              </h3>
              {!profile.applications.length || !profile.applications.some((app: Application) => app.files.length > 0) ? (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-600 mb-3">No documents uploaded yet.</p>
                  <a href="/apply" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium">
                    Upload documents
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              ) : (
                <>
                  <ul className="space-y-2 mb-4">
                    {profile.applications.flatMap((app: Application) => app.files).map((file: any) => (
                      <li key={file.id} className="flex items-center justify-between text-sm py-2 border-b border-gray-100 last:border-0">
                        <span className="text-gray-700 flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          {file.requirement.label}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          file.status === 'VALID' ? 'bg-green-100 text-green-800' :
                          file.status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {file.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <a href="/apply" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium">
                    Manage documents
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </>
              )}
            </div>

            {/* Notifications Card */}
            {profile.notifications && profile.notifications.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  Notifications
                  <span className="ml-auto text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">{profile.notifications.length}</span>
                </h3>
                <ul className="space-y-3">
                  {profile.notifications.map((notif: any) => (
                    <li key={notif.id} className="border-l-3 border-l-4 border-blue-500 pl-3 py-1">
                      <div className="font-medium text-gray-900 text-sm">{notif.title}</div>
                      {notif.body && <div className="text-gray-600 text-sm mt-1">{notif.body}</div>}
                      <div className="text-xs text-gray-500 mt-1">{new Date(notif.createdAt).toLocaleDateString()}</div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
