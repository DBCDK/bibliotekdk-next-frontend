import Offcanvas from "react-bootstrap/Offcanvas";
import styles from "./Overlay.module.css";

export default function Overlay({
  show,
  maximize = false,
  onHide,
  title = false,
  children,
  className = "",
}) {
  const maximized = maximize ? styles.maximize : "";

  return (
    <Offcanvas
      show={show}
      scroll={false}
      backdrop={true}
      placement="end"
      onHide={onHide}
      className={`${styles.offcanvas} ${maximized} ${className}`}
    >
      {title && (
        <Offcanvas.Header className={styles.header} closeButton>
          <Offcanvas.Title>{title}</Offcanvas.Title>
        </Offcanvas.Header>
      )}
      <Offcanvas.Body id="overlay" className={styles.body}>
        {children}
      </Offcanvas.Body>
    </Offcanvas>
  );
}
