"use client";

import {
  useEffect,
  useState,
} from "react";

import { User } from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase";

export function useAuth() {
  const [user, setUser] =
    useState<User | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadUser() {
      const {
        data: { session },
      } =
        await supabase.auth.getSession();

      setUser(session?.user || null);

      setLoading(false);
    }

    loadUser();

    const {
      data: listener,
    } =
      supabase.auth.onAuthStateChange(
        (_event, session) => {
          setUser(
            session?.user || null
          );
        }
      );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    loading,
  };
}