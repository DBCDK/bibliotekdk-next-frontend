import { useData } from "@/lib/api/api";
import * as userFragments from "@/lib/api/user.fragments";
import { useAuthentication } from "./useAuthentication";

/**
 * Hook for broadcasting that userStatusInfo changed (loans, orders)
 *
 * Considerations:
 * Should we move the actual FBI-API request that change
 * loans and orders to this hook?
 *
 */
export default function useUserStatusInfo() {
  const { isAuthenticated } = useAuthentication();

  const { data: userData, mutate: userMutate } = useData(
    isAuthenticated && userFragments.basic()
  );

  return {
    updateUserStatusInfo: async (type) => {
      // Broadcast update about either loans or orders
      let updatedData;
      switch (type) {
        case "LOAN":
          updatedData = { loans: userData?.user?.loans };
          break;
        case "ORDER":
          updatedData = { orders: userData?.user?.orders };
          break;
        default:
          break;
      }
      if (updatedData) await userMutate(updatedData);
    },
  };
}
