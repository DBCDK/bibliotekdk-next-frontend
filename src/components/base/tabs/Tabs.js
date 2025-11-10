import ReactTabs from "react-bootstrap/Tabs";

import styles from "./Tabs.module.css";

export default function Tabs({
  active,
  children,
  className = "",
  onSelect = () => {},
}) {
  return (
    <ReactTabs
      id="Tabs"
      bsPrefix="tabs"
      className={`${styles.tabs} ${className}`}
      activeKey={active}
      onSelect={onSelect}
      transition={true}
    >
      {children}
    </ReactTabs>
  );
}
