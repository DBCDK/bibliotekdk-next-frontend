import { useSession } from "next-auth/react";
import useSWR from "swr";
import { createContext, useMemo } from "react";
import merge from "lodash/merge";
import { useData, useMutate } from "@/lib/api/api";
import * as userFragments from "@/lib/api/user.fragments";
import * as sessionFragments from "@/lib/api/session.fragments";

// Context for storing anonymous session
export const AnonymousSessionContext = createContext();

// in memory object for storing loaner info for current user
let loanerInfoMock = {};

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
  const authUser = { name: "Some Name", mail: "some@mail.dk" };
  const loggedInUser = { userName: authUser.name, userMail: authUser.mail };
  const { data, mutate } = useSWR(useUserMockKey, () => loanerInfoMock, {
    initialData: loanerInfoMock,
  });

  return {
    authUser,
    isLoading: false,
    error: null,
    isAuthenticated: true,
    isLoggedIn: true,
    loanerInfo: { ...data, userParameters: { ...loggedInUser } },
    updateLoanerInfo: (obj) => {
      // Update global loaner info object
      loanerInfoMock = { ...loanerInfoMock, ...obj };

      // Broadcast update
      mutate(useUserMockKey);
    },
  };
}

/**
 * Hook for getting and storing loaner info
 */
function useUserImpl() {
  // Fetch loaner info from session
  const { data, mutate } = useData(sessionFragments.session());
  const { data: session } = useSession();
  const sessionMutate = useMutate();
  const isAuthenticated = !!session?.user?.uniqueId;

  const {
    data: userData,
    isLoading: userIsLoading,
    error: userDataError,
  } = useData(isAuthenticated && userFragments.basic());

  let loggedInUser = {};
  if (userData?.user) {
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
    return {
      ...data?.session,
      debt: userData?.user?.debt || [],
      loans: userData?.user?.loans || [],
      orders: userData?.user?.orders || [],
      userParameters: { ...loggedInUser, ...sessionCopy?.userParameters },
    };
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
    },
  };
}

/**
 * Hook for getting authenticated user
 */
function useAccessTokenImpl() {
  const { data: session } = useSession();

  return session?.accessToken;
}

const useUser = process.env.STORYBOOK_ACTIVE ? useUserMock : useUserImpl;

export default useUser;

const useAccessToken = process.env.STORYBOOK_ACTIVE
  ? useAccessTokenMock
  : useAccessTokenImpl;

export { useAccessToken };
