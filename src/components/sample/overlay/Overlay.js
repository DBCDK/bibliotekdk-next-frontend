import Offcanvas from "react-bootstrap/Offcanvas";
import Text from "@/components/base/text";
import { Close } from "@/components/_modal/pages/base/top";
import Expand from "../icons/expand";
import styles from "./Overlay.module.css";

export default function Overlay({
  show,
  onHide,
  onToggle = () => {},
  isFullscreen = false,
  data,
  isEpub,
  isMp3,
  children,
  className = "",
}) {
  const title = data?.titles?.full[0] || "Prøveeksempel";
  const type = isEpub ? "Prøvelæs" : "Prøvelyt";

  const maximized = isFullscreen ? styles.maximize : "";
  const typeClass = isEpub ? styles.epub : isMp3 ? styles.mp3 : "";

  const handleToggle = (next) => {
    // fallback hvis komponenten ikke giver 'checked'
    const val =
      typeof next === "boolean"
        ? next
        : typeof next?.target?.checked === "boolean"
        ? next.target.checked
        : !isFullscreen;
    onToggle(val);
    // (ReaderSample lytter på isFullscreen-proppen fra parent og reflow'er selv)
  };

  return (
    <Offcanvas
      show={show}
      scroll={false}
      backdrop={true}
      placement="end"
      onHide={onHide}
      className={`${styles.offcanvas} ${typeClass} ${maximized} ${className}`}
    >
      <Offcanvas.Header className={styles.header}>
        <Expand
          className={styles.expand}
          disabled={isMp3}
          // gør den kontrolleret:
          checked={isFullscreen}
          // virker både hvis Expand er checkbox eller button:
          onChange={handleToggle}
          onClick={handleToggle}
          aria-pressed={isFullscreen}
          aria-label={isFullscreen ? "Minimér" : "Maksimér"}
        />
        <Offcanvas.Title className={styles.title}>
          <Text type="1" lines={1} clamp>
            {`${type} ${title}`}
          </Text>
        </Offcanvas.Title>
        <Close className={styles.close} onClose={onHide} />
      </Offcanvas.Header>

      <Offcanvas.Body id="overlay" className={styles.body}>
        {children}
      </Offcanvas.Body>
    </Offcanvas>
  );
}
