import { useSession } from "next-auth/client";
import useSWR from "swr";
import { createContext, useContext, useMemo, useEffect, useState } from "react";
import merge from "lodash/merge";

import { useData, useMutate } from "@/lib/api/api";
import * as userFragments from "@/lib/api/user.fragments";
import * as sessionFragments from "@/lib/api/session.fragments";
import fetch from "isomorphic-unfetch";

// Context for storing anonymous session
export const AnonymousSessionContext = createContext();

import getConfig from "next/config";
import nookies, { parseCookies, setCookie, destroyCookie } from "nookies";
import { log } from "dbc-node-logger";

// in memory object for storing loaner info for current user
let loanerInfoMock = {};
const loanerInfoKey = "loanerinfo";

/**
 * Mock used in storybook
 */
function useAccessTokenMock() {
  return "dummy-token";
}

/**
 * Mock used in storybook
 */
function useUserMock() {
  const useUserMockKey = "useUserMock";

  const { data, mutate } = useSWR(useUserMockKey, () => loanerInfoMock, {
    initialData: loanerInfoMock
  });

  const authUser = { name: "Some Name", mail: "some@mail.dk" };
  const loggedInUser = { userName: authUser.name, userMail: authUser.mail };

  return {
    authUser,
    isLoading: false,
    error: null,
    isAuthenticated: true,
    loanerInfo: { ...data, ...loggedInUser },
    updateLoanerInfo: (obj) => {
      // Update global loaner info object
      loanerInfoMock = { ...loanerInfoMock, ...obj };

      // Broadcast update
      mutate(useUserMockKey);
    }
  };
}

// hold anonymous session
let anonSession;

/**
 * Hook for getting and storing loaner info
 */
function useUserImpl() {
  // Fetch loaner info from session
  const { data, mutate } = useData(sessionFragments.session());

  const [session] = useSession();

  const sessionMutate = useMutate();

  const isAuthenticated = !!session?.user?.uniqueId;

  const {
    data: userData,
    isLoading: userIsLoading,
    error: userDataError
  } = useData(isAuthenticated && userFragments.basic());

  let loggedInUser = {};
  if (userData) {
    const user = userData.user;
    if (user.name) {
      loggedInUser.userName = user.name;
    }
    if (user.mail) {
      loggedInUser.userMail = user.mail;
    }
  }

  const loanerInfo = useMemo(() => {
    const sessionCopy = data?.session;

    // delete all keys with no value
    if (sessionCopy) {
      Object.keys(sessionCopy?.userParameters).forEach((key) => {
        if (!sessionCopy?.userParameters[key]) {
          delete sessionCopy?.userParameters[key];
        }
      });
    }

    const obj = {
      ...data?.session,
      userParameters: { ...loggedInUser, ...sessionCopy?.userParameters }
    };

    return obj;
  }, [data?.session, loggedInUser]);

  const isGuestUser =
    !isAuthenticated && Object.keys(loanerInfo?.userParameters).length > 0;

  return {
    authUser: userData?.user || {},
    isLoading: userIsLoading,
    error: userDataError,
    isAuthenticated,
    loanerInfo,
    isGuestUser,
    isLoggedIn: isAuthenticated || isGuestUser,
    updateLoanerInfo: async (obj) => {
      const newSession = merge({}, loanerInfo, obj);
      // Update global loaner info object
      await sessionMutate.post(sessionFragments.submitSession(newSession));

      // Broadcast update
      await mutate();
    },
    guestLogout: async () => {
      // Delete global loaner info object
      await sessionMutate.post(sessionFragments.deleteSession());
      // Broadcast update
      await mutate();
    }
  };
}

let sess;

async function fetchSession() {
  // get the data from anonsession @see /api/auth/anonsession.js
  const anonSessionRes = await fetch(
    `${APP_URL}/api/auth/anonsession?jwt=${sess?.jwt}`
  );
  sess = await anonSessionRes.json();
  return sess;

}

const APP_URL =
  getConfig()?.publicRuntimeConfig?.app?.url || "http://localhost:3000";

/**
 * Hook for getting authenticated user
 */
function useAccessTokenImpl() {
  const [session] = useSession();
  const anonSessionContext = useContext(AnonymousSessionContext);

  // anonSessionContext becomes undefined when nextjs changes page without calling server
  // we store the latest anon session we got from the server
  if (anonSessionContext) {
    anonSession = anonSessionContext;
  }
  // @USEFFECT HERE - sometimes we lose our anonymous token - try to fix it here
  useEffect(() => {
    let done = false;
    // only get the seseeion if we lost the accesstoken
    if (!anonSession?.accessToken) {
      const fetchAnonymous = async () => {
        // get anonymous session
        const sess = await fetchSession();
        if (!done) {
          // set our
          anonSession = sess.session;
        }
      };

      // get anonymous session
      fetchAnonymous().catch(() => log.error("NO anonymous session"));
      // only do it once
      return () => done = true; 
    }
  }, [anonSession?.accessToken]);

  return session?.accessToken || anonSession?.accessToken;
}

const useUser = process.env.STORYBOOK_ACTIVE ? useUserMock : useUserImpl;

export default useUser;

const useAccessToken = process.env.STORYBOOK_ACTIVE
  ? useAccessTokenMock
  : useAccessTokenImpl;

export { useAccessToken };
