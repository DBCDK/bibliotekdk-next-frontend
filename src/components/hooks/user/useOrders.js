/**
 * @file - userLoans
 * Get user loans along with various possible errors
 */

import { useData } from "@/lib/api/api";
import { userOrders } from "@/lib/api/user.fragments";

export default function useOrders() {
  const { data, isLoading, mutate: mutateOrder } = useData(userOrders());
  const status = data?.user?.orders?.status;
  const statusCode = data?.user?.orders?.statusCode;
  const orders = data?.user?.orders?.result || [];

  return {
    updateOrders: async () => {
      await mutateOrder();
    },
    orders,
    status,
    statusCode,
    isLoading,
  };
}
