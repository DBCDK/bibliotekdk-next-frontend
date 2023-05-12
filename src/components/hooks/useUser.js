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
const mockLoans = [
  {
    loanId: "120200553",
    dueDate: "2023-01-31T23:00:00.000Z",
    manifestation: {
      pid: "870970-basis:51098838",
      titles: {
        main: ["One Direction"],
      },
      creators: [
        {
          display: "Sarah Delmege",
        },
      ],
      materialTypes: [
        {
          specific: "bog",
        },
      ],
      cover: {
        thumbnail:
          "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=51098838&attachment_type=forside_lille&bibliotek=870970&source_id=150020&key=f4ebcbb4b84cf26e7071",
      },
      recordCreationDate: "20140508",
    },
  },
  {
    loanId: "120200589",
    dueDate: "2023-05-06T22:00:00.000Z",
    manifestation: {
      pid: "870970-basis:23424916",
      titles: {
        main: ["Efter uvejret"],
      },
      creators: [
        {
          display: "Lauren Brooke",
        },
      ],
      materialTypes: [
        {
          specific: "bog",
        },
      ],
      cover: {
        thumbnail:
          "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=23424916&attachment_type=forside_lille&bibliotek=870970&source_id=870970&key=72fda7f507bed4f70854",
      },
      recordCreationDate: "20010323",
    },
  },
  {
    loanId: "120200590",
    dueDate: "2023-05-04T22:00:00.000Z",
    manifestation: {
      pid: "870970-basis:23518260",
      titles: {
        main: ["Vennebogen & Koglerier"],
      },
      creators: [
        {
          display: "Peer Hultberg",
        },
      ],
      materialTypes: [
        {
          specific: "bog",
        },
      ],
      cover: {
        thumbnail:
          "https://default-forsider.dbc.dk/covers-12/thumbnail/4f0789e9-b478-526d-879e-a5931d9c552e.jpg",
      },
      recordCreationDate: "20010529",
    },
  },
];

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
    isLoggedIn: true,
    loanerInfo: { ...data, userParameters: { ...loggedInUser } },
    updateLoanerInfo: (obj) => {
      // Update global loaner info object
      loanerInfoMock = { ...loanerInfoMock, ...obj };

      // Broadcast update
      mutate(useUserMockKey);
    },
    loans: mockLoans,
    reservations: [],
    fines: [],
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
      userParameters: { ...loggedInUser, ...sessionCopy?.userParameters },
    };
  }, [data?.session, loggedInUser]);

  console.log(loanerInfo);

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
