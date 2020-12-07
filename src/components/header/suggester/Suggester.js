import PropTypes from "prop-types";
import AutoSuggest from "react-autosuggest";
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

// Templates
import Creator from "./templates/creator";
import Work from "./templates/work";
import Subject from "./templates/subject";

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

function highlightSuggestion(suggestion, query) {
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
  suggestion.highlight = highlightSuggestion(value, query);

  switch (suggestion.__typename) {
    case "Creator":
      return <Creator data={suggestion} skeleton={skeleton} />;
    case "Work":
      return <Work data={suggestion} skeleton={skeleton} />;
    case "Subject":
      return <Subject data={suggestion} skeleton={skeleton} />;
    default:
      return <span>{"Unknown __typename"}</span>;
  }
}

/**
 * Custom input field
 *
 */
function renderInputComponent(inputProps, isMobile, onClose) {
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

  return (
    <div className={styles.input_wrap}>
      <Icon
        className={styles.arrow}
        size={{ w: "auto", h: 2 }}
        onClick={onClose}
      >
        <ArrowSvg />
      </Icon>
      <input {...props} />
    </div>
  );
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
  isMobile = false,
  skeleton = false,
}) {
  /**
   * Internal query state is needed for arrow navigation in suggester.
   * When using arrow up/down, the value changes in the inputfield, but we dont
   * want to trigger the query callback.
   */
  const [intQuery, setIntQuery] = useState(query);

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
      suggestions={suggestions}
      onSuggestionsClearRequested={() => {}}
      onSuggestionsFetchRequested={({ value }) => {
        onChange(value);
      }}
      onSuggestionSelected={(_, { suggestionValue }) => {
        console.log("Selected: " + suggestionValue);
        // onChange(suggestionValue);
      }}
      renderSuggestionsContainer={(props) => renderSuggestionsContainer(props)}
      getSuggestionValue={(suggestion) =>
        suggestion.name || suggestion.title || suggestion.value
      }
      renderSuggestion={(suggestion, { query }) =>
        renderSuggestion(suggestion, query, skeleton)
      }
      renderInputComponent={(inputProps) =>
        renderInputComponent(inputProps, isMobile, onClose)
      }
      highlightFirstSuggestion={true}
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
