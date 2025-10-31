"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

/**
 * Custom hook to fetch logged-in user data from API
 */
export default function useAuthUser() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (status === "authenticated" && session?.user?.email) {
        try {
          // Fetch all users
          const res = await fetch("/api/users");
          const users = await res.json();

          const currentUser = users.find(u => u.email === session.user.email);
          setUser(currentUser || null);
        } catch (error) {
          console.error(error);
          setUser(null);
        } finally {
          setLoading(false);
        }
      } else if (status !== "loading") {
        setLoading(false);
      }
    };

    fetchUser();
  }, [status, session]);

  return { user, loading, session };
}
