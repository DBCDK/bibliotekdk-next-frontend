import Translate from "@/components/base/translate/Translate";
import Text from "@/components/base/text";
import Suggester from "@/components/base/suggester/Suggester";
import styles from "./TextInputs.module.css";
import animations from "@/components/base/animation/animations.module.css";
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
function FieldInput({ index, numberOfItems, fieldValue, onSearch }) {
  const [suggestions, setSuggestions] = useState([]);
  const [lastSelected, setLastSelected] = useState("");

  const inputId = `input-field-${index}`;
  const {
    handleInputFieldChange,
    removeInputField,
    handleLogicalOperatorChange,
    workType,
    setSuggesterTid,
  } = useAdvancedSearchContext();
  //labels to show in SearchIndexDropdown
  //TODO: change to use workType instead of hardcoded. workTypesLabels does not have data for all worktypes. We use only "all" only for now for now.
  //  const labels = workTypesLabels[workType].map((el) => el.index);

  // we need the full object for mapping
  const labels = workTypesLabels[workType];

  const placeholder = Translate({
    context: "search",
    label: `advanced-placeholder-${
      fieldValue?.label || fieldValue?.searchIndex
    }`,
  });

  const isFirstItem = index === 0;
  const isLastItem = numberOfItems === 1;

  // this is a bit quicky - should probably get the csType
  // from advancedSearchContext
  const csTypeMap = { function: "creator" };
  const indexType = fieldValue.searchIndex;
  const csType = indexType?.split(".")[1];
  const mappedCsType = csTypeMap[csType] || csType;

  /** @TODO csSuggest supports 4 indexer for now .. whatabout the NOT supported ? **/
  const { data } = useData(
    fieldValue?.value &&
      fieldValue?.value !== lastSelected &&
      suggestFragments.csSuggest({ q: fieldValue.value, type: mappedCsType })
  );

  useEffect(() => {
    const raw = data?.complexSuggest?.result ?? [];
    const effective = fieldValue.value === lastSelected ? [] : raw;
    setSuggestions(
      effective.map((res) => ({ value: res.term, traceId: res.traceId }))
    );
  }, [data]);

  return (
    <div className={styles.row} key={inputId}>
      {!isFirstItem && (
        <LogicalOperatorDropDown
          onSelect={(value) => handleLogicalOperatorChange(index, value)}
          selected={fieldValue.prefixLogicalOperator}
        />
      )}

      <div className={styles.inputContainer}>
        <SearchIndexDropdown
          options={labels}
          className={styles.select}
          index={index}
        />

        <div className={`${styles.suggesterContainer} `}>
          <Suggester
            id={inputId}
            data={suggestions}
            onSelect={(selectValue, suggestionObject) => {
              setLastSelected(selectValue);
              const traceId = suggestionObject?.traceId;
              setTimeout(() => {
                // onSelect should be called after onChange. Otherwise onChange wil overrite the selected value
                handleInputFieldChange(index, selectValue);
                setSuggesterTid(traceId);
              }, 0);
              //
            }}
            onClear={() => {
              handleInputFieldChange(index, "");
              setSuggesterTid("");
              setLastSelected("");
            }}
            className={styles.suggester}
            initialValue={`${fieldValue.value}`}
          >
            <Input
              id={inputId}
              dataCy={`advanced-search-inputfield-${index}`}
              className={styles.suggesterInput}
              value={fieldValue?.value}
              onChange={(e) => {
                handleInputFieldChange(index, e.target.value);
                //reset suggesterTid when user types
                setSuggesterTid("");
                setLastSelected("");
              }}
              placeholder={placeholder}
              overrideValueControl={true}
              tabIndex="0"
              // onKeyDown overrides suggesters onKeyDown, and we don't want that
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  onSearch();
                }
              }}
            />
          </Suggester>
        </div>

        <Icon
          className={styles.removeIcon}
          // can't delete last item
          disabled={isLastItem}
          dataCy={"advanced-search-remove-input"}
          onClick={() => removeInputField(index)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              removeInputField(index);
            }
          }}
          size={{ w: 3, h: "auto" }}
          alt=""
          src={"trash-2.svg"}
          tabIndex={isLastItem ? "-1" : "0"}
        />
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
export function LogicalOperatorDropDown({
  onSelect,
  selected = "AND",
  className,
}) {
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
export default function TextInputs({ handleSearch }) {
  const { inputFields, addInputField } = useAdvancedSearchContext();

  return (
    <>
      {inputFields?.map((field, index) => {
        return (
          <FieldInput
            key={`inputField-${index}`}
            index={index}
            numberOfItems={inputFields.length}
            fieldValue={field}
            onSearch={handleSearch}
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
