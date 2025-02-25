/**
 * @file - userLoans
 * Get user loans along with various possible errors
 */

import { useData } from "@/lib/api/api";
import { userLoans } from "@/lib/api/user.fragments";

export default function useLoans() {
  const { data, isLoading } = useData(userLoans());
  const status = data?.user?.loans?.status;
  const statusCode = data?.user?.loans?.statusCode;
  const loans = data?.user?.loans?.result || [];

  return { loans, status, statusCode, isLoading };
}
