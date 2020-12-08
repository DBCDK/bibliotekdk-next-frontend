import PropTypes from "prop-types";
import AutoSuggest from "react-autosuggest";
// import { isMobile } from "react-device-detect";
import AutosuggestHighlightMatch from "autosuggest-highlight/match";
import AutosuggestHighlightParse from "autosuggest-highlight/parse";
import { Container, Row, Col } from "react-bootstrap";

import { useState, useMemo, useEffect } from "react";

import { useData } from "@/lib/api/api";
import * as suggestFragments from "@/lib/api/suggest.fragments";

import { cyKey } from "@/utils/trim";

import Translate from "@/components/base/translate";
import Icon from "@/components/base/icon";

import ArrowSvg from "@/public/icons/arrowleft.svg";
import ClearSvg from "@/public/icons/close.svg";

// Templates fro suggester results
import Creator from "./templates/creator";
import Work from "./templates/work";
import Subject from "./templates/subject";
import History from "./templates/history";

import styles from "./Suggester.module.css";

// Context
const context = { context: "suggester" };

// Custom theme classes
const theme = {
  container: `${styles.container} react-autosuggest__container`,
  containerOpen: `${styles.container__open} react-autosuggest__container--open`,
  input: `${styles.input} react-autosuggest__input`,
  inputOpen: `${styles.input__open} react-autosuggest__input--open`,
  inputFocused: `${styles.input__focused} react-autosuggest__input--focused`,
  suggestionsContainer: `${styles.suggestions_container} react-autosuggest__suggestions-container`,
  suggestionsContainerOpen: `${styles.suggestions_container__open} react-autosuggest__suggestions-container--open`,
  suggestionsList: `${styles.suggestions_list} react-autosuggest__suggestions-list`,
  suggestion: `${styles.suggestion} react-autosuggest__suggestion`,
  suggestionFirst: "react-autosuggest__suggestion--first",
  suggestionHighlighted: `${styles.suggestion__highlighted} react-autosuggest__suggestion--highlighted`,
  sectionContainer: "react-autosuggest__section-container",
  sectionContainerFirst: "react-autosuggest__section-container--first",
  sectionTitle: "react-autosuggest__section-title",
};

/**
 * Function to GET suggester search history
 *
 */
function getSuggesterHistory() {
  // localStorage is only supported clientSide
  if (typeof window !== "undefined") {
    const str = localStorage.getItem("suggesterHistory") || "[]";
    return JSON.parse(str);
  }

  return [];
}

/**
 * Function to SET suggester search history
 *
 */
function setSuggesterHistory(newValue) {
  let history = getSuggesterHistory();

  // localStorage is only supported clientSide
  if (typeof window !== "undefined") {
    // New history obj
    const obj = {
      __typename: "History",
      value: newValue,
    };

    // Remove duplicates if any
    history = history.filter(
      (h) => h.value.toLowerCase() !== newValue.toLowerCase()
    );

    // Add to beginning of array (latest first)
    history.unshift(obj);

    // onlye save the first 10
    const newArr = history.slice(0, 9);

    // save to storage
    return localStorage.setItem("suggesterHistory", JSON.stringify(newArr));
  }

  return [];
}

/**
 * Function to highlight the match
 *
 */
function highlightMatch(suggestion, query) {
  const matches = AutosuggestHighlightMatch(suggestion, query);
  const parts = AutosuggestHighlightParse(suggestion, matches);

  return (
    <span>
      {parts.map((part, index) => {
        const className = part.highlight
          ? `${styles.match} react-autosuggest__suggestion-match`
          : null;

        return (
          <span className={className} key={index}>
            {part.text}
          </span>
        );
      })}
    </span>
  );
}

/**
 * Custom suggestion container
 *
 */
function renderSuggestionsContainer({ containerProps, children, query }) {
  return <div {...containerProps}>{children}</div>;
}

/**
 * Custom suggestions
 *
 */
function renderSuggestion(suggestion, query, skeleton) {
  const value = suggestion.name || suggestion.value || suggestion.title;

  // Add to suggestion object
  suggestion.highlight = highlightMatch(value, query);

  switch (suggestion.__typename) {
    case "Creator":
      return <Creator data={suggestion} skeleton={skeleton} />;
    case "Work":
      return <Work data={suggestion} skeleton={skeleton} />;
    case "Subject":
      return <Subject data={suggestion} skeleton={skeleton} />;
    case "History":
      return <History data={suggestion} skeleton={skeleton} />;
    default:
      return <span>{"Unknown __typename"}</span>;
  }
}

/**
 * Custom input field
 *
 */
