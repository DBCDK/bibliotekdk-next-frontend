import styles from "./Select.module.css";
import Dropdown from "react-bootstrap/Dropdown";
import Text from "@/components/base/text/Text";
import Translate from "@/components/base/translate";
import Icon from "@/components/base/icon/Icon";
import { cyKey } from "@/utils/trim";
import Tag from "@/components/base/forms/tag/Tag";

function DesktopList({ options = [], onOptionClicked, selectedMaterial }) {
  return (
    <Dropdown className={styles.dropdownwrap}>
      <Dropdown.Toggle
        data-cy={cyKey({ name: "material-selector", prefix: "header" })}
        variant="success"
        id="dropdown-basic"
        className={styles.dropdowntoggle}
      >
        <Text tag="span" type="text2">
          {Translate({
            context: "general",
            label:
              selectedMaterial.value === "all"
                ? selectedMaterial.value
                : selectedMaterial.label,
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
        {options.map((elem, idx) => {
          return (
            <Dropdown.Item
              tabindex="-1"
              key={`materialdropdown-${elem.value}`}
              className={styles.dropdownitem}
              onClick={(e) => {
                e.preventDefault();
                onOptionClicked(idx);
              }}
            >
              <Text tag="span" type="text3">
                {Translate({
                  context: "general",
                  label: elem.label,
                })}
              </Text>
            </Dropdown.Item>
          );
        })}
      </Dropdown.Menu>
    </Dropdown>
  );
}

/**
 * Show a 'select' list of available material filters.
 *
 * @param options
 * @param onOptionClicked
 * @param selectedMaterial
 * @return {JSX.Element}
 * @constructor
 */
export default function SelectList({
  options = [],
  onOptionClicked,
  selectedMaterial,
}) {
  return (
    <DesktopList
      options={options}
      onOptionClicked={onOptionClicked}
      selectedMaterial={selectedMaterial}
    />
  );
}

/**
 * Mobile version - @see SearchBar.js
 * @param options
 * @param onOptionClicked
 * @param selectedMaterial
 * @return {JSX.Element}
 * @constructor
 */
export function MobileList({
  options = [],
  onOptionClicked,
  selectedMaterial,
}) {
  return (
    <div className={styles.materials}>
      {options.map((elem, idx) => {
        const isSelected = selectedMaterial.value === elem.value;

        return (
          <Tag
            key={elem.value}
            selected={isSelected}
            //onClick={() => handleSelectedMaterial(material)}
            onClick={(e) => {
              e.preventDefault();
              onOptionClicked(idx);
            }}
          >
            {Translate({
              context: "general",
              label: elem.label,
            })}
          </Tag>
        );
      })}
    </div>
  );
}
