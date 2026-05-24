"use client";

import {
  useEffect,
  useState,
} from "react";

import { User } from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase";

import { ensureProfile } from "@/lib/profile-sync";

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

      const authUser =
        session?.user || null;

      setUser(authUser);

      if (authUser) {
        await ensureProfile(
          authUser
        );
      }

      setLoading(false);
    }

    loadUser();

    const {
      data: listener,
    } =
      supabase.auth.onAuthStateChange(
        async (
          _event,
          session
        ) => {
          const authUser =
            session?.user || null;

          setUser(authUser);

          if (authUser) {
            await ensureProfile(
              authUser
            );
          }
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