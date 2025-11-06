import Offcanvas from "react-bootstrap/Offcanvas";

import { Close } from "@/components/_modal/pages/base/top";

import styles from "./Overlay.module.css";
import Expand from "../icons/expand";
import { useState } from "react";

export default function Overlay({
  show,
  expandDefault = false,
  onHide,
  title = false,
  children,
  className = "",
}) {
  const [expanded, setExpanded] = useState(expandDefault);

  const maximized = expanded ? styles.maximize : "";

  return (
    <Offcanvas
      show={show}
      scroll={false}
      backdrop={true}
      placement="end"
      onHide={onHide}
      className={`${styles.offcanvas} ${maximized} ${className}`}
    >
      <Offcanvas.Header className={styles.header}>
        <Expand
          className={styles.expand}
          onChange={(e) => setExpanded(e?.target?.checked)}
        />
        <Offcanvas.Title className={styles.title}>
          {"Sample af Papirguderne"}
        </Offcanvas.Title>
        <Close className={styles.close} onClose={onHide} />
      </Offcanvas.Header>
      <Offcanvas.Body id="overlay" className={styles.body}>
        {children}
      </Offcanvas.Body>
    </Offcanvas>
  );
}
