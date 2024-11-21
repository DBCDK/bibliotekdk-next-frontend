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
