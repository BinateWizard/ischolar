"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function SignOutButton() {
  const supabase = createSupabaseBrowserClient();
  return (
    <button
      className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
      onClick={async () => {
        await supabase.auth.signOut();
        window.location.href = "/";
      }}
    >
      Sign Out
    </button>
  );
}
