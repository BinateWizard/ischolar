"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
      onClick={async () => {
        await signOut({ callbackUrl: '/' });
      }}
    >
      Sign Out
    </button>
  );
}
