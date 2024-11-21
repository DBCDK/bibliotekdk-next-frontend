/**
 * @file - userRights
 * Get user rights only - we use them a lot of places
 */
import { useData } from "@/lib/api/api";
import { userRights } from "@/lib/api/user.fragments";

export default function useRights() {
  const { data, isLoading } = useData(userRights());

  const rights = data?.user?.rights;

  return {
    isLoading,
    rights,
  };
}
