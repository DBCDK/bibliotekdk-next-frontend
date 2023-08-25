import Button from "@/components/base/button";
import Translate from "@/components/base/translate";
import { useModal } from "@/components/_modal/Modal";
import styles from "./MobileLoginButton.module.css";
/**
 * Shown for mobile phones 414px and below, opens pickup locations selection in new modal
 * instead of showing it in the same modal
 * @returns {JSX.Element}
 */
export default function MobileLoginButton(props) {
  const {
    context,
    onChange,
    allBranches,
    onSelect,
    isLoading,
    isVisible,
    includeArrows,
  } = props;
  const modal = useModal();
  return (
    <Button
      type="secondary"
      className={styles.withLoanerInfoButton}
      onClick={() => {
        modal.push("mobileLogin", {
          ...context,
          onChange,
          allBranches: allBranches, //TODO why undefined?
          onSelect,
          isLoading,
          isVisible,
          includeArrows,
        });
      }}
    >
      {Translate({ context: "login", label: "with-loaner-information" })}
    </Button>
  );
}
