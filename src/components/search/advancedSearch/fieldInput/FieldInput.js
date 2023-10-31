import Translate from "@/components/base/translate/Translate";
import Text from "@/components/base/text";
import Suggester from "@/components/base/suggester/Suggester";

import IconButton from "@/components/base/iconButton/IconButton";
import styles from "./FieldInput.module.css";
import Title from "@/components/base/title";
import useBreakpoint from "@/components/hooks/useBreakpoint";
//import Suggester, { focusInput, blurInput } from "./suggester/";
import ExpandIcon from "@/components/base/animation/expand";
import animations from "css/animations";

import { useModal } from "@/components/_modal";
import useHistory from "@/components/hooks/useHistory";
// import Suggester, {
//   focusInput,
//   blurInput,
// } from "@/components/header/suggester/Suggester";
import useQ from "@/components/hooks/useQ";
import cx from "classnames";

import { DesktopMaterialSelect } from "../../select";
import IndexDropdown from "../indexDropdown/IndexDropdown";
import { useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import Icon from "@/components/base/icon";
import materialTypesLabels from "./labels.json";
import Button from "@/components/base/button";
import Input from "@/components/base/forms/input";
import { useData } from "@/lib/api/api";
import * as suggestFragments from "@/lib/api/suggest.fragments";

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
  isFirstItem,
  materialType,
  fieldValue,
}) {
  const [history, setHistory, clearHistory] = useHistory();
  //   const { q, setQ, setQuery, getCount, getQuery } = useQ();
  const [indexField, setIndexfield] = useState("all");
  const [selected, setSelected] = useState("all");

  const [value, setValue] = useState("");

  const updateQuery = (val) => {
    console.log("val", val);
  };

  const [state, setState] = useState({ q: "", data: [] });
  const [suggestions, setSuggestions] = useState([]);

  console.log("value before usedata", value);
  const { data, isLoading } = useData(
    value &&
      value !== selected &&
      suggestFragments.all({ q: value, workType: null, limit: 10 })
  );
  //   // function to force search onKeyDown
  //   const keyPressed = (e) => {
  //     if (e.key === "Enter") {
  //       updateQuery(e.target.value);
  //     }
  //   };
  useEffect(() => {
    console.log("suggestinos.useeffect.data", data);
    console.log("suggestinos.useeffect.isLoading", isLoading);

    setSuggestions(
      data?.suggest?.result?.map((res) => {
        return { value: res.term };
      })
    );
  }, [data, isLoading]);
  const labels = materialTypesLabels[materialType].map((el) => el.label);
  console.log("suggestinos.data", data);
  return (
    <div>
      {!isFirstItem && (
        <OperatorDropDown
          onSelect={(value) => handlePrefixChange(index, value)}
          selected={fieldValue.prefixOperator}
        />
      )}

      <div className={styles.inputContainer}>
        <IndexDropdown
          options={labels}
          selected={indexField}
          onSelect={setIndexfield}
          className={styles.select}
        />
        <div className={`${styles.suggester__wrap} `}>
          <Suggester
            id="some-uniq-id"
            data={suggestions}
            onSelect={(val) => setValue(val)}
            onClear={() => setValue("")}
          >
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder='Prøv at skrive "hund"'
            />
          </Suggester>
        </div>
        {!isFirstItem && (
          <IconButton
            icon="close"
            onClick={() => removeInputField(index)}
            className={styles.removeIcon}
          >
            {null}
          </IconButton>
        )}
      </div>

      {isLastItem && (
        <IconButton icon="expand" onClick={addAnInputField} keepUnderline>
          {Translate({ context: "search", label: "addLine" })}
        </IconButton>
      )}
      {/**            <ExpandIcon open={true} size={4} />
       */}
      {/* {isLastItem&&<Icon}       */}
    </div>
  );
}
const options = ["AND", "OR", "NOT"];
function OperatorDropDown({
  onSelect,
  handlePrefixChange,
  selected = "AND",
  className,
}) {
  const [expanded, setExpanded] = useState(false);
  function toggleCollapse() {
    console.log("onclick");
    setExpanded((current) => !current);
  }
  return (
    <Dropdown
      onToggle={toggleCollapse}
      className={`${styles.dropdownwrap} ${className}`}
    >
      <Dropdown.Toggle
        variant="success"
        id="dropdown-basic"
        className={styles.dropdowntoggle}
        //  onClick={toggleCollapse}
      >
        <span className={styles.expandWrap}>
          <Text
            type="text2"
            className={`${animations["f-border-bottom"]} ${animations["h-border-bottom"]}`}
          >
            {selected}
          </Text>
          <Icon
            size={{ w: "2", h: "auto" }}
            src={expanded ? "arrowUp.svg" : "arrowDown.svg"}
            className={styles.chevron}
            alt=""
          />
        </span>
        {/* </Button> */}

        {/* <IconButton icon="arrowDown" className={styles.dropdownicon}>
          {Translate({
            context: "search",
            label: `advanced-dropdown-${selected}`,
          })}
        </IconButton> */}
        {/*
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
        */}
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
export default function FieldInputContainer({ data, materialType }) {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "xs";
  //   const inputFields = [1];
  //TODO move this to state. Each input should just have a value + prefexOperator. then inputValues.length is the number of input fields.
  //prefixOperator is an enum of AND, OR , NOT
  const [inputFields, setInputFields] = useState([
    { value: "", prefixOperator: null },
    { value: "", prefixOperator: "AND" },
  ]);
  function addInputField() {
    setInputFields((prevFields) => [
      ...prevFields,
      { value: "", prefixOperator: "AND" },
    ]);
  }
  function removeInputField(indexToRemove) {
    //TODO if 1 element

    console.log("removeInputField", removeInputField);
    setInputFields((prevFields) =>
      prevFields.filter((_, index) => index !== indexToRemove)
    );
  }

  function handlePrefixChange(index, newOperator) {
    setInputFields((prevFields) => {
      const newFields = [...prevFields];
      newFields[index].prefixOperator = newOperator;
      return newFields;
    });
  }
  console.log("inputFields", inputFields);
  return inputFields?.map((field, index) => {
    return (
      <FieldInput
        key={index}
        index={index}
        addAnInputField={addInputField}
        removeInputField={removeInputField}
        handlePrefixChange={handlePrefixChange}
        isLastItem={index === inputFields.length - 1}
        isFirstItem={index === 0}
        materialType={materialType}
        fieldValue={field}
      />
    );
  });
}
