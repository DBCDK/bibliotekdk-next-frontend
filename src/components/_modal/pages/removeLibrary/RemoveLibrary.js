/**
 * @file - this file is a modal page which shows a delete library confirmation modal
 */

import { useEffect } from "react";

import Top from "@/components/_modal/pages/base/top";
import Title from "@/components/base/title";
import Text from "@/components/base/text";
import Button from "@/components/base/button";
import Translate from "@/components/base/translate";

import useLoanerInfo from "@/components/hooks/user/useLoanerInfo";

import { deleteAccount } from "@/lib/api/culr.mutations";
import { useMutate } from "@/lib/api/api";

import styles from "./RemoveLibrary.module.css";

export default function RemoveLibrary({ context, modal }) {
  const { agencyId, agencyName } = context;

  const { updateLoanerInfo } = useLoanerInfo();

  // Mutation details
  const culrMutation = useMutate();
  const { data, error, reset, post } = culrMutation;

  // Mutate deleteAccount response from API
  useEffect(() => {
    const status = data?.bibdk?.culr?.deleteAccount?.status;

    if (status === "OK") {
      // mutate user data
      updateLoanerInfo();

      // cleanup
      reset();

      // close modal
      modal.clear();
    }

    // Some error occured
    if (status?.includes("ERROR") || error) {
      modal.push("statusMessage", {
        title: Translate({ context: "removeLibrary", label: "errorTitle" }),
        text: Translate({ context: "removeLibrary", label: "errorText" }),
        back: false,
      });
    }
  }, [data, error]);

  // Remove library click func
  function handleOnClick() {
    post(deleteAccount({ agencyId }));
  }

  // handles if modal should have "back" functionality
  const hasBack = !!(modal.index?.() > 0);

  return (
    <div className={styles.container}>
      <Top />
      <Title type="title4" tag="h2" className={styles.header}>
        {Translate({
          context: "removeLibrary",
          label: "title",
          vars: [agencyName],
        })}
      </Title>
      <Text type="text2" className={styles.text}>
        {Translate({
          context: "removeLibrary",
          label: "text",
          vars: [agencyName],
        })}
      </Text>

      <Button
        type="primary"
        className={styles.confirmButton}
        onClick={() => handleOnClick()}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleOnClick();
          }
        }}
      >
        {Translate({ context: "removeLibrary", label: "confirmButton" })}
      </Button>

      <Button
        type="secondary"
        className={styles.cancelButton}
        onClick={() => (hasBack ? modal.prev() : modal.clear())}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            hasBack ? modal.prev() : modal.clear();
          }
        }}
      >
        {Translate({ context: "removeLibrary", label: "cancelButton" })}
      </Button>
    </div>
  );
}
