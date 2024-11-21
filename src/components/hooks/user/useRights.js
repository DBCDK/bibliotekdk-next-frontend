import { useData } from "@/lib/api/api";
import { userRights } from "@/lib/api/user.fragments";

export default function useRights() {
  // Fetch authentication data stored in fbi-api
  const { data, isLoading } = useData(userRights());

  const rights = data?.user?.rights;

  return {
    isLoading,
    rights,
  };
}
