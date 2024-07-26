/**
 * @file - MobileLoginButton.js
 * Button login on pickup selection for mobile phones
 */

import Button from "@/components/base/button";
import Text from "@/components/base/text";
import Translate from "@/components/base/translate";
import { useModal } from "@/components/_modal/Modal";
import styles from "./MobileLoginButton.module.css";
/**
 * Shown for mobile phones 414px and below, opens pickup locations selection in new modal
 * instead of showing it in the same modal as done on desktop
 * @returns {React.JSX.Element}
 */
export default function MobileLoginButton(props) {
  const modal = useModal();

  return (
    <>
      <Button
        type="secondary"
        className={styles.withLoanerInfoButton}
        onClick={() => {
          modal.push("mobileLogin", {
            ...props,
          });
        }}
      >
        {Translate({ context: "login", label: "with-loaner-information" })}
      </Button>
    </>
  );
}

MobileLoginButton.propTypes = {};
