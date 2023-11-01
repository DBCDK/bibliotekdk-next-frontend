import Dropdown from "react-bootstrap/Dropdown";
import styles from "./IndexDropdown.module.css";
import { cyKey } from "@/utils/trim";
import Translate from "@/components/base/translate";
import Text from "@/components/base/text";
import Icon from "@/components/base/icon";

/**
 * Uses in advanced search field input. Drop down to select a search index
 * @param {*} param0
 * @returns
 */
export default function IndexDropdown({
  options = [],
  onSelect,
  selected,
  className,
}) {
  return (
    <Dropdown className={`${styles.dropdownwrap} ${className}`}>
      <Dropdown.Toggle
        data-cy={cyKey({ name: "material-selector", prefix: "header" })}
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
              key={`materialdropdown-${elem}`}
              className={styles.dropdownitem}
              onClick={() => {
                onSelect(elem);
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
