"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthChange } from "@/lib/firebase/auth";
import { User } from "firebase/auth";

export function useAuth(requireAuth: boolean = false) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
      setLoading(false);

      if (requireAuth && !user) {
        router.push("/signin");
      }
    });

    return () => unsubscribe();
  }, [requireAuth, router]);

  return { user, loading };
}
