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

  const [
    authLoading,
    setAuthLoading,
  ] = useState(true);

  const [
    profileLoading,
    setProfileLoading,
  ] = useState(false);

  /*
    LOAD + HYDRATE
  */

  useEffect(() => {
    let mounted = true;

    let authEventReceived =
      false;

    /*
      LIVE AUTH EVENTS

      Keep this callback synchronous.
      Profile loading happens in a
      separate effect below.
    */

    const {
      data: listener,
    } =
      supabase.auth.onAuthStateChange(
        (
          event,
          nextSession
        ) => {
          if (!mounted) {
            return;
          }

          authEventReceived =
            true;

          const authUser =
            nextSession?.user ||
            null;

          console.log(
            "AUTH EVENT:",
            event
          );

          console.log(
            "NEXT SESSION:",
            nextSession
          );

          setSession(
            nextSession
          );

          setUser(authUser);

          setAuthLoading(
            false
          );

          if (!authUser) {
            setProfile(null);

            setProfileLoading(
              false
            );
          } else {
            setProfileLoading(
              true
            );
          }
        }
      );

    async function hydrateAuth() {
      try {
        setAuthLoading(
          true
        );

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

        if (
          !mounted ||
          authEventReceived
        ) {
          return;
        }

        const activeSession =
          data.session || null;

        const authUser =
          activeSession?.user ||
          null;

        console.log(
          "AUTH SESSION:",
          activeSession
        );

        console.log(
          "AUTH USER:",
          authUser
        );

        setSession(
          activeSession
        );

        setUser(authUser);

        if (!authUser) {
          setProfile(null);

          setProfileLoading(
            false
          );
        } else {
          setProfileLoading(
            true
          );
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

          setProfileLoading(
            false
          );
        }
      } finally {
        if (
          mounted &&
          !authEventReceived
        ) {
          setAuthLoading(
            false
          );
        }
      }
    }

    hydrateAuth();

    return () => {
      mounted = false;

      listener.subscription.unsubscribe();
    };
  }, []);

  /*
    PROFILE SYNC

    This is intentionally separate
    from onAuthStateChange so database
    requests do not block Supabase's
    auth event handling.
  */

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      if (!user) {
        setProfile(null);

        setProfileLoading(
          false
        );

        return;
      }

      try {
        setProfileLoading(
          true
        );

        const ensuredProfile =
          await ensureProfile(
            user
          );

        if (cancelled) {
          return;
        }

        console.log(
          "SYNCED PROFILE:",
          ensuredProfile
        );

        setProfile(
          ensuredProfile
        );
      } catch (error) {
        console.error(
          "PROFILE LOAD ERROR:",
          error
        );

        if (!cancelled) {
          setProfile(null);
        }
      } finally {
        if (!cancelled) {
          setProfileLoading(
            false
          );
        }
      }
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const loading =
    authLoading ||
    (
      Boolean(user) &&
      profileLoading
    );

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