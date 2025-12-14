import Router, { useRouter } from "next/router";
import Container from "react-bootstrap/Container";
import PropTypes from "prop-types";
import AutoSuggest from "react-autosuggest";
import AutosuggestHighlightMatch from "autosuggest-highlight/match";
import AutosuggestHighlightParse from "autosuggest-highlight/parse";

import {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";

import useQ from "@/components/hooks/useQ";
import useFilters from "@/components/hooks/useFilters";

import { useData } from "@/lib/api/api";
import * as suggestFragments from "@/lib/api/suggest.fragments";

import { cyKey } from "@/utils/trim";

import Translate from "@/components/base/translate";
import Icon from "@/components/base/icon";
import Text from "@/components/base/text";

import History from "@/components/search/history";

import ArrowSvg from "@/public/icons/arrowleft.svg";
import ClearSvg from "@/public/icons/close.svg";

import styles from "./Suggester.module.css";

import useDataCollect from "@/lib/useDataCollect";
import { SuggestTypeEnum } from "@/lib/enums";
import useBreakpoint from "@/components/hooks/useBreakpoint";

const context = { context: "suggester" };

const theme = {
  container: `react-autosuggest__container`,
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

export function openMobileSuggester(router = Router) {
  router.push({
    pathname: router.pathname,
    query: { ...router.query, suggester: true },
  });
  focusInput();
  setTimeout(() => focusInput(), 100);
}

export function focusInput() {
  document.getElementById("suggester-input")?.focus();
}

export function blurInput() {
  document.getElementById("suggester-input")?.blur();
}

function highlightMatch(suggestion, query) {
  const matches = AutosuggestHighlightMatch(suggestion, query);
  const parts = AutosuggestHighlightParse(suggestion, matches);

  return (
    <span>
      {parts.map((part, index) => (
        <span
          key={index}
          className={
            part.highlight
              ? `${styles.match} react-autosuggest__suggestion-match`
              : null
          }
        >
          {part.text}
        </span>
      ))}
    </span>
  );
}

function renderSuggestionsContainer(containerProps, children, isHistory) {
  return (
    <div
      {...containerProps}
      aria-label={Translate({ ...context, label: "suggestions" })}
      className={`${containerProps.className} ${
        isHistory ? styles.suggestions_container__open : ""
      }`}
      data-cy={cyKey({ name: "container", prefix: "suggester" })}
    >
      {isHistory ? (
        <Container>
          <History className={styles.history} />
        </Container>
      ) : (
        children
      )}
    </div>
  );
}

export function renderSuggestion(data, query, skeleton) {
  const isHistory = data.type === SuggestTypeEnum.HISTORY;

  const cy = `suggester-${data.type}-element`.toLowerCase();

  const highlight = highlightMatch(data.term, query);

  return (
    <div className={styles.element} data-cy={cy}>
      {isHistory && (
        <Icon
          className={styles.icon}
          src="history.svg"
          bgColor="transparent"
          skeleton={skeleton}
          alt=""
        />
      )}
      <div className={styles.text}>
        <Text
          type="text2"
          className={styles.title}
          skeleton={skeleton}
          lines={2}
        >
          {highlight}
        </Text>
      </div>
    </div>
  );
}

export function getPlaceholder(isMobile, selectedMaterial) {
  if (!selectedMaterial || selectedMaterial === SuggestTypeEnum.ALL) {
    return Translate({
      ...context,
      label: isMobile ? "placeholderMobile" : "placeholder",
    });
  }
  const matLabel = Translate({
    context: "facets",
    label: `label-${selectedMaterial}`,
  }).toLowerCase();
  return Translate({
    context: "suggester",
    label: "placeholderRelative",
    vars: [matLabel],
  });
}

function renderInputComponent(
  inputProps,
  isMobile,
  selectedMaterial,
  onClose,
  onClear
) {
  const placeholder = getPlaceholder(isMobile, selectedMaterial);
  const showClear = inputProps.value !== "";

  const isMobileClass = isMobile ? styles.isMobile : "";

  return (
    <div className={`${styles.input_wrap} ${isMobileClass}`}>
      <button
        className={styles.arrow}
        data-cy={cyKey({ name: "arrow-close", prefix: "suggester" })}
        onClick={onClose}
      >
        <Icon size={{ w: "auto", h: 2 }} alt="">
          <ArrowSvg />
        </Icon>
      </button>
      <input
        {...inputProps}
        id="suggester-input"
        placeholder={placeholder}
        className={inputProps.className}
        title={placeholder}
        data-cy={cyKey({ name: "input", prefix: "suggester" })}
      />
      <span
        className={`${styles.clear} ${showClear ? styles.visible : ""}`}
        onMouseDown={(e) => {
          e.preventDefault();
          onClear();
          setTimeout(() => focusInput(), 0);
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

export const Suggester = forwardRef(function Suggester(
  {
    query = "",
    suggestions = [],
    onChange = null,
    onClose = null,
    onSelect = null,
    isMobile = false,
    skeleton = false,
    history = [],
    selectedMaterial = null,
    onKeyDown = null,
  },
  ref
) {
  const placeholder = getPlaceholder(isMobile, selectedMaterial);
  const [intQuery, setIntQuery] = useState(query);

  useImperativeHandle(ref, () => ({
    submit() {
      if (intQuery) {
        blurInput();
        onSelect?.(intQuery);
      }
    },
  }));

  useEffect(() => {
    if (query !== intQuery) {
      setIntQuery(query);
    }
  }, [query]);

  const isHistory = !!(isMobile && query === "");

  useEffect(() => {
    const wrapper =
      document.getElementById("suggester-input")?.parentNode?.parentNode;
    if (wrapper) {
      wrapper.setAttribute("aria-label", placeholder);
    }
  }, [placeholder]);

  const inputProps = {
    value: intQuery,
    onBlur: (event, { highlightedSuggestion }) => {
      if (highlightedSuggestion) {
        onChange?.(highlightedSuggestion.term);
      }
    },
    onChange: (event, { newValue }) => {
      if (newValue === "") onChange?.("");
      setIntQuery(newValue);
    },
    onKeyDown: (e) => {
      onKeyDown?.(e);
    },
    onFocus: (e) => {
      e.currentTarget.setSelectionRange(
        e.currentTarget.value.length,
        e.currentTarget.value.length
      );
    },
  };

  return (
    <AutoSuggest
      theme={theme}
      focusInputOnSuggestionClick={false}
      alwaysRenderSuggestions={isMobile}
      suggestions={isHistory ? history : suggestions.map((s) => ({ ...s }))}
      onSuggestionsFetchRequested={({ value, reason }) => {
        if (reason === "input-changed") {
          onChange?.(value);
        }
      }}
      onSuggestionsClearRequested={() => {}}
      onSuggestionSelected={(
        _,
        { suggestion, suggestionValue, suggestionIndex }
      ) => {
        _.preventBubbleHack = true;
        blurInput();
        onSelect?.(suggestionValue, suggestion, suggestionIndex);
        const shouldClear =
          isMobile || suggestion?.type === SuggestTypeEnum.TITLE;
        onChange?.(suggestionValue);
        if (shouldClear) setIntQuery("");
      }}
      renderSuggestionsContainer={(props) =>
        renderSuggestionsContainer(
          props.containerProps,
          props.children,
          isHistory
        )
      }
      getSuggestionValue={(s) => s.term}
      renderSuggestion={(s, { query }) => renderSuggestion(s, query, skeleton)}
      renderInputComponent={(inputProps) =>
        renderInputComponent(
          inputProps,
          isMobile,
          selectedMaterial,
          onClose,
          () => {
            setIntQuery("");
            onChange?.("");
          }
        )
      }
      highlightFirstSuggestion={false}
      inputProps={inputProps}
    />
  );
});

export default function Wrap(props) {
  let { className } = props;
  const { onChange } = props;
  const dataCollect = useDataCollect();
  const { filters } = useFilters();
  const { q } = useQ();
  const router = useRouter();

  const breakpoint = useBreakpoint();
  const isMobileSize = ["xs", "sm", "md"].includes(breakpoint);

  const isMobileSuggester = isMobileSize && router?.query?.suggester;

  const query = q[SuggestTypeEnum.ALL];
  const [selected, setSelected] = useState();
  const workType = filters.workTypes?.[0] || null;

  const { data, isLoading } = useData(
    query &&
      query !== selected &&
      suggestFragments.all({ q: query, workType, limit: 10 })
  );

  const hasPresentedRef = useRef();

  useEffect(() => {
    if (query && data?.suggest?.result && hasPresentedRef.current !== query) {
      hasPresentedRef.current = query;
      dataCollect.collectSuggestPresented({
        query,
        suggestions: data.suggest.result,
      });
    }
  }, [query, data?.suggest?.result]);

  // autofocus if query param focus=1 is set
  useEffect(() => {
    if (!router.isReady) return;
    if (router.query.focus !== "1") return;

    requestAnimationFrame(() => {
      setTimeout(() => focusInput(), 150);
    });
  }, [router.isReady, router.query.focus]);

  if (props.skeleton || isLoading) {
    className = `${className} ${styles.skeleton}`;
  }

  const isMobileClass = isMobileSuggester ? styles.isMobile : "";

  return (
    <div className={`${styles.container} ${isMobileClass} ${className}`}>
      <Suggester
        {...props}
        isMobile={isMobileSuggester}
        onChange={(q) => onChange?.(q)}
        onSelect={(value, suggestion, index) => {
          setSelected(value);
          props.onSelect(value, suggestion);
          dataCollect.collectSuggestClick({
            query,
            suggestion,
            suggest_query_hit: index + 1,
          });
        }}
        className={className}
        skeleton={isLoading}
        query={query}
        suggestions={data?.suggest?.result || []}
        selectedMaterial={workType}
      />
    </div>
  );
}

Wrap.propTypes = {
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onChange: PropTypes.func,
  onSelect: PropTypes.func,
  skeleton: PropTypes.bool,
};
