import React from "react";
import { useState, useEffect, useMemo } from "react";

import merge from "lodash/merge";

import PropTypes from "prop-types";
import AutoSuggest from "react-autosuggest";
import AutosuggestHighlightMatch from "autosuggest-highlight/match";
import AutosuggestHighlightParse from "autosuggest-highlight/parse";

import Translate from "@/components/base/translate";
import Icon from "@/components/base/icon";
import Text from "@/components/base/text";

import ClearSvg from "@/public/icons/close.svg";

import styles from "./Suggester.module.css";

class AutoSuggestFixed extends AutoSuggest {
  componentDidMount(...args) {
    super.componentDidMount(...args);
    this.input = { focus: () => {} };
  }
}

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
 * Function to focus suggester input field
 *
 */
export function focusInput(id) {
  document
    .getElementById(`react-autowhatever-${id}`)
    .parentNode.querySelectorAll("input")[0]
    .focus();
}

/**
 * Function to blur suggester input field
 *
 */
export function blurInput(id) {
  document
    .getElementById(`react-autowhatever-${id}`)
    .parentNode.querySelectorAll("input")[0]
    .blur();
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
function renderSuggestionsContainer(containerProps, children) {
  return (
    <div
      {...containerProps}
      aria-label={Translate({ ...context, label: "suggestions" })}
      data-cy={"suggester-container"}
    >
      {children}
    </div>
  );
}

/**
 * Custom suggestions
 *
 */
function renderSuggestion(suggestion, query, skeleton) {
  // Add to suggestion object
  const highlight = highlightMatch(suggestion.value, query);

  return (
    <div className={styles.suggestion}>
      <Text type="text1" skeleton={skeleton} lines={1}>
        {highlight}
      </Text>
    </div>
  );
}

/**
 * Custom input field
 *
 */
function renderInputComponent({ inputComponent = {}, inputProps, onClear }) {
  // Enrich input components with props
  const input = React.cloneElement(inputComponent, inputProps);

  // Clear/Cross should be visible
  const showClear = inputProps.value !== "";

  // Class for clear/cross button
  const clearVisibleClass = showClear ? styles.visible : "";

  return (
    <div className={styles.input_wrap}>
      {input}
      <span
        data-cy={`${inputProps.dataCy}-clear`}
        className={`${styles.clear} ${clearVisibleClass}`}
        onClick={() => onClear()}
        tabIndex={0}
      >
        <Icon size={{ w: "auto", h: 2 }} alt="">
          <ClearSvg />
        </Icon>
      </span>
    </div>
  );
}

/**
 * The Component function
 *
 * @param {Object} props
 * See propTypes for specific props and types
 *
 * @returns {React.JSX.Element}
 */
function Suggester({
  id = "autosuggest",
  className = "",
  q,
  data = [],
  children,
  skeleton = false,
  onClear = null,
  onSelect = null,
  onChange = null,
  onBlur = null,

  initialValue = "",
}) {
  // Make copy of all suggestion objects
  // react-autosuggest will mutate these objects,
  // and data from swr must not be mutated (may lead to endless loop)
  data = useMemo(() => data.map((d) => ({ ...d })), [data]);

  /**
   * Internal query state is needed for keys navigation in suggester.
   * When using key up/down, the value changes in the inputfield, but we dont
   * want to trigger the query callback.
   */
  const [state, setState] = useState({ q, _q: null });

  // reset on initial change
  useEffect(() => {
    setState({ q: initialValue, _q: null });
  }, [initialValue]);

  // Create theme container with className prop
  useEffect(() => {
    theme.container = `${styles.container} ${className} react-autosuggest__container`;
  }, [className]);

  // Default input props
  const inputProps = {
    value: state._q || state.q,
    onBlur: (e, { highlightedSuggestion }) => {
      // Update value in header on e.g. tab key
      if (highlightedSuggestion) {
        // select suggestion on tab
        // onSelect && onSelect(highlightedSuggestion.value);
        // update value on tab
        onBlur && onBlur(e);
        children?.props?.onBlur?.(e);

        onChange && onChange(e);
        children?.props?.onChange?.(e);
        setState({ q: highlightedSuggestion.value, _q: null });
      }
    },

    // onChange func. is required by autosuggest
    onChange: (e, { newValue }) => {
      // update input value for highlighted suggestion on keydown
      const value = e.target?.value;

      if (e.type === "keydown") {
        setState({ ...state, _q: newValue });
      }
      // Only run onChange update on e.type change
      // Supported in all browsers
      if (e.type === "change") {
        onChange && onChange(e);
        children?.props?.onChange?.(e);
        setState({ q: value, _q: null });
      }
    },
  };

  return (
    <AutoSuggestFixed
      id={id}
      theme={theme}
      suggestions={data}
      shouldRenderSuggestions={(value) => {
        // type to see suggestions
        return value.trim().length > 0;
      }}
      onSuggestionsFetchRequested={({}) => {
        // func is required
      }}
      onSuggestionsClearRequested={() => {
        // func is required
      }}
      onSuggestionSelected={(_, entry) => {
        const { suggestionValue, suggestion, suggestionIndex } = entry;
        onSelect && onSelect(suggestionValue, suggestion, suggestionIndex);
        setState({ q: suggestionValue, _q: null });
        // blurInput(id);
      }}
      renderSuggestionsContainer={(props) =>
        renderSuggestionsContainer(props.containerProps, props.children)
      }
      getSuggestionValue={(suggestion) => suggestion.value}
      renderSuggestion={(suggestion, { query }) =>
        renderSuggestion(suggestion, query, skeleton)
      }
      renderInputComponent={(props) => {
        const merged = merge({}, props, children?.props, {
          value: inputProps.value,
          onChange: (e) => inputProps.onChange(e, { newValue: props?.value }),
        });
        return renderInputComponent({
          inputComponent: children,
          inputProps: merged,
          onClear: () => {
            setState({ q: "", _q: null });
            onClear && onClear();
            focusInput(id);
          },
        });
      }}
      // onSuggestionHighlighted={({ suggestion }) => {
      //   if (suggestion?.value !== state._q) {
      //     setState({ ...state, _q: suggestion?.value });
      //   }
      // }}

      focusInputOnSuggestionClick={false}
      highlightFirstSuggestion={false}
      inputProps={inputProps}
    />
  );
}

/**
 *  Default export function of the Component
 *
 * @param {Object} props
 * See propTypes for specific props and types
 *
 * @returns {React.JSX.Element}
 */
export default function Wrap(props) {
  let { className, data } = props;
  const { skeleton, onSelect, children } = props;

  if (skeleton) {
    className = `${className} ${styles.skeleton}`;
  }
  return (
    <Suggester
      {...props}
      data={data}
      q={children?.props?.value || ""}
      className={className}
      onSelect={(val, obj, i) => {
        onSelect && onSelect(val, obj, i);
      }}
    />
  );
}

// PropTypes for component
Wrap.propTypes = {
  id: PropTypes.string.isRequired,
  data: PropTypes.array,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onSelect: PropTypes.func,
  onClear: PropTypes.func,
  skeleton: PropTypes.bool,
};
