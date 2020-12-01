import PropTypes from "prop-types";
import AutoSuggest from "react-autosuggest";
import { Container, Row, Col } from "react-bootstrap";

// Removed when real search input comes
import { useState } from "react";

import { cyKey } from "@/utils/trim";

import Translate from "@/components/base/translate";

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

// Dummy data
const companies = [
  { id: 1, name: "Company1" },
  { id: 2, name: "Company2" },
  { id: 3, name: "Company3" },
  { id: 4, name: "Company4" },
  { id: 5, name: "Company5" },
  { id: 6, name: "Company6" },
  { id: 7, name: "Company7" },
];

const lowerCasedCompanies = companies.map((company) => {
  return {
    id: company.id,
    name: company.name.toLowerCase(),
  };
});

/**
 * The Component function
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
function Suggester({ className = "" }) {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  /**
   * Custom suggestion container
   *
   */
  function renderSuggestionsContainer({ containerProps, children, query }) {
    return (
      <div {...containerProps}>
        {children}
        <div>
          Press Enter to search <strong>{query}</strong>
        </div>
      </div>
    );
  }

  /**
   * Custom suggestions
   *
   */
  function renderSuggestion(suggestion) {
    return <span>{suggestion.name}</span>;
  }

  /**
   * Handle suggestion data
   *
   */
  function getSuggestions(value) {
    return lowerCasedCompanies.filter((company) =>
      company.name.includes(value.trim().toLowerCase())
    );
  }

  /**
   * Custom input field
   *
   */
  function renderInputComponent(inputProps) {
    const props = {
      ...inputProps,
      placeholder: "Type 'c'",
    };

    return <input {...props} />;
  }

  //   Default input props
  const inputProps = {
    value,
    onChange: (event, { newValue }, method) => {
      setValue(newValue);
    },
  };

  return (
    <AutoSuggest
      theme={theme}
      suggestions={suggestions}
      onSuggestionsClearRequested={() => setSuggestions([])}
      onSuggestionsFetchRequested={({ value }) => {
        setValue(value);
        setSuggestions(getSuggestions(value));
      }}
      onSuggestionSelected={(_, { suggestionValue }) =>
        console.log("Selected: " + suggestionValue)
      }
      renderSuggestionsContainer={(props) => renderSuggestionsContainer(props)}
      getSuggestionValue={(suggestion) => suggestion.name}
      renderSuggestion={(suggestion) => renderSuggestion(suggestion)}
      renderInputComponent={(inputProps) => renderInputComponent(inputProps)}
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
  if (props.skeleton) {
    return <SuggesterSkeleton {...props} />;
  }

  return <Suggester {...props} />;
}

// PropTypes for component
Wrap.propTypes = {
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  skeleton: PropTypes.bool,
};
