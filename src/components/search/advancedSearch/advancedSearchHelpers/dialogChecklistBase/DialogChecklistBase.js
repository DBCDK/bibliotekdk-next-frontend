import cx from "classnames";
import styles from "./DialogChecklistBase.module.css";
import Text from "@/components/base/text";
import Translate from "@/components/base/translate";
import { Close } from "@/components/_modal/pages/base/top";
import Link from "@/components/base/link";

import {
  CheckboxItem,
  FormTypeEnum,
} from "@/components/search/advancedSearch/advancedSearchHelpers/helperComponents/HelperComponents";

export function DialogChecklistBase({ items, toggleMenuItemsState }) {
  const indexDivider = items?.findIndex(
    (item) => item.formType === FormTypeEnum.DIVIDER
  );
  const indexPrioritisedEnd =
    indexDivider === -1 ? items?.length : indexDivider;

  return (
    <div className={cx(styles.dialog_checklist_base)}>
      <Text type="text1" className={cx(styles.dialog_header)}>
        {Translate({
          context: "advanced_search_dropdown",
          label: "age_groups",
        })}
      </Text>
      <div className={cx(styles.dialog_close_button)}>
        <Close />
      </div>
      <div className={styles.prioritisedAgeGroups}>
        {items.slice(0, indexPrioritisedEnd).map((item) => (
          <Link key={item?.name} onClick={() => toggleMenuItemsState(item)}>
            <CheckboxItem key={item?.name} item={item} />
          </Link>
        ))}
      </div>
      {indexPrioritisedEnd !== items?.length && (
        <>
          <hr className={styles.divider} />
          <div className={styles.unprioritisedAgeGroups}>
            {items.slice(indexPrioritisedEnd + 1, items?.length).map((item) => (
              <Link key={item?.name} onClick={() => toggleMenuItemsState(item)}>
                <CheckboxItem key={item?.name} item={item} />
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
