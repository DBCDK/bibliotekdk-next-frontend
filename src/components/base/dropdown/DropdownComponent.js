import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { encodeString } from "@/lib/utils";
import Dropdown from "react-bootstrap/Dropdown";

import Icon from "@/components/base/icon";
import Text from "@/components/base/text";

import Translate from "@/components/base/translate";
import { useState } from "react";
import styles from "./DropdownComponent.module.css";
import classNames from "classnames/bind";

export default function DropdownComponent({ context, menuItems }) {
  const [selected, setSelected] = useState(0);

  return (
    <div style={{ backgroundColor: "orange", height: "400px", widht: "100px" }}>
      <Dropdown type="nav" className={styles.dropdownwrap} autoClose="outside">
        <Dropdown.Toggle
          variant="success"
          id="dropdown-basic"
          className={styles.dropdowntoggle}
        >
          <Text tag="span" type="text3" className={styles.text}>
            {Translate({
              context: context,
              label: "profileMenu",
            })}
            <Icon
              size={{ w: 1, h: 1 }}
              src="arrowrightblue.svg"
              className={styles.dropdownicon}
              alt=""
            />
          </Text>
        </Dropdown.Toggle>
        <Dropdown.Menu className={styles.dropdownMenu}>
          {menuItems.map((item, i) => (
            <Dropdown.Item
              className={classNames(
                styles.navItem,
                selected === i ? styles.itemSelected : ""
              )}
              tabIndex="-1"
              data-cy={`item-${item}`}
              // href={`profil/${encodeString(
              //   Translate({
              //     context: context,
              //     label: menuItems[i],
              //     requestedLang: "da",
              //   })
              // )}`}
              key={`nav-item-${i}`}
              onClick={() => setSelected(i)}
            >
              <Text tag="span" type="text3" className={styles.text}>
                {Translate({
                  context: context,
                  label: menuItems[i],
                })}
                {selected === i && (
                  <Icon
                    size={{ w: 1.5, h: 1.5 }}
                    className={styles.navItemIcon}
                    src="checkmark.svg"
                    alt=""
                  />
                )}
              </Text>
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}

{
}
