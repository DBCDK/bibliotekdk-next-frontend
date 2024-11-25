import Router from "next/router";

import PropTypes from "prop-types";
import AutoSuggest from "react-autosuggest";
import AutosuggestHighlightMatch from "autosuggest-highlight/match";
import AutosuggestHighlightParse from "autosuggest-highlight/parse";

import { useState, useEffect, useMemo } from "react";

import useQ from "@/components/hooks/useQ";
import useFilters from "@/components/hooks/useFilters";

import { useData } from "@/lib/api/api";
import * as suggestFragments from "@/lib/api/suggest.fragments";

import { cyKey } from "@/utils/trim";

import Translate from "@/components/base/translate";
import Icon from "@/components/base/icon";
import Text from "@/components/base/text";
import Link from "@/components/base/link";

import ArrowSvg from "@/public/icons/arrowleft.svg";
import ClearSvg from "@/public/icons/close.svg";

// Templates fro suggester results
import Creator from "./templates/creator";
import Work from "./templates/work";
import Subject from "./templates/subject";
import History from "./templates/history";

import styles from "./Suggester.module.css";

import useDataCollect from "@/lib/useDataCollect";
import { SuggestTypeEnum } from "@/lib/enums";
import cx from "classnames";

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
 * Function to open mobile suggester
 *
 */
export function openMobileSuggester(router = Router) {
  router.push({
    pathname: router.pathname,
    query: { ...router.query, suggester: true },
  });
  // ios devices require focus to be called
  // while executing the click event
  focusInput();

  setTimeout(() => {
    focusInput();
  }, 100);
}

/**
 * Function to focus suggester input field
 *
 */
export function focusInput() {
  document.getElementById("suggester-input").focus();
}

/**
 * Function to blur suggester input field
 *
 */
