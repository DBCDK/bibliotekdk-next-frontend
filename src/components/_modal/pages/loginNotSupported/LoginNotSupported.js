import Link from "@/components/base/link";
import Top from "@/components/_modal/pages/base/top";
import Title from "@/components/base/title";
import Text from "@/components/base/text";
import Button from "@/components/base/button";
import Translate from "@/components/base/translate";
import styles from "./LoginNotSupported.module.css";

export default function LoginNotSupported({ libraryName }) {
  return (
    <div>
      <Top />
      <Title type="title4" tag="h2">
        {Translate({
          context: "login",
          label: "login-not-supported",
          vars: [libraryName],
        })}
      </Title>
      <Text type="text2">
        {Translate({
          context: "login",
          label: "but-you-can-order",
          vars: [libraryName],
        })}
      </Text>
      <Text type="text2">
        {Translate({
          context: "login",
          label: "more-functionality",
          vars: [libraryName],
        })}
      </Text>
      <ul>
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
      <Text type="text2">
        {Translate({
          context: "login",
          label: "login-with",
          vars: [libraryName],
        })}
      </Text>
      <Button type="secondary" className={styles.backButton}>
        {Translate({ context: "general", label: "back" })}
      </Button>
      <Link
        onClick={() => {
          alert("Implement link to library specific login instructions");
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.keyCode === 13) {
            alert("Implement link to library specific login instructions");
          }
        }}
        border={{ bottom: { keepVisible: true } }}
      >
        <Text type="text3" tag="span">
          {Translate({ context: "login", label: "create-library-user" })}
        </Text>
      </Link>
    </div>
  );
}
