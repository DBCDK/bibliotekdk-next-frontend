import { useState } from "react";
import Top from "@/components/_modal/pages/base/top";
import Icon from "@/components/base/icon";
import Collapse from "react-bootstrap/Collapse";
import Title from "@/components/base/title";
import Text from "@/components/base/text";
import Button from "@/components/base/button";
import Translate from "@/components/base/translate";
import styles from "./LoginNotSupported.module.css";
import animations from "css/animations";
import cx from "classnames";

export default function LoginNotSupported({ context, modal }) {
  const { libraryName } = { ...context };
  const [expanded, setExpanded] = useState(false);

  const toggleCollapse = () => {
    setExpanded((current) => !current);
  };

  return (
    <article className={styles.container}>
      <Top />
      <Title type="title4" tag="h2" className={styles.header}>
        {Translate({
          context: "login",
          label: "login-not-supported",
          vars: [libraryName],
        })}
      </Title>
      <Text type="text2" className={styles.text}>
        {Translate({
          context: "login",
          label: "but-you-can-order",
          vars: [libraryName],
        })}
      </Text>
      <Text type="text2" className={styles.text}>
        {Translate({
          context: "login",
          label: "more-functionality",
          vars: [libraryName],
        })}
      </Text>
      <ul className={styles.list}>
        <li>
          <Text type="text2">
            {Translate({
              context: "login",
              label: "functinality-1",
            })}
          </Text>
        </li>
        <li>
          <Text type="text2">
            {Translate({
              context: "login",
              label: "functinality-2",
            })}
          </Text>
        </li>
      </ul>
      <Text type="text2" className={styles.text}>
        {Translate({
          context: "login",
          label: "login-with",
          vars: [libraryName],
        })}
      </Text>
      {/* wrap collaps in text, to give styling to collapse, because collaps doesnt work with text component */}
      <Text type="text2" tag="div">
        <Collapse in={expanded}>
          <p id="why-not-supported-text">
            {Translate({
              context: "login",
              label: "not-supported-reason",
            })}
          </p>
        </Collapse>
      </Text>
      <Button
        dataCy="why-not-supported-button"
        ariaControls="why-not-supported-text"
        ariaExpanded={expanded}
        type="secondary"
        className={cx(
          styles.expandButton,
          animations["on-hover"],
          animations["on-focus"]
        )}
        border={false}
        onClick={toggleCollapse}
      >
        <span className={styles.expandWrap}>
          <Text
            type="text2"
            className={`${animations["f-border-bottom"]} ${animations["h-border-bottom"]}`}
          >
            {Translate({ context: "login", label: "why-login-not-suported" })}
          </Text>
          <Icon
            size={{ w: "2", h: "auto" }}
            src="arrowDown.svg"
            className={styles.chevron}
            alt=""
          />
        </span>
      </Button>

      <Button
        type="secondary"
        className={styles.backButton}
        onClick={() => modal.prev()}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            modal.prev();
          }
        }}
      >
        {Translate({ context: "general", label: "back" })}
      </Button>
    </article>
  );
}
