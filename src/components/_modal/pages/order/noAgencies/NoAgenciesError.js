import Top from "@/components/_modal/pages/base/top";
import styles from "./NoAgenciesError.module.css";
import Translate from "@/components/base/translate";
import Text from "@/components/base/text/Text";
import Title from "@/components/base/title/Title";

export default function NoAgenciesError() {
  return (
    <div className={styles.container}>
      <Top
        title={
          <Title type="title4">
            {Translate({
              context: "noagencies",
              label: "title",
            })}
          </Title>
        }
      />
      <div className={styles.bottommargin}>
        <Text type="text3">
          {Translate({
            context: "noagencies",
            label: "rubrik",
          })}
        </Text>
      </div>
      <div>
        <Text type="text1">
          {Translate({
            context: "noagencies",
            label: "maintitle",
          })}
        </Text>
      </div>
      <div>
        <Text type="text3">
          {Translate({
            context: "noagencies",
            label: "maintxt",
          })}
        </Text>
      </div>
    </div>
  );
}
