"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useAuth(requireAuth: boolean = false) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const loading = status === "loading";
  const user = session?.user;

  useEffect(() => {
    if (requireAuth && !loading && !user) {
      router.push("/signin");
    }
  }, [requireAuth, loading, user, router]);

  return { user, loading, session };
}
