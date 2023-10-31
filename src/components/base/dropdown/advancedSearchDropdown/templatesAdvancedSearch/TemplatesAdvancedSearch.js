import styles from "./TemplatesAdvancedSearch.module.css";
import { Close } from "@/components/_modal/pages/base/top";
import cx from "classnames";
import Input from "@/components/base/forms/input";
import Text from "@/components/base/text";
import Translate from "@/components/base/translate";

export function DialogForPublicationYear({ value, setValue }) {
  return (
    <div className={cx(styles.dialogForPublicationYear)}>
      <Text type="text1" className={cx(styles.dialog_header)}>
        {Translate({
          context: "advanced_search_dropdown",
          label: "choose_publication_year",
        })}
      </Text>
      <div className={cx(styles.dialog_close_button)}>
        <Close />
      </div>
      <Input
        type="number"
        className={styles.lowerRange}
        placeholder={"Big bang"}
        value={value?.lower || null}
        onChange={(e) => setValue({ lower: e?.target?.value })}
      />
      <Input
        type="number"
        className={styles.upperRange}
        placeholder={`${new Date().getFullYear() + 1}`}
        value={value?.upper || null}
        onChange={(e) => setValue({ upper: e?.target?.value })}
      />
    </div>
  );
}