export function blurInput() {
  document.getElementById("suggester-input").blur();
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
function renderSuggestionsContainer(
  containerProps,
  children,
  isHistory,
  clearHistory
) {
  const keepVisibleClass = isHistory ? styles.suggestions_container__open : "";

  return (
    <div
      {...containerProps}
      aria-label={Translate({ ...context, label: "suggestions" })}
      className={`${containerProps.className} ${keepVisibleClass}`}
      data-cy={cyKey({ name: "container", prefix: "suggester" })}
    >
      {isHistory && (
        <div className={styles.history}>
          <Text type="text1" className={styles.title}>
            {Translate({ ...context, label: "historyTitle" })}
          </Text>

          <Text
            dataCy={cyKey({ name: "clear-history", prefix: "suggester" })}
            type="text1"
            className={styles.clear}
            onClick={() => clearHistory()}
          >
            <Link
              tag="span"
              onClick={(e) => e.preventDefault()}
              border={{ bottom: { keepVisible: true } }}
            >
              {Translate({ ...context, label: "historyClear" })}
            </Link>
          </Text>
        </div>
      )}
      {children}
    </div>
  );
}

/**
 * Custom suggestions
 *
 */
function renderSuggestion(suggestion, query, skeleton) {
  const value = suggestion.term;

  // Add to suggestion object
  suggestion.highlight = highlightMatch(value, query);

  switch (suggestion?.type?.toLowerCase()) {
    case SuggestTypeEnum.CREATOR:
      return <Creator data={suggestion} skeleton={skeleton} />;
    case SuggestTypeEnum.TITLE:
      return <Work data={suggestion} skeleton={skeleton} />;
    case SuggestTypeEnum.SUBJECT:
      return <Subject data={suggestion} skeleton={skeleton} />;
    case SuggestTypeEnum.HISTORY:
      return <History data={suggestion} skeleton={skeleton} />;
    // TODO: OBS: Hvordan skal dette egentlig renderes? Som <Work /> ligesom her?
    case SuggestTypeEnum.COMPOSITE:
      return <Work data={suggestion} skeleteon={skeleton} />;
    default:
      return null;
  }
}

/**
 * Returns placeholder for suggester input field
 *
 * @param {boolean} isMobile
 * @param {string} selectedMaterial
 * @returns {string}
 */
function getPlaceholder(isMobile, selectedMaterial) {
  let placeholder = Translate({
    ...context,
    label: isMobile ? "placeholderMobile" : "placeholder",
  });
  if (selectedMaterial) {
    const isAll = selectedMaterial === SuggestTypeEnum.ALL;

    // Update placeholder if specific workType is selected
    if (!isAll) {
      placeholder = Translate({
        context: "suggester",
        label: "placeholderRelative",
        vars: [
          Translate({
            context: "facets",
            label: `label-${selectedMaterial}`,
          }).toLowerCase(),
        ],
      });
    }
  }
  return placeholder;
}

/**
 * Custom input field
 *
 */
function renderInputComponent(
  inputProps,
  isMobile,
  selectedMaterial,
  onClose,
  onClear
) {
  const placeholder = getPlaceholder(isMobile, selectedMaterial);

  const props = {
    ...inputProps,
    id: "suggester-input",
    placeholder,
    "data-cy": cyKey({ name: "input", prefix: "suggester" }),
  };

  // Clear/Cross should be visible
  const showClear = Boolean(inputProps.value !== "");

  // Class for clear/cross button
  const clearVisibleClass = showClear ? styles.visible : "";

  return (
    <div className={styles.input_wrap}>
      <span
        className={styles.arrow}
        data-cy={cyKey({ name: "arrow-close", prefix: "suggester" })}
        onClick={() => {
          // onClear();
          onClose();
        }}
      >
        <Icon size={{ w: "auto", h: 2 }} alt="">
          <ArrowSvg />
        </Icon>
      </span>
      <input {...props} className={cx(props.className)} title={placeholder} />
      <span
        className={`${styles.clear} ${clearVisibleClass}`}
        onClick={() => {
          onClear();
          focusInput();
        }}
        data-cy={cyKey({ name: "clear-input", prefix: "suggester" })}
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
export function Suggester({
  className = "",
  query = "",
  suggestions = [],
  onChange = null,
  onClose = null,
  onSelect = null,
  isMobile = false,
  skeleton = false,
  history = [],
  clearHistory = null,
  selectedMaterial = null,
  onKeyDown = null,
}) {
  const placeholder = getPlaceholder(isMobile, selectedMaterial);

  // Make copy of all suggestion objects
  // react-autosuggest will mutate these objects,
  // and data from swr must not be mutated (may lead to endless loop)
  suggestions = useMemo(
    () => suggestions.map((suggestion) => ({ ...suggestion })),
    [suggestions]
  );

  /**
   * Internal query state is needed for arrow navigation in suggester.
   * When using arrow up/down, the value changes in the inputfield, but we dont
   * want to trigger the query callback.
   */
  const [intQuery, setIntQuery] = useState(query);

  // Its a mess with internal states all over the place
  // At some point look into it
  useEffect(() => {
    if (query !== intQuery) {
      setIntQuery(query);
    }
  }, [query]);

  // Flag that history is used in suggester
  const isHistory = !!(isMobile && query === "");

  // Create theme container with className prop
  useEffect(() => {
    theme.container = `${styles.container} ${className} react-autosuggest__container`;
  }, [className]);

  useEffect(() => {
    // This is for accessibility only
    // react-autosuggest doesn't seem to support
    // aria-label on the wrapper div. Hence we do this..
    const wrapper =
      document.getElementById("suggester-input")?.parentNode?.parentNode;

    if (wrapper) {
      wrapper.setAttribute("aria-label", placeholder);
    }
  }, [placeholder]);

  // Default input props
  const inputProps = {
    value: intQuery,
    onBlur: (event, { highlightedSuggestion }) => {
      // Update value in header on e.g. tab key
      if (highlightedSuggestion) {
        const value = highlightedSuggestion.term;
        onChange && onChange(value);
      }
    },
    onChange: (event, { newValue }) => {
      // For updating onChange when deleting last char in input
      newValue === "" && onChange && onChange("");
      // internal query update
      setIntQuery(newValue);
    },
    onKeyDown: onKeyDown,
    onFocus: (e) =>
      e.currentTarget.setSelectionRange(
        e.currentTarget.value.length,
        e.currentTarget.value.length
      ),
  };

  return (
    <AutoSuggest
      theme={theme}
      focusInputOnSuggestionClick={false}
      alwaysRenderSuggestions={!!isMobile}
      // shouldRenderSuggestions={shouldRenderSuggestions}
      suggestions={isHistory ? history : suggestions}
      onSuggestionsFetchRequested={({ value, reason }) => {
        if (reason === "input-changed") {
          onChange && onChange(value);
        }
      }}
      onSuggestionsClearRequested={() => {
        // func is required
      }}
      onSuggestionSelected={(_, entry) => {
        const { suggestionValue, suggestion } = entry;

        // Blur input onselect
        blurInput();
        // Action
        onSelect &&
          onSelect(suggestionValue, suggestion, entry.suggestionIndex);

        // Clear Query
        const shouldClear =
          isMobile || suggestion?.type === SuggestTypeEnum.TITLE;
        onChange && onChange(suggestionValue);
        shouldClear && setIntQuery("");
      }}
      renderSuggestionsContainer={(props) =>
        renderSuggestionsContainer(
          props.containerProps,
          props.children,
          isHistory,
          clearHistory
        )
      }
      getSuggestionValue={(suggestion) => suggestion.term}
      renderSuggestion={(suggestion, { query }) =>
        renderSuggestion(suggestion, query, skeleton)
      }
      renderInputComponent={(inputProps) =>
        renderInputComponent(
          inputProps,
          isMobile,
          selectedMaterial,
          onClose,
          () => {
            setIntQuery("");
            onChange && onChange("");
          }
        )
      }
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
  let { className } = props;
  const { onChange } = props;

  const dataCollect = useDataCollect();
  const { filters } = useFilters();
  const { q } = useQ();

  const query = q[SuggestTypeEnum.ALL];

  const [selected, setSelected] = useState();

  const workType = filters.workTypes?.[0] || null;

  const { data, isLoading } = useData(
    query &&
      query !== selected &&
      suggestFragments.all({ q: query, workType: workType, limit: 10 })
  );

  useEffect(() => {
    // Collect data
    // User is presented with suggestions
    if (query && data?.suggest?.result) {
      dataCollect.collectSuggestPresented({
        query,
        suggestions: data.suggest.result,
      });
    }
  }, [data]);

  if (props.skeleton || isLoading) {
    className = `${className} ${styles.skeleton}`;
  }
  return (
    <Suggester
      {...props}
      onChange={(q) => onChange && onChange(q)}
      onSelect={(suggestionValue, suggestion, suggestionIndex) => {
        setSelected(suggestionValue);
        props.onSelect(suggestionValue, suggestion);
        dataCollect.collectSuggestClick({
          query,
          suggestion,
          suggest_query_hit: suggestionIndex + 1,
        });
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          console.log("FISK", suggestion);
          props.onKeyDown(suggestion, e.target.value);
        }
      }}
      className={className}
      skeleton={isLoading}
      query={query}
      suggestions={(data && data.suggest && data.suggest.result) || []}
      selectedMaterial={workType}
    />
  );
}

// PropTypes for component
Wrap.propTypes = {
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onChange: PropTypes.func,
  onSelect: PropTypes.func,
  onKeyDown: PropTypes.func,
  skeleton: PropTypes.bool,
};
