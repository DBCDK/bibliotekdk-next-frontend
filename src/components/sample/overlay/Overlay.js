import Offcanvas from "react-bootstrap/Offcanvas";
import Text from "@/components/base/text";
import { Close } from "@/components/_modal/pages/base/top";
import Expand from "../icons/expand";
import styles from "./Overlay.module.css";
import Translate from "@/components/base/translate";

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
  const title = data?.titles?.main[0] || "Prøveeksempel";
  const type = isEpub ? "read" : "listen";

  const prefix = Translate({
    context: "sample",
    label: `overlay-test-${type}-title`,
  });

  const maximized = isFullscreen ? styles.maximize : "";
  const typeClass = isEpub ? styles.epub : isMp3 ? styles.mp3 : "";

  const handleToggle = (next) => {
    const nextVal =
      typeof next === "boolean" ? next : next?.target?.checked ?? !isFullscreen;
    onToggle(nextVal);
  };

  return (
    <Offcanvas
      show={show}
      scroll={false}
      backdrop={true}
      restoreFocus={false}
      placement="end"
      onHide={onHide}
      className={`${styles.offcanvas} ${typeClass} ${maximized} ${className}`}
    >
      <Offcanvas.Header className={styles.header}>
        {!isMp3 && (
          <Expand
            className={styles.expand}
            checked={isFullscreen}
            onChange={handleToggle}
            onClick={handleToggle}
            aria-pressed={isFullscreen}
            aria-label={isFullscreen ? "Minimér" : "Maksimér"}
          />
        )}
        <Offcanvas.Title className={styles.title}>
          <Text type="title6" lines={1} clamp>
            {`${prefix} ${title}`}
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