function renderInputComponent(inputProps, isMobile, onClose, onClear) {
  // Set placeholder according to device type
  const placeholder = Translate({
    ...context,
    label: isMobile ? "placeholderMobile" : "placeholder",
  });

  const props = {
    ...inputProps,
    placeholder,
    "data-cy": cyKey({ name: "input", prefix: "suggester" }),
  };

  const showClear = !!(isMobile && inputProps.value !== "");

  const clearVisibleClass = showClear ? styles.visible : "";

  return (
    <div className={styles.input_wrap}>
      <span
        className={styles.arrow}
        onClick={() => {
          onClear();
          onClose();
        }}
      >
        <Icon size={{ w: "auto", h: 2 }}>
          <ArrowSvg />
        </Icon>
      </span>
      <input {...props} />

      <span
        className={`${styles.clear} ${clearVisibleClass}`}
        onClick={onClear}
      >
        <Icon size={{ w: "auto", h: 2 }}>
          <ClearSvg />
        </Icon>
      </span>
    </div>
  );
}

function shouldRenderSuggestions(value, reason) {
  return true;
  // return value.trim().length > 2;
}

/**
 * The Component function
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
function Suggester({
  className = "",
  query = "",
  suggestions = [],
  onChange = null,
  onClose = null,
  onSelect = null,
  isMobile = false,
  skeleton = false,
  isHistory = false,
}) {
  /**
   * Internal query state is needed for arrow navigation in suggester.
   * When using arrow up/down, the value changes in the inputfield, but we dont
   * want to trigger the query callback.
   */
  const [intQuery, setIntQuery] = useState(query);

  // If user did not type any search, show latest history search as suggestions
  if (!intQuery || intQuery === "") {
    // Get history for latest user search (localStorage)
    suggestions = getSuggesterHistory();

    // Flag that history is used in suggester
    isHistory = true;
  }

  console.log("### Suggester => query", query);
  console.log("### Suggester => intQuery", intQuery);

  // Create theme container with className prop
  useEffect(() => {
    theme.container = `${styles.container} ${className} react-autosuggest__container`;
  }, [className]);

  // Default input props
  const inputProps = {
    value: intQuery,
    onChange: (event, { newValue }, method) => {
      setIntQuery(newValue);
    },
  };

  return (
    <AutoSuggest
      theme={theme}
      focusInputOnSuggestionClick={false}
      alwaysRenderSuggestions={isMobile}
      // shouldRenderSuggestions={shouldRenderSuggestions}
      suggestions={suggestions}
      onSuggestionsClearRequested={() => {}}
      onSuggestionsFetchRequested={({ value }) => {
        onChange(value);
      }}
      onSuggestionSelected={(_, { suggestionValue, suggestion, method }) => {
        // Set history
        setSuggesterHistory(suggestionValue);
        // Clear Query
        !isMobile && onChange(suggestionValue);
        isMobile && setIntQuery("");
        isMobile && onChange("");
        // Close suggester on mobile
        isMobile && onClose();

        // Action
        onSelect(suggestionValue);
      }}
      renderSuggestionsContainer={(props) => renderSuggestionsContainer(props)}
      getSuggestionValue={(suggestion) =>
        suggestion.name || suggestion.title || suggestion.value
      }
      renderSuggestion={(suggestion, { query }) =>
        renderSuggestion(suggestion, query, skeleton)
      }
      renderInputComponent={(inputProps) =>
        renderInputComponent(inputProps, isMobile, onClose, () => {
          setIntQuery("");
          onChange("");
        })
      }
      highlightFirstSuggestion={false}
      inputProps={inputProps}
    />
  );
}

/**
 * Function to return skeleton (Loading) version of the Component
 *
 * @param {obj} props
 *  See propTypes for specific props and types
 *
 * @returns {component}
 */
function SuggesterSkeleton(props) {
  return (
    <Suggester
      {...props}
      className={`${props.className} ${styles.skeleton}`}
      skeleton={true}
    />
  );
}

/**
 *  Default export function of the Component
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export default function Wrap(props) {
  let { className } = props;
  const { onChange, onClose } = props;
  const [query, setQuery] = useState("");

  const { data, isLoading, error } = useData(
    suggestFragments.all({ q: query })
  );

  if (props.skeleton || isLoading) {
    className = `${className} ${styles.skeleton}`;
  }

  return (
    <Suggester
      {...props}
      onChange={(query) => {
        onChange && onChange(query);
        setQuery(query);
      }}
      className={className}
      skeleton={isLoading}
      query={query}
      suggestions={(data && data.suggest && data.suggest.result) || []}
    />
  );
}

// PropTypes for component
Wrap.propTypes = {
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onChange: PropTypes.func,
  skeleton: PropTypes.bool,
};
