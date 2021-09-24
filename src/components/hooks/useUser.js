import { useSession } from "next-auth/client";
import useSWR, { mutate } from "swr";
import { createContext, useContext, useMemo } from "react";

import { useData } from "@/lib/api/api";
import * as userFragments from "@/lib/api/user.fragments";

// Context for storing anonymous session
export const AnonymousSessionContext = createContext();

// in memory object for storing loaner info for current user
let loanerInfo = {};
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

  const { data } = useSWR(useUserMockKey, () => loanerInfoMock, {
    initialData: loanerInfoMock,
  });

  const loggedInUser = { name: "Some Name", mail: "some@mail.dk" };

  return {
    authUser: loggedInUser,
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
  // Fetch loaner info
  // Note that this is not fetching from API, but local in-memory object
  const { data } = useSWR(loanerInfoKey, () => loanerInfo, {
    initialData: loanerInfo,
  });

  const [session] = useSession();

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
  }

  return {
    authUser: userData?.user || {},
    isLoading: userIsLoading,
    error: userDataError,
    isAuthenticated,
    loanerInfo: { ...data, ...loggedInUser },
    updateLoanerInfo: (obj) => {
      // Update global loaner info object
      loanerInfo = { ...loanerInfo, ...obj };

      // Broadcast update
      mutate(loanerInfoKey);
    },
  };
}

/**
 * Hook for getting authenticated user
 */
// export function useUser() {
//   const [session] = useSession();
//   const anonSessionContext = useContext(AnonymousSessionContext);

//   // anonSessionContext becomes undefined when nextjs changes page without calling server
//   // we store the latest anon session we got from the server
//   if (anonSessionContext) {
//     anonSession = anonSessionContext;
//   }
//   const accessToken = session?.accessToken || anonSession?.accessToken;

//   return {
//     isAuthenticated: !!session?.user?.uniqueId,
//     accessToken,
//   };
// }

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
