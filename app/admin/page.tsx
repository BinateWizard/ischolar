"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { useEffect, useState } from "react";
import Link from "next/link";

interface DashboardStats {
  totalUsers: number;
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  pendingVerifications: number;
  activePrograms: number;
  recentUsers: Array<{
    id: string;
    name: string;
    email: string;
    createdAt: string;
  }>;
  recentApplications: Array<{
    id: string;
    applicantName: string;
    program: string;
    status: string;
    createdAt: string;
  }>;
}

interface Notification {
  id: string;
  title: string;
  body: string | null;
  type: string;
  priority: string;
  actionUrl: string | null;
  createdAt: string;
  isRead: boolean;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, notifRes] = await Promise.all([
          fetch('/api/admin/dashboard'),
          fetch('/api/notifications?limit=5&unread=true'),
        ]);
        
        const statsData = await statsRes.json();
        const notifData = await notifRes.json();
        
        setStats(statsData);
        setNotifications(notifData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      color: 'blue',
      href: '/admin/users',
    },
    {
      title: 'Total Applications',
      value: stats?.totalApplications || 0,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'purple',
      href: '/admin/applications',
    },
    {
      title: 'Pending Reviews',
      value: stats?.pendingApplications || 0,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'yellow',
      href: '/admin/applications?status=pending',
    },
    {
      title: 'Approved',
      value: stats?.approvedApplications || 0,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'green',
      href: '/admin/applications?status=approved',
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name || 'Admin'}! Here's what's happening with iScholar.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-2">{card.title}</p>
                <p className="text-3xl font-bold text-gray-900">{card.value}</p>
              </div>
              <div className={`p-3 rounded-lg bg-${card.color}-50 text-${card.color}-600`}>
                {card.icon}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Alerts & Notifications */}
      {notifications.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">⚠️ Important Alerts</h2>
          <div className="space-y-3">
            {notifications.filter(n => n.priority === 'URGENT' || n.priority === 'HIGH').slice(0, 3).map((notif) => (
              <div
                key={notif.id}
                className={`p-4 rounded-lg border-l-4 ${
                  notif.priority === 'URGENT'
                    ? 'bg-red-50 border-red-500'
                    : 'bg-orange-50 border-orange-500'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className={`font-semibold ${
                      notif.priority === 'URGENT' ? 'text-red-900' : 'text-orange-900'
                    }`}>
                      {notif.title}
                    </h3>
                    {notif.body && (
                      <p className={`text-sm mt-1 ${
                        notif.priority === 'URGENT' ? 'text-red-700' : 'text-orange-700'
                      }`}>
                        {notif.body}
                      </p>
                    )}
                  </div>
                  {notif.actionUrl && (
                    <Link
                      href={notif.actionUrl}
                      className={`ml-4 px-4 py-2 rounded-lg text-sm font-medium ${
                        notif.priority === 'URGENT'
                          ? 'bg-red-600 text-white hover:bg-red-700'
                          : 'bg-orange-600 text-white hover:bg-orange-700'
                      } transition-colors`}
                    >
                      View Details
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pending Actions Card */}
      {(stats?.pendingApplications || stats?.pendingVerifications || 0) > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-bold text-yellow-900">Pending Actions Required</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats?.pendingApplications && stats.pendingApplications > 0 && (
              <Link 
                href="/admin/applications?status=submitted"
                className="flex items-center justify-between p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
              >
                <div>
                  <p className="text-sm text-gray-600">Applications to Review</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingApplications}</p>
                </div>
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </Link>
            )}
            {stats?.pendingVerifications && stats.pendingVerifications > 0 && (
              <Link
                href="/admin/verifications"
                className="flex items-center justify-between p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
              >
                <div>
                  <p className="text-sm text-gray-600">Accounts to Verify</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingVerifications}</p>
                </div>
                <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <h3 className="font-semibold text-lg mb-2">Quick Actions</h3>
          <div className="space-y-2">
            <Link href="/admin/users" className="block py-2 px-4 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
              Manage Users
            </Link>
            <Link href="/admin/programs" className="block py-2 px-4 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
              Create Program
            </Link>
            <Link href="/admin/reports" className="block py-2 px-4 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
              View Reports
            </Link>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-lg mb-4 text-gray-900">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Active Programs</span>
              <span className="font-semibold text-gray-900">{stats?.activePrograms || 0}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Pending Verifications</span>
              <span className="font-semibold text-yellow-600">{stats?.pendingVerifications || 0}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600">System Status</span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="font-semibold text-green-600">Online</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg text-gray-900">Recent Users</h3>
            <Link href="/admin/users" className="text-blue-600 text-sm hover:text-blue-700">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {stats?.recentUsers && stats.recentUsers.length > 0 ? (
              stats.recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm text-center py-4">No recent users</p>
            )}
          </div>
        </div>

        {/* Recent Applications */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg text-gray-900">Recent Applications</h3>
            <Link href="/admin/applications" className="text-blue-600 text-sm hover:text-blue-700">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {stats?.recentApplications && stats.recentApplications.length > 0 ? (
              stats.recentApplications.map((app) => (
                <div key={app.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{app.applicantName}</p>
                    <p className="text-xs text-gray-500">{app.program}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      app.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                      app.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                      app.status === 'DENIED' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm text-center py-4">No recent applications</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
