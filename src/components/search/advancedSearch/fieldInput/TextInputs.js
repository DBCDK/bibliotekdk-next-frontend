import Translate from "@/components/base/translate/Translate";
import Text from "@/components/base/text";
import Suggester from "@/components/base/suggester/Suggester";
import styles from "./TextInputs.module.css";
import animations from "css/animations";
import SearchIndexDropdown from "@/components/search/advancedSearch/fieldInput/searchIndexDropdown/SearchIndexDropdown";
import Button from "@/components/base/button";
import { useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import Icon from "@/components/base/icon";
import workTypesLabels from "./labels.js";
import Input from "@/components/base/forms/input";
import { useData } from "@/lib/api/api";
import * as suggestFragments from "@/lib/api/suggest.fragments";
import { useAdvancedSearchContext } from "@/components/search/advancedSearch/advancedSearchContext";
import { LogicalOperatorsEnum } from "@/components/search/enums";

/**
 * Returns a textinput component and a dropdown to choose which advanced search index to search in
 * @param {Object} props
 * @returns {React.JSX.Element}
 */
function FieldInput({ key, index, fieldValue, doAdvancedSearch }) {
  const [suggestions, setSuggestions] = useState([]);
  const inputId = `complex_suggest__${fieldValue.searchIndex}-${index}`;

  const {
    handleInputFieldChange,
    removeInputField,
    handleLogicalOperatorChange,
    workType,
  } = useAdvancedSearchContext();
  //labels to show in SearchIndexDropdown
  const labels = workTypesLabels[workType].map((el) => el.index);
  const placeholder = Translate({
    context: "search",
    label: `advanced-placeholder-${fieldValue?.searchIndex}`,
  });

  const isFirstItem = index === 0;

  // this is a bit quicky - should probably get the csType
  // from advancedSearchContext
  const csTypeMap = { function: "creator" };
  const indexType = fieldValue.searchIndex;
  const csType = indexType.split(".")[1];
  const mappedCsType = csTypeMap[csType] || csType;

  /** @TODO csSuggest supports 4 indexer for now .. whatabout the NOT supported ? **/
  const { data } = useData(
    fieldValue?.value &&
      suggestFragments.csSuggest({ q: fieldValue.value, type: mappedCsType })
  );

  useEffect(() => {
    setSuggestions(
      data?.complexSuggest?.result?.map((res) => {
        return { value: res.term };
      })
    );
  }, [data]);

  return (
    <div key={key} dataCy={`advanced-search-inputfield-${index}`}>
      {!isFirstItem && (
        <LogicalOperatorDropDown
          onSelect={(value) => handleLogicalOperatorChange(index, value)}
          selected={fieldValue.prefixLogicalOperator}
        />
      )}

      <div className={`${styles.inputContainer} r`}>
        <SearchIndexDropdown
          options={labels}
          className={styles.select}
          index={index}
        />
        <div className={`${styles.suggesterContainer} `}>
          <Suggester
            id={key}
            data={suggestions}
            onSelect={(selectValue) => {
              setTimeout(() => {
                // onSelect should be called after onChange. Otherwise onChange wil overrite the selected value
                handleInputFieldChange(index, selectValue);
              }, 0);
              document?.getElementById(inputId).blur();
            }}
            onClear={() => handleInputFieldChange(index, "")}
            className={styles.suggester}
            initialValue={`${fieldValue.value}`}
          >
            <Input
              id={inputId}
              className={styles.suggesterInput}
              value={fieldValue?.value}
              onChange={(e) => handleInputFieldChange(index, e.target.value)}
              placeholder={placeholder}
              overrideValueControl={true}
              // onKeyDown overrides suggesters onKeyDown, and we don't want that
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();

                  doAdvancedSearch();
                }
              }}
            />
          </Suggester>
          {!isFirstItem && (
            <Icon
              className={styles.removeIcon}
              dataCy={"advanced-search-remove-input"}
              onClick={() => removeInputField(index)}
              size={{ w: 3, h: "auto" }}
              alt=""
              src={"trash-2.svg"}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/** @typedef {Array.<("AND"|"OR"|"NOT"|null)>} LogicalOperatorEnumArray */
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
          dataCy={"advanced-search-logical-operator-dropDown"}
          type="text4"
          className={`${animations["f-border-bottom"]} ${animations["h-border-bottom"]}`}
        >
          {Translate({
            context: "search",
            label: `advanced-dropdown-${selected}`,
          })}
        </Text>
        <Icon
          size={{ w: "2", h: "2" }}
          src={expanded ? "arrowUp.svg" : "arrowDown.svg"}
          alt=""
        />
      </Dropdown.Toggle>

      <Dropdown.Menu className={styles.dropdownmenu}>
        {
          /** @type {LogicalOperatorEnumArray} */ options.map((elem) => {
            return (
              <Dropdown.Item
                tabIndex="-1"
                key={`logicalOperatordropdown-${elem}`}
                className={styles.dropdownitem}
                onClick={() => {
                  onSelect(elem);
                }}
              >
                <Text
                  dataCy={`advanced-search-logical-operator-dropDown-${elem}`}
                  tag="span"
                  type="text3"
                >
                  {Translate({
                    context: "search",
                    label: `advanced-dropdown-${elem}`,
                  })}
                </Text>
              </Dropdown.Item>
            );
          })
        }
      </Dropdown.Menu>
    </Dropdown>
  );
}

/**
 * A dynamic component that can render multiple text inputs for advanced search
 * @param {Object} props
 * @returns {React.JSX.Element}
 */
export default function TextInputs({ doAdvancedSearch }) {
  const { inputFields, addInputField } = useAdvancedSearchContext();

  return (
    <>
      <Text type="text1" className={styles.inputTitle}>
        {Translate({ context: "search", label: "construct-your-search" })}
      </Text>
      {inputFields?.map((field, index) => {
        return (
          <FieldInput
            key={`inputField-${index}`}
            index={index}
            fieldValue={field}
            doAdvancedSearch={doAdvancedSearch}
          />
        );
      })}
      <Button
        type="secondary"
        size="small"
        className={styles.addLine}
        onClick={addInputField}
        icon="expand"
        dataCy={"advanced-search-add-input"}
      >
        <Text>{Translate({ context: "search", label: "addLine" })}</Text>
        <Icon
          className={styles.expandIcon}
          size={{ w: 2, h: "auto" }}
          src={"expand.svg"}
        />
      </Button>
    </>
  );
}
