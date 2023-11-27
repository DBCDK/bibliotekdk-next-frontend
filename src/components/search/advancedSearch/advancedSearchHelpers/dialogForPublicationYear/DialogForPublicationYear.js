import cx from "classnames";
import styles from "./DialogForPublicationYear.module.css";
import Text from "@/components/base/text";
import Translate from "@/components/base/translate";
import { Close } from "@/components/_modal/pages/base/top";
import Input from "@/components/base/forms/input";
import { useEffect, useState } from "react";
import { ToggleMenuItemsEnum } from "@/components/search/advancedSearch/advancedSearchHelpers/dropdownReducerFunctions";

export function DialogForPublicationYear({ items, toggleMenuItemsState }) {
  const item = items?.[0];

  items.length !== 1 &&
    console.debug(
      `%cDialogForPublicationYear should have 1 and only 1 item, but has: ${items?.length}`,
      "color: var(--error-light_temp, #fff3f0); background-color: var(--error_temp, #ba4d57);"
    );

  const [valueState, setValueState] = useState(null);

  useEffect(() => {
    if (valueState !== null) {
      toggleMenuItemsState({
        type: ToggleMenuItemsEnum.UPDATE,
        payload: {
          ...item,
          value: valueState,
        },
      });
    }
  }, [JSON.stringify(valueState)]);

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
        value={item?.value?.lower}
        onChange={(e) =>
          setValueState((prev) => {
            return {
              ...prev,
              lower: e?.target?.value,
            };
          })
        }
      />
      <Input
        type="number"
        className={styles.upperRange}
        placeholder={`${new Date().getFullYear() + 1}`}
        value={item?.value?.upper}
        onChange={(e) =>
          setValueState((prev) => {
            return {
              ...prev,
              upper: e?.target?.value,
            };
          })
        }
      />
    </div>
  );
}
