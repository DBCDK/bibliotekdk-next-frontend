import Translate from "@/components/base/translate/Translate";
import Text from "@/components/base/text";
import Suggester from "@/components/base/suggester/Suggester";

import IconButton from "@/components/base/iconButton/IconButton";
import styles from "./TextInputs.module.css";
import animations from "css/animations";
import IndexDropdown from "../indexDropdown/IndexDropdown";
import { useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import Icon from "@/components/base/icon";
import workTypesLabels from "./labels.json";
import Input from "@/components/base/forms/input";
import { useData } from "@/lib/api/api";
import * as suggestFragments from "@/lib/api/suggest.fragments";

/**
 * Returns a textinput component and a dropdown to choose which advanced search index to search in
 * @param {Object} props
 * @returns {React.JSX.Element}
 */
function FieldInput({
  index,
  handlePrefixChange,
  addAnInputField,
  removeInputField,
  isLastItem,
  isFirstItem,
  workType,
  fieldValue,
}) {
  //which index is selected in the indexDropdown. (e.g. "all", "author","title" etc.)
  const [indexField, setIndexfield] = useState("all");
  //textinput text value
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  //labels to show in IndexDropdown
  console.log("worktype", workType);
  const labels = workTypesLabels[workType].map((el) => el.label);

  const { data } = useData(
    value && suggestFragments.all({ q: value, workType: null, limit: 10 })
  );

  useEffect(() => {
    setSuggestions(
      data?.suggest?.result?.map((res) => {
        return { value: res.term };
      })
    );
  }, [data]);

  return (
    <div>
      {!isFirstItem && (
        <LogicalOperatorDropDown
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
            data={suggestions}
            onSelect={(val) => setValue(val)}
            onClear={() => setValue("")}
            className={styles.suggester}
          >
            <Input
              className={styles.suggesterInput}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={fieldValue.placeholder}
            />
          </Suggester>
        </div>
        {!isFirstItem && (
          <IconButton
            icon="close"
            onClick={() => removeInputField(index)}
            className={styles.removeIcon}
          >
            {Translate({ context: "search", label: "remove" })}
          </IconButton>
        )}
      </div>

      {isLastItem && (
        <IconButton
          icon="expand"
          onClick={addAnInputField}
          keepUnderline
          className={styles.addLine}
        >
          {Translate({ context: "search", label: "addLine" })}
        </IconButton>
      )}
    </div>
  );
}
const options = ["AND", "OR", "NOT"];

/**
 * Dropdown for choosing a logical operator ("AND", "OR", "NOT") between text fields.
 * @param {*} param0
 * @returns
 */
function LogicalOperatorDropDown({ onSelect, selected = "AND", className }) {
  const [expanded, setExpanded] = useState(false);
  function toggleCollapse() {
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
      >
        <span>
          <Text
            type="text2"
            className={`${animations["f-border-bottom"]} ${animations["h-border-bottom"]}`}
          >
            {Translate({
              context: "search",
              label: `advanced-dropdown-${selected}`,
            })}
          </Text>
          <Icon
            size={{ w: "2", h: "auto" }}
            src={expanded ? "arrowUp.svg" : "arrowDown.svg"}
            alt=""
          />
        </span>
      </Dropdown.Toggle>

      <Dropdown.Menu className={styles.dropdownmenu}>
        {options.map((elem) => {
          return (
            <Dropdown.Item
              tabIndex="-1"
              key={`logicalOperatordropdown-${elem}`}
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
 * A dynamic component that can render multiple text inputs for advanced search
 * @param {Object} props
 * @returns {React.JSX.Element}
 */
export default function TextInputs({ workType }) {
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
        workType={workType}
        fieldValue={field}
      />
    );
  });
}
