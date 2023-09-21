import Top from "@/components/_modal/pages/base/top";
import Title from "@/components/base/title";
import Text from "@/components/base/text";
import Button from "@/components/base/button";
import Translate from "@/components/base/translate";
import styles from "./LoginNotSupported.module.css";
import InfoDropdown from "@/components/base/infoDropdown/InfoDropdown";

export default function LoginNotSupported({ context, modal }) {
  const { libraryName } = { ...context };

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
      <InfoDropdown
        label="why-not-supported"
        buttonText={Translate({
          context: "login",
          label: "why-login-not-suported",
        })}
      >
        {Translate({
          context: "login",
          label: "not-supported-reason",
        })}
      </InfoDropdown>

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
