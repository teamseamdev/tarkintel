"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type {
  Session,
  User,
} from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase";

import { ensureProfile } from "@/lib/profile-sync";

interface UserProfile {
  id: string;

  email?: string;

  player_level_override?:
    number | null;
}

interface AuthContextType {
  user: User | null;

  profile: UserProfile | null;

  session: Session | null;

  loading: boolean;
}

const AuthContext =
  createContext<AuthContextType>({
    user: null,

    profile: null,

    session: null,

    loading: true,
  });

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  /*
    STATE
  */

  const [user, setUser] =
    useState<User | null>(null);

  const [
    profile,
    setProfile,
  ] = useState<UserProfile | null>(
    null
  );

  const [
    session,
    setSession,
  ] =
    useState<Session | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  /*
    LOAD + HYDRATE
  */

  useEffect(() => {
    let mounted = true;

    async function hydrateAuth() {
      try {
        setLoading(true);

        /*
          SESSION
        */

        const {
          data,
          error,
        } =
          await supabase.auth.getSession();

        if (error) {
          console.error(
            "GET SESSION ERROR:",
            error
          );
        }

        if (!mounted) {
          return;
        }

        const activeSession =
          data.session || null;

        const authUser =
          activeSession?.user ||
          null;

        /*
          DEBUG
        */

        console.log(
          "AUTH SESSION:",
          activeSession
        );

        console.log(
          "AUTH USER:",
          authUser
        );

        /*
          STATE
        */

        setSession(
          activeSession
        );

        setUser(authUser);

        /*
          PROFILE
        */

        if (authUser) {
          try {
            const ensuredProfile =
              await ensureProfile(
                authUser
              );

            if (!mounted) {
              return;
            }

            console.log(
              "PROFILE:",
              ensuredProfile
            );

            setProfile(
              ensuredProfile
            );
          } catch (
            profileError
          ) {
            console.error(
              "PROFILE LOAD ERROR:",
              profileError
            );

            if (
              mounted
            ) {
              setProfile(
                null
              );
            }
          }
        } else {
          setProfile(null);
        }
      } catch (error) {
        console.error(
          "AUTH HYDRATION ERROR:",
          error
        );

        if (mounted) {
          setSession(null);

          setUser(null);

          setProfile(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    hydrateAuth();

    /*
      LIVE AUTH EVENTS
    */

    const {
      data: listener,
    } =
      supabase.auth.onAuthStateChange(
        async (
          event,
          nextSession
        ) => {
          try {
            console.log(
              "AUTH EVENT:",
              event
            );

            console.log(
              "NEXT SESSION:",
              nextSession
            );

            if (!mounted) {
              return;
            }

            setLoading(true);

            const authUser =
              nextSession?.user ||
              null;

            /*
              STATE
            */

            setSession(
              nextSession
            );

            setUser(authUser);

            /*
              PROFILE
            */

            if (authUser) {
              const ensuredProfile =
                await ensureProfile(
                  authUser
                );

              if (
                !mounted
              ) {
                return;
              }

              console.log(
                "SYNCED PROFILE:",
                ensuredProfile
              );

              setProfile(
                ensuredProfile
              );
            } else {
              setProfile(null);
            }
          } catch (error) {
            console.error(
              "AUTH STATE CHANGE ERROR:",
              error
            );

            if (mounted) {
              setSession(null);

              setUser(null);

              setProfile(null);
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

        session,

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