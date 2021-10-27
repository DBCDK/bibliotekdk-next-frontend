import { useSession } from "next-auth/client";
import useSWR from "swr";
import { createContext, useContext, useMemo } from "react";
import merge from "lodash/merge";

import { useData, useMutate } from "@/lib/api/api";
import * as userFragments from "@/lib/api/user.fragments";
import * as sessionFragments from "@/lib/api/session.fragments";

// Context for storing anonymous session
export const AnonymousSessionContext = createContext();

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
    initialData: loanerInfoMock,
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
    },
  };
}

//
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
    error: userDataError,
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
    if (user.agency && user.agency.result) {
      loggedInUser.agencies = user.agency.result;
    }
  }

  const loanerInfo = useMemo(() => {
    const obj = {
      ...data?.session,
      userParameters: { ...loggedInUser, ...data?.session?.userParameters },
    };
    // delete all keys with no value
    Object.keys(obj.userParameters).forEach((key) => {
      if (!obj.userParameters[key]) {
        delete obj.userParameters[key];
      }
    });
    return obj;
  }, [data?.session, loggedInUser]);

  return {
    authUser: userData?.user || {},
    isLoading: userIsLoading,
    error: userDataError,
    isAuthenticated,
    loanerInfo,
    updateLoanerInfo: async (obj) => {
      const newSession = merge({}, loanerInfo, obj);
      // Update global loaner info object
      await sessionMutate.post(sessionFragments.submitSession(newSession));

      // Broadcast update
      await mutate();
    },
  };
}

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

  return session?.accessToken || anonSession?.accessToken;
}

const useUser = process.env.STORYBOOK_ACTIVE ? useUserMock : useUserImpl;

export default useUser;

const useAccessToken = process.env.STORYBOOK_ACTIVE
  ? useAccessTokenMock
  : useAccessTokenImpl;

export { useAccessToken };
