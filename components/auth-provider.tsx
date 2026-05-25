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
    let mounted = true;

    async function loadUser() {
      try {
        setLoading(true);

        const {
          data: { session },
        } =
          await supabase.auth.getSession();

        if (!mounted) {
          return;
        }

        const authUser =
          session?.user || null;

        setUser(authUser);

        if (authUser) {
          const createdProfile =
            await ensureProfile(
              authUser
            );

          if (!mounted) {
            return;
          }

          setProfile(
            createdProfile
          );
        } else {
          setProfile(null);
        }
      } catch (error) {
        console.error(
          "AUTH LOAD ERROR:",
          error
        );

        if (mounted) {
          setProfile(null);

          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadUser();

    /*
      LIVE AUTH CHANGES
    */

    const {
      data: listener,
    } =
      supabase.auth.onAuthStateChange(
        async (
          _event,
          session
        ) => {
          try {
            if (!mounted) {
              return;
            }

            setLoading(true);

            const authUser =
              session?.user ||
              null;

            setUser(authUser);

            if (authUser) {
              const createdProfile =
                await ensureProfile(
                  authUser
                );

              if (!mounted) {
                return;
              }

              setProfile(
                createdProfile
              );
            } else {
              setProfile(null);
            }
          } catch (error) {
            console.error(
              "AUTH STATE ERROR:",
              error
            );

            if (mounted) {
              setProfile(null);

              setUser(null);
            }
          } finally {
            if (mounted) {
              setLoading(false);
            }
          }
        }
      );

    return () => {
      mounted = false;

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
  return useContext(
    AuthContext
  );
}