"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { User } from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase";

import { ensureProfile } from "@/lib/profile-sync";

interface AuthContextType {
  user: User | null;

  profile: any;

  loading: boolean;
}

const AuthContext =
  createContext<AuthContextType>({
    user: null,

    profile: null,

    loading: true,
  });

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] =
    useState<User | null>(null);

  const [profile, setProfile] =
    useState<any>(null);

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
        const createdProfile =
          await ensureProfile(
            authUser
          );

        setProfile(
          createdProfile
        );
      } else {
        setProfile(null);
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
            const createdProfile =
              await ensureProfile(
                authUser
              );

            setProfile(
              createdProfile
            );
          } else {
            setProfile(null);
          }
        }
      );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,

        profile,

        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}