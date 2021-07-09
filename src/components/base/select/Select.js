import styles from "./Select.module.css";
import Dropdown from "react-bootstrap/Dropdown";
import Text from "@/components/base/text/Text";
import Translate from "@/components/base/translate";
import Icon from "@/components/base/icon/Icon";

export default function SelectList({
  options = [],
  onOptionClicked,
  selectedMaterial,
}) {
  return (
    <Dropdown className={styles.dropdownwrap}>
      <Dropdown.Toggle
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
          />
        </Text>
      </Dropdown.Toggle>

      <Dropdown.Menu className={styles.dropdownmenu}>
        {options.map((elem, idx) => {
          return (
            <Dropdown.Item
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
