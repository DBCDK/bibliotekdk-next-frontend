import styles from "./Select.module.css";
import Dropdown from "react-bootstrap/Dropdown";
import { useRouter } from "next/router";
import Text from "@/components/base/text/Text";
import Translate from "@/components/base/translate";
import Icon from "@/components/base/icon/Icon";
import { useState } from "react";

export default function SelectList({ setquery, searchFunc, options = [] }) {
  const router = useRouter();

  // check if materialtype is set in query parameters
  const matparam = router.query.materialtype;
  let index = 0;
  if (matparam) {
    index = options.findIndex(function (element, indx) {
      return element.value === matparam;
    });
  }
  index = index === -1 ? 0 : index;
  const [selectedOption, setSelectedOption] = useState(options[index]);

  const onOptionClicked = (idx) => {
    setSelectedOption(options[idx]);
  };

  // check if q is set in query parameters
  let query = router.query.q;

  return (
    <Dropdown>
      <Dropdown.Toggle
        variant="success"
        id="dropdown-basic"
        className={styles.dropdowntoggle}
      >
        <Text tag="span" type="text2">
          {Translate({
            context: "general",
            label: selectedOption.value,
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
                router &&
                  router.push({
                    pathname: router.pathname,
                    query: { ...router.query, materialtype: elem.value },
                  });
                query &&
                  searchFunc({
                    query,
                    materialtype: elem.value,
                  });
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
