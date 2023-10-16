import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import useVerification from "@/components/hooks/useVerification";
import { useAccessToken } from "@/components/hooks/useUser";
import useUser from "@/components/hooks/useUser";
import { useModal } from "@/components/_modal";

export function Listener() {
  return "hest";
}

export default function Wrap() {
  const user = useUser();

  const { authUser, isAuthenticated, hasCulrUniqueId } = user;

  const agencyId = authUser.loggedInBranchId;

  const accessToken = useAccessToken();
  const verification = useVerification();
  const router = useRouter();
  const modal = useModal();

  const data = verification.read();

  return <Listener />;
}
