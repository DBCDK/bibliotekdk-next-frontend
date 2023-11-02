import Translate from "@/components/base/translate/Translate";
import Text from "@/components/base/text";
import Suggester from "@/components/base/suggester/Suggester";

import IconButton from "@/components/base/iconButton/IconButton";
import styles from "./TextInputs.module.css";
import animations from "css/animations";
import IndexDropdown from "@/components/search/advancedSearch/fieldInput/indexDropdown/IndexDropdown";

import { useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import Icon from "@/components/base/icon";
import workTypesLabels from "./labels.json";
import Input from "@/components/base/forms/input";
import { useData } from "@/lib/api/api";
import * as suggestFragments from "@/lib/api/suggest.fragments";
import { useAdvancedSearchContext } from "@/components/search/advancedSearch/context";
import { LogicalOperatorsEnum } from "@/components/search/enums";

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
          selected={fieldValue.prefixLogicalOperator}
        />
      )}

      <div className={styles.inputContainer}>
        <IndexDropdown
          options={labels}
          className={styles.select}
          index={index}
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
const options = Object.keys(LogicalOperatorsEnum); //["AND", "OR", "NOT"];
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
        <Text
          type="text4"
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
  const { inputFields, addInputField, removeInputField, handlePrefixChange } =
    useAdvancedSearchContext();

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
