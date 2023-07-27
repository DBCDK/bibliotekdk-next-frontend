import Link from "@/components/base/link";
import Top from "@/components/_modal/pages/base/top";
import Icon from "@/components/base/icon";

import Title from "@/components/base/title";
import Text from "@/components/base/text";
import Button from "@/components/base/button";
import Translate from "@/components/base/translate";
import styles from "./LoginNotSupported.module.css";
import animations from "css/animations";

export default function LoginNotSupported({ context, modal }) {
  const { libraryName } = { ...context };
  return (
    <div className={styles.container}>
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

      <Link
        className={styles.link}
        onClick={() => {
          alert("Show more");
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.keyCode === 13) {
            alert("Show more");
          }
        }}
        border={{ bottom: { keepVisible: true } }}
      >
        <Text type="text2">
          {Translate({ context: "login", label: "why-login-not-suported" })}
        </Text>
        <Icon
          size={{ w: 2, h: "auto" }}
          className={`${styles.chevron} ${animations["h-elastic"]} ${animations["f-elastic"]}`}
          alt={"open arrow down"}
          title={"open arrow down"}
          src={"ArrowDown.svg"}
        />
      </Link>

      <Button
        type="secondary"
        className={styles.backButton}
        onClick={() => modal.prev()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.keyCode === 13) {
            modal.prev();
          }
        }}
      >
        {Translate({ context: "general", label: "back" })}
      </Button>
    </div>
  );
}
