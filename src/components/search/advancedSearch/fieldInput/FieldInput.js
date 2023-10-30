import Translate from "@/components/base/translate/Translate";
import Text from "@/components/base/text";
import IconButton from "@/components/base/iconButton/IconButton";
import styles from "./FieldInput.module.css";
import Title from "@/components/base/title";
import useBreakpoint from "@/components/hooks/useBreakpoint";
//import Suggester, { focusInput, blurInput } from "./suggester/";

import { useModal } from "@/components/_modal";
import useHistory from "@/components/hooks/useHistory";
import Suggester, {
  focusInput,
  blurInput,
} from "@/components/header/suggester/Suggester";
import useQ from "@/components/hooks/useQ";
import { DesktopMaterialSelect } from "../../select";
import IndexDropdown from "../indexDropdown/IndexDropdown";
import { useState } from "react";
import { Dropdown } from "@/components/base/dropdown/navigationDropdown/NavigationDropdown.stories";

/**
 * FieldInput to be used in FieldInput component.
 * @param {Object} props
 * @returns {React.JSX.Element}
 */
function FieldInput({
  index,
  key,
  handlePrefixChange,
  addAnInputField,
  removeInputField,
  isLastItem,
}) {
  const [history, setHistory, clearHistory] = useHistory();
  const { q, setQ, setQuery, getCount, getQuery } = useQ();
  const [selected, setSelected] = useState("all");

  const updateQuery = (val) => {
    console.log("val", val);
  };

  // function to force search onKeyDown
  const keyPressed = (e) => {
    if (e.key === "Enter") {
      updateQuery(e.target.value);
    }
  };
  return (
    <div>
      <div className={styles.inputContainer}>
        <IndexDropdown
          options={["all", "title", "isbn", "subject"]}
          selected={selected}
          onSelect={setSelected}
          className={styles.select}
        />
        <div className={`${styles.suggester__wrap} `}>
          <Suggester
            className={`${styles.suggester}`}
            history={history}
            clearHistory={clearHistory}
            // isMobile={suggesterVisibleMobile}
            onSelect={(val) => updateQuery(val)}
            onChange={(val) => setQ({ ...q, all: val })}
            onClose={() => {
              if (router) {
                // remove suggester prop from query obj
                router.back();
              }
              // Remove suggester in storybook
              // story && story.setSuggesterVisibleMobile(false);
            }}
            onKeyDown={keyPressed}
            hideClearIcon
          />

        </div>
        <IconButton icon="close" onClick={()=>removeInputField(index)} className={styles.removeIcon}>{null}</IconButton>
            

      </div>
      {isLastItem && (
        <IconButton icon="expand" onClick={addAnInputField}>
          Tilføj
        </IconButton>
      )}
      {/* {isLastItem&&<Icon}       */}
      {/* <OperatorDropDown/> */}
    </div>
  );
}
const options = ["AND", "OR", "NOT"];
function OperatorDropDown({ onSelect }) {
  return (
    <Dropdown className={`${styles.dropdownwrap} ${className}`}>
      <Dropdown.Toggle
        data-cy={cyKey({ name: "material-selector", prefix: "header" })}
        variant="success"
        id="dropdown-basic"
        className={styles.dropdowntoggle}
      >
        <Text tag="span" type="text2">
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

/**
 * Returns a table of users libraries
 * @param {Object} props
 * @returns {React.JSX.Element}
 */
export default function FieldInputContainer({ data }) {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "xs";
  //   const inputFields = [1];
  //TODO move this to state. Each input should just have a value + prefexOperator. then inputValues.length is the number of input fields.
  //prefixOperator is an enum of AND, OR , NOT
  const [inputFields, setInputFields] = useState([
    { value: "", prefixOperator: "AND" },
  ]);
  function addInputField() {
    setInputFields((prevFields) => [
      ...prevFields,
      { value: "", prefixOperator: "AND" },
    ]);
  }
  function removeInputField(indexToRemove) {
    console.log('removeInputField',removeInputField)
    setInputFields(prevFields => prevFields.filter((_, index) => index !== indexToRemove));
  }
  
  function handlePrefixChange(index, newOperator) {
    setInputFields((prevFields) => {
      const newFields = [...prevFields];
      newFields[index].prefixOperator = newOperator;
      return newFields;
    });
  }
  return inputFields.map((field, index) => {
    return (
      <FieldInput
        key={index}
        index={index}
        addAnInputField={addInputField}
        removeInputField={removeInputField}

        handlePrefixChange={handlePrefixChange}
        isLastItem={index === inputFields.length - 1}
      />
    );
  });
}
