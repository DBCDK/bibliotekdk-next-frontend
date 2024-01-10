/**
 * @file This modal page inform a FFU user that their agency is already attached to a bibdk profile. User is encouraged to login by mitid or detach agency.
 */
import { useEffect } from "react";

import Text from "@/components/base/text";
import Title from "@/components/base/title";
import Top from "@/components/_modal/pages/base/top";
import Translate from "@/components/base/translate";
import Button from "@/components/base/button";
import { signIn } from "@dbcdk/login-nextjs/client";
import { getCallbackUrl } from "@/components/_modal/pages/login/utils";
import useLoanerInfo from "@/components/hooks/user/useLoanerInfo";

import useStorage from "@/components/hooks/useStorage";

import { deleteAccount } from "@/lib/api/culr.mutations";
import { useMutate } from "@/lib/api/api";

import styles from "./AccountHasProfile.module.css";

/**
 * Modal page for that contains a button to Adgangsplatform login
 * @param {context} context
 * @returns
 */
export default function AccountHasProfile({ modal, context }) {
  const { branchName, agencyId, agencyName, back } = context;

  const { updateLoanerInfo } = useLoanerInfo();

  const storage = useStorage();

  // Mutation details
  const culrMutation = useMutate();
  const { data, error, reset, post } = culrMutation;

  const index = modal.index?.();

  // Mutate deleteAccount response from API
  useEffect(() => {
    const status = data?.culr?.deleteAccount?.status;

    if (status === "OK") {
      // mutate user data
      updateLoanerInfo();

      // cleanup
      reset();

      // Block FFU listener (Dont ask user to create a bibdk profile again)
      const ttl = 1000 * 60 * 60 * 24 * 90; // 90 days
      storage.create("BlockFFUListener", {}, ttl);

      const item = modal.stack?.[index - 1];
      const isOrderOrigin = !!(
        item?.id === "multiorder" || item?.id === "order"
      );

      // Show modal confirming deletion
      modal.push("statusMessage", {
        title: Translate({
          context: "accountWasDetached",
          label: "title",
          vars: [branchName],
        }),
        text: Translate({
          context: "accountWasDetached",
          label: "text",
        }),
        back: false,
        buttonText:
          isOrderOrigin &&
          Translate({
            context: "accountWasDetached",
            label: "button",
          }),
        onClick: isOrderOrigin ? () => modal.prev("order") : null,
      });
    }

    // Some error occured
    if (status?.includes("ERROR") || error) {
      modal.push("statusMessage", {
        title: Translate({ context: "removeLibrary", label: "errorTitle" }),
        text: Translate({ context: "removeLibrary", label: "errorText" }),
      });
    }
  }, [data, error]);

  // Handles the "Skip" button click
  function removeFFULibrary() {
    post(deleteAccount({ agencyId }));
  }

  // Handles the MitID button click
  function onMitIdLogin() {
    // Can be reassigned if none given
    let callbackUID = context.callbackUID;

    /* Check if AccountHasProfile modal "stole" the view from another modal page.
       If no callbackUID was given in context, update UID to the previous modal page
       callback will then return user to the original (previous) modal page  */
    if (!callbackUID) {
      // if a previous modal exist
      if (index > 0) {
        // previous modal
        const target = index - 1;
        const item = modal.stack?.[target];
        // Ignore if last modal was the 'openAdgangsplatform' modal
        if (item?.id !== "openAdgangsplatform") {
          callbackUID = item?.uid;
          // remove back functionality from the 'stolen' modal page
          modal.update(target, { back: false });
        }
      }
    }

    // Generate callbackurl
    // When login method is 'nemlogin' no pickupBranch is used
    const callbackUrl = getCallbackUrl(null, callbackUID);

    signIn(
      "adgangsplatformen",
      { callbackUrl },
      { idp: "nemlogin", force_login: 1 }
    );
  }

  return (
    <div className={styles.hasProfile}>
      <Top back={back} />
      <div>
        <Title type="title4" tag="h2">
          {Translate({
            context: "accountHasProfile",
            label: "title",
            vars: [branchName],
          })}
        </Title>
        <Text type="text2" className={styles.text}>
          {Translate({
            context: "accountHasProfile",
            label: "text",
            vars: [agencyName],
          })}
        </Text>

        <Button
          ariaLabel={Translate({ context: "login", label: "mit-id" })}
          dataCy="mitid-button"
          type="primary"
          className={styles.mitIDButton}
          onClick={() => onMitIdLogin()}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onMitIdLogin();
            }
          }}
        >
          {Translate({
            context: "accountHasProfile",
            label: "loginButton",
          })}
        </Button>

        <Text type="text2" className={styles.remove}>
          {Translate({
            context: "accountHasProfile",
            label: "textRemove",
          })}
        </Text>

        <Button
          type="secondary"
          className={styles.removeButton}
          onClick={() => removeFFULibrary()}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              removeFFULibrary();
            }
          }}
        >
          {Translate({
            context: "accountHasProfile",
            label: "removeButton",
          })}
        </Button>
      </div>
    </div>
  );
}
