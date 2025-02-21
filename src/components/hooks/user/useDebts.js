/**
 * @file - useDebts
 * Get user debts along with various possible errors
 */

import { useData } from "@/lib/api/api";
import { userDebts } from "@/lib/api/user.fragments";

export default function useDebts() {
  const { data, isLoading } = useData(userDebts());

  const status = data?.user?.debt?.status;
  const statusCode = data?.user?.debt?.statusCode;
  const debt = data?.user?.debt?.result || [];

  return { debt: debt, status, statusCode, isLoading };
}
