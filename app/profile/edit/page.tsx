"use client";

import { getUserProfile } from "@/lib/actions/profile";
import { updateProfile } from "@/lib/actions/profileServer"; // <- server action imported
import { useAuth } from "@/lib/hooks/useAuth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    middleInitial: "",
    studentNumber: "",
    campus: "",
    course: "",
    yearLevel: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!user) return;
      setLoading(true);

      const p = await getUserProfile(user.id);

      if (p) {
        setForm({
          firstName: p.firstName ?? "",
          lastName: p.lastName ?? "",
          middleInitial: p.middleInitial ?? "",
          studentNumber: p.studentNumber ?? "",
          campus: p.campus ?? "",
          course: p.course ?? "",
          yearLevel: p.yearLevel ?? "",
        });
      }

      setLoading(false);
    }

    load();
  }, [user]);

  if (authLoading || loading) return <div className="p-8">Loading...</div>;
  if (!user) return <div className="p-8">User not found.</div>;

  // ✅ Client-side submit handler that calls the server action
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await updateProfile(user.id, {
      firstName: form.firstName,
      lastName: form.lastName,
      middleInitial: form.middleInitial,
      studentNumber: form.studentNumber,
      campus: form.campus,
      course: form.course,
      yearLevel: form.yearLevel,
    });

    router.push("/profile");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 mt-4">
      <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">First Name</label>
          <input
            name="firstName"
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Last Name</label>
          <input
            name="lastName"
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Middle Initial</label>
            <input
              name="middleInitial"
              value={form.middleInitial}
              onChange={(e) =>
                setForm({ ...form, middleInitial: e.target.value })
              }
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Student Number</label>
            <input
              name="studentNumber"
              value={form.studentNumber}
              onChange={(e) =>
                setForm({ ...form, studentNumber: e.target.value })
              }
              className="w-full border p-2 rounded"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Campus</label>
          <input
            name="campus"
            value={form.campus}
            onChange={(e) => setForm({ ...form, campus: e.target.value })}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Course</label>
            <input
              name="course"
              value={form.course}
              onChange={(e) => setForm({ ...form, course: e.target.value })}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Year Level</label>
            <input
              name="yearLevel"
              value={form.yearLevel}
              onChange={(e) => setForm({ ...form, yearLevel: e.target.value })}
              className="w-full border p-2 rounded"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Save Changes
          </button>

          <button
            type="button"
            onClick={() => router.push("/profile")}
            className="px-4 py-2 border rounded-lg"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
