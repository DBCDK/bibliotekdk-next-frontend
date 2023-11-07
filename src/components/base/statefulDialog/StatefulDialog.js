import { useEffect, useRef, useState } from "react";
import styles from "./StatefulDialog.module.css";
import Link from "@/components/base/link";
import animations from "css/animations";
import cx from "classnames";

export default function StatefulDialog({ children, title }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const openDialog = () => setDialogOpen(() => true);
  const closeDialog = () => setDialogOpen(() => false);

  const dialogRef = useRef();

  useEffect(() => {
    function clickBackdrop(e) {
      const dialogDimensions = dialogRef.current?.getBoundingClientRect();
      if (
        dialogOpen &&
        (e.clientX < dialogDimensions.left ||
          e.clientX > dialogDimensions.right ||
          e.clientY < dialogDimensions.top ||
          e.clientY > dialogDimensions.bottom)
      ) {
        closeDialog();
      }
    }

    if (dialogOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }

    dialogRef.current?.addEventListener("click", clickBackdrop);
    return () => {
      dialogRef.current?.removeEventListener("click", clickBackdrop);
    };
  }, [dialogOpen]);

  return (
    <div className={cx(styles.select_wrapper)} tabIndex="-1">
      <Link
        type="text3"
        className={cx(
          animations["h-border-bottom"],
          animations["h-color-blue"]
        )}
        border={{ bottom: { keepVisible: true } }}
        onClick={openDialog}
        tabIndex="-1"
      >
        {title}
      </Link>
      <dialog
        ref={dialogRef}
        onCancel={closeDialog}
        className={styles.dialog_element}
      >
        {children}
      </dialog>
    </div>
  );
}
