import Dropdown from "react-bootstrap/Dropdown";
import styles from "./SearchIndexDropdown.module.css";
import Translate from "@/components/base/translate";
import Text from "@/components/base/text";
import Icon from "@/components/base/icon";
import { useAdvancedSearchContext } from "@/components/search/advancedSearch/advancedSearchContext";

/**
 * Used in advanced search field input. Drop down to select a search index. (e.g. "isbn", "author","title" etc.)
 * @param {*} param0
 * @returns
 */
export default function IndexDropdown({ options = [], className, index }) {
  const { handleIndexChange, inputFields } = useAdvancedSearchContext();

  const selected = inputFields[index].searchIndex;

  return (
    <Dropdown className={`${styles.dropdownwrap} ${className}`}>
      <Dropdown.Toggle
        variant="success"
        id="dropdown-basic"
        className={styles.dropdowntoggle}
      >
        <Text tag="span" type="text3">
          {Translate({
            context: "search",
            label: `advanced-dropdown-${selected}`,
          })}
          <Icon
            size={{ w: 1, h: 1 }}
            src="arrowrightblue.svg"
            className={styles.dropdownicon}
            alt=""
          />
        </Text>
      </Dropdown.Toggle>

      <Dropdown.Menu className={styles.dropdownmenu}>
        {options.map((elem) => {
          return (
            <Dropdown.Item
              tabIndex="-1"
              data-cy={`item-${elem}`}
              key={`indexDropdown-${elem}`}
              className={styles.dropdownitem}
              onClick={() => {
                handleIndexChange(index, elem);
              }}
            >
              <Text tag="span" type="text3">
                {Translate({
                  context: "search",
                  label: `advanced-dropdown-${elem}`,
                })}
              </Text>
            </Dropdown.Item>
          );
        })}
      </Dropdown.Menu>
    </Dropdown>
  );
}
