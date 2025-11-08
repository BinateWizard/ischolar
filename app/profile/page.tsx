import { getUserProfile } from "@/lib/actions/profile";
import { requireAuth } from "@/lib/auth";
import SignOutButton from "@/components/SignOutButton";

type ProfileData = NonNullable<Awaited<ReturnType<typeof getUserProfile>>>;
type Application = ProfileData['applications'][number];

export default async function ProfilePage() {
  const user = await requireAuth();
  const profile = await getUserProfile();

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
  <div className="snap-start min-h-[calc(100vh-5rem)] py-10 px-4 bg-gradient-to-b from-white to-slate-50">
      <div className="w-full max-w-5xl mx-auto grid lg:grid-cols-[1.2fr_1fr] gap-8">
        {/* Profile Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
            <div className="flex items-center gap-3">
              <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Edit</button>
              <SignOutButton />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <div className="rounded-lg border border-gray-200 px-3 py-2 bg-gray-50 text-gray-800">{profile.lastName || 'Not set'}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <div className="rounded-lg border border-gray-200 px-3 py-2 bg-gray-50 text-gray-800">{profile.firstName || 'Not set'}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Middle Initial</label>
              <div className="rounded-lg border border-gray-200 px-3 py-2 bg-gray-50 text-gray-800">{profile.middleInitial || 'N/A'}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Student Number</label>
              <div className="rounded-lg border border-gray-200 px-3 py-2 bg-gray-50 text-gray-800">{profile.studentNumber || 'Not set'}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="rounded-lg border border-gray-200 px-3 py-2 bg-gray-50 text-gray-800">{profile.email}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Campus</label>
              <div className="rounded-lg border border-gray-200 px-3 py-2 bg-gray-50 text-gray-800">{profile.campus || 'Not set'}</div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Scholarship Applications</h2>
            <div className="grid gap-4">
              {profile.applications.length === 0 ? (
                <p className="text-gray-600">No applications yet.</p>
              ) : (
                profile.applications.map((app: Application) => (
                  <div key={app.id} className="rounded-xl border border-gray-200 p-4 bg-gray-50">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="font-medium text-gray-900">{app.programCycle.program.name}</div>
                        <div className="text-sm text-gray-600">{app.programCycle.ayTerm}</div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full border ${
                        app.status === 'SUBMITTED' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        app.status === 'APPROVED' ? 'bg-green-50 text-green-700 border-green-200' :
                        app.status === 'DENIED' ? 'bg-red-50 text-red-700 border-red-200' :
                        app.status === 'IN_VERIFICATION' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        'bg-gray-50 text-gray-700 border-gray-200'
                      }`}>{app.status.replace(/_/g, ' ')}</span>
                    </div>
                    <div className="mt-3 text-sm text-gray-600 flex items-center gap-4">
                      <span>Submitted: {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : 'Not submitted'}</span>
                      {app.score && <span>Score: {app.score}</span>}
                    </div>
                    <div className="mt-3">
                      <a href="/status" className="text-sm text-blue-600 hover:text-blue-700">View status →</a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Uploaded Documents</h3>
            {!profile.applications.length || !profile.applications.some((app: Application) => app.files.length > 0) ? (
              <p className="text-sm text-gray-600">No documents uploaded yet.</p>
            ) : (
              <ul className="text-sm text-gray-700 space-y-2">
                {profile.applications.flatMap((app: Application) => app.files).map((file: any) => (
                  <li key={file.id} className="flex items-center justify-between">
                    <span>{file.requirement.label}</span>
                    <span className={`text-xs px-2 py-1 rounded-full border ${
                      file.status === 'VALID' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      file.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-red-50 text-red-700 border-red-200'
                    }`}>{file.status}</span>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-4">
              <a href="/apply" className="text-sm text-blue-600 hover:text-blue-700">Upload documents →</a>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Account Info</h3>
            <div className="text-sm text-gray-700 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Role:</span>
                <span className="font-medium">{profile.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">User ID:</span>
                <span className="font-mono text-xs">{profile.userId.slice(0, 8)}...</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Created:</span>
                <span>{new Date(profile.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {profile.notifications && profile.notifications.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Notifications</h3>
              <ul className="text-sm space-y-3">
                {profile.notifications.map((notif: any) => (
                  <li key={notif.id} className="border-l-2 border-blue-500 pl-3">
                    <div className="font-medium text-gray-900">{notif.title}</div>
                    {notif.body && <div className="text-gray-600 mt-1">{notif.body}</div>}
                    <div className="text-xs text-gray-500 mt-1">{new Date(notif.createdAt).toLocaleDateString()}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
