import { useState, useEffect, useCallback } from "react";
import {
  getLocalStorageItem,
  setLocalStorageItem,
  removeLocalStorageItem,
} from "@/lib/utils";

const LAST_LOGIN_BRANCH_KEY = "LAST_LOGIN_BRANCH_ID";

export const useLastLoginBranch = () => {
  const [lastLoginBranch, setBranch] = useState(null);

  useEffect(() => {
    const branch = getLocalStorageItem(LAST_LOGIN_BRANCH_KEY);
    //todo json parse?
    setLastLoginBranch(JSON.parse(branch));
  }, []);

  const setLastLoginBranch = useCallback((branch) => {
    setLocalStorageItem(LAST_LOGIN_BRANCH_KEY, JSON.stringify(branch));
    setBranch(branch);
  }, []);

  const removeLastLoginBranch = useCallback(() => {
    removeLocalStorageItem(LAST_LOGIN_BRANCH_KEY);
    setLastLoginBranch(null);
  }, []);

  return { lastLoginBranch, setLastLoginBranch, removeLastLoginBranch };
};
