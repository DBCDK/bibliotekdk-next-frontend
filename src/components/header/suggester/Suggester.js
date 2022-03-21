import Router, { useRouter } from "next/router";

import PropTypes from "prop-types";
import AutoSuggest from "react-autosuggest";
import AutosuggestHighlightMatch from "autosuggest-highlight/match";
import AutosuggestHighlightParse from "autosuggest-highlight/parse";

import { useState, useEffect, useMemo } from "react";

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
export function openMobileSuggester() {
  Router.push({
    pathname: Router.pathname,
    query: { ...Router.query, suggester: true },
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
    const isAll = selectedMaterial === "all";

    // Update placeholder if specific worktype is selected
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
  const showClear = !!(isMobile && inputProps.value !== "");

  // Class for clear/cross button
  const clearVisibleClass = showClear ? styles.visible : "";
  return (
    <div className={styles.input_wrap}>
      <span
        className={styles.arrow}
        data-cy={cyKey({ name: "arrow-close", prefix: "suggester" })}
        onClick={() => {
          onClear();
          onClose();
        }}
      >
        <Icon size={{ w: "auto", h: 2 }} alt="">
          <ArrowSvg />
        </Icon>
      </span>

      <input {...props} title={placeholder} />
      <span
        className={`${styles.clear} ${clearVisibleClass}`}
        onClick={() => {
          onClear();
          focusInput();
        }}
      >
        <Icon size={{ w: "auto", h: 2 }} alt="">
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

  // clear queries
  useEffect(() => {
    if (isMobile) {
      // clear internal query + onChange callback
      setIntQuery("");
      onChange && onChange("");
    }
  }, [isMobile]);

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
        const s = highlightedSuggestion;
        const value = s.name || s.title || s.value;
        onChange && onChange(value);
      }
    },
    onChange: (event, { newValue }, method) => {
      console.log(newValue, "INPUT Q");
      // For updating onChange when deleting last char in input
      newValue === "" && onChange && onChange("");
      // internal query update
      setIntQuery(newValue);
    },
  };

  return (
    <AutoSuggest
      theme={theme}
      focusInputOnSuggestionClick={false}
      alwaysRenderSuggestions={!!isMobile}
      // shouldRenderSuggestions={shouldRenderSuggestions}
      suggestions={isHistory ? history : suggestions}
      onSuggestionsClearRequested={() => {
        // clear internal and external query if mobile
        if (isMobile) {
          onChange && onChange("");
          setIntQuery("");
        }
      }}
      onSuggestionsFetchRequested={({ value, reason }) => {
        if (reason === "input-changed") {
          onChange && onChange(value);
        }
      }}
      onSuggestionSelected={(_, entry) => {
        const { suggestionValue, suggestion } = entry;

        // Blur input onselect
        blurInput();
        // Action
        onSelect &&
          onSelect(suggestionValue, suggestion, entry.suggestionIndex);

        // Clear Query
        const shouldClear = isMobile || suggestion?.__typename === "Work";
        onChange && onChange(shouldClear ? "" : suggestionValue);
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
      getSuggestionValue={(suggestion) =>
        suggestion.name || suggestion.title || suggestion.value
      }
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
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export default function Wrap(props) {
  let { className } = props;
  const { onChange } = props;

  const router = useRouter();
  const dataCollect = useDataCollect();
  const { filters } = useFilters();

  const initialQuery = router.query["q.all"] || "";

  const [query, setQuery] = useState(initialQuery);
  const [selected, setSelected] = useState();

  const worktype = filters.workType?.[0] || null;

  const { data, isLoading, error } = useData(
    query && query !== selected && suggestFragments.all({ q: query, worktype })
  );

  // Its a mess with internal states all over the place
  // At some point look into it
  // the URL param "q" should be the single source of truth
  useEffect(() => {
    const all = router.query["q.all"];
    if (all && all !== query) {
      setQuery(all);
    }
  }, [router.query["q.all"]]);

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
      onChange={(q) => {
        onChange && onChange(q);
        setQuery(q);
      }}
      onSelect={(suggestionValue, suggestion, suggestionIndex) => {
        setSelected(suggestionValue);
        props.onSelect({ query: suggestionValue, suggestion: suggestion });
        dataCollect.collectSuggestClick({
          query,
          suggestion,
          suggest_query_hit: suggestionIndex + 1,
        });
      }}
      className={className}
      skeleton={isLoading}
      query={query}
      suggestions={(data && data.suggest && data.suggest.result) || []}
      selectedMaterial={worktype}
    />
  );
}

// PropTypes for component
Wrap.propTypes = {
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onChange: PropTypes.func,
  onSelect: PropTypes.func,
  skeleton: PropTypes.bool,
};
