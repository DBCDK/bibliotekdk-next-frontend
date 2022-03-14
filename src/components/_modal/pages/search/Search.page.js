import React, { useEffect } from "react";

import Top from "../base/top";

import Title from "@/components/base/title";
import Label from "@/components/base/forms/label";
import Text from "@/components/base/text";
import Link from "@/components/base/link";
import Button from "@/components/base/button";
import Input from "@/components/base/forms/input";

import Translate from "@/components/base/translate";

import useFilters from "@/components/hooks/useFilters";
import useQ from "@/components/hooks/useQ";

import { useData } from "@/lib/api/api";
import { hitcount } from "@/lib/api/search.fragments";
import styles from "./Search.module.css";

// import { Provider } from "./Search.suggester";

/**
 * The Component function
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export function Search({
  q,
  data,
  isLoading,
  workType,
  onSubmit,
  onChange,
  onBlur,
  onClear,
  modal,
}) {
  // Get workType specific labels if set, else fallback to a general text
  const labelTitle = Translate({
    context: "search",
    label: workType ? `label-${workType}-title` : `label-title`,
  });
  const labelCreator = Translate({
    context: "search",
    label: workType ? `label-${workType}-creator` : `label-creator`,
  });
  const labelSubject = Translate({
    context: "search",
    label: workType ? `label-${workType}-subject` : `label-subject`,
  });

  // Get workType specific placeholders if set, else fallback to a general text
  const placeholderTitle = Translate({
    context: "search",
    label: workType ? `label-${workType}-title` : `label-title`,
  });
  const placeholderCreator = Translate({
    context: "search",
    label: workType ? `label-${workType}-creator` : `label-creator`,
  });
  const placeholderSubject = Translate({
    context: "search",
    label: workType ? `label-${workType}-subject` : `label-subject`,
  });

  return (
    <div className={`${styles.search}`} data-cy="search-modal">
      <Top modal={modal} />
      <span className={styles.wrap}>
        <Title type="title4" className={styles.title}>
          {Translate({
            context: "modal",
            label: "title-search",
          })}
        </Title>
        <Link
          dataCy="clear-all-search"
          className={styles.clear}
          onClick={() => onClear && onClear()}
          border={{ bottom: { keepVisible: true } }}
        >
          <Text type="text3">
            {Translate({
              context: "general",
              label: "clearAll",
            })}
          </Text>
        </Link>
      </span>

      <form>
        <Label for="search-title" skeleton={isLoading}>
          {labelTitle}
        </Label>

        <Label for="search-creator" skeleton={isLoading}>
          {labelCreator}
        </Label>
        <Input
          id="search-creator"
          dataCy="search-input-creator"
          value={q.creator}
          placeholder={placeholderCreator}
          onBlur={(e) => {
            const val = e?.target?.value;
            q.creator !== val && onChange({ creator: val });
          }}
        />
        <Label for="search-subject" skeleton={isLoading}>
          {labelSubject}
        </Label>
        <Input
          id="search-subject"
          dataCy="search-input-subject"
          value={q.subject}
          placeholder={placeholderSubject}
          onBlur={(e) => {
            const val = e?.target?.value;
            q.subject !== val && onChange({ subject: val });
          }}
        />
      </form>

      <Button
        dataCy="search-button-submit"
        skeleton={isLoading}
        onClick={() => onSubmit && onSubmit()}
        className={styles.submit}
      >
        {Translate({
          context: "search",
          label: "showXResults",
          vars: [`${data.hitcount}`],
        })}
      </Button>
    </div>
  );
}

export default function Wrap(props) {
  const { modal } = props;

  // update query params when modal closes
  useEffect(() => {
    if (!modal.isVisible && modal.hasBeenVisible) {
      setQuery({ exclude: ["modal"] });
    }
  }, [modal.isVisible]);

  // connect useQ hook
  const { q, setQ, clearQ, setQuery, hasQuery } = useQ();

  // connected filters hook
  const { filters } = useFilters();

  // extract selected workType, if any
  const workType = filters.workType?.[0];

  // hitcount according to selected filters
  const { data, isLoading } = useData(hasQuery && hitcount({ q, filters }));

  return (
    <Search
      q={q}
      data={{ hitcount: data?.search?.hitcount }}
      workType={workType}
      isLoading={isLoading}
      onChange={(selected) => setQ({ ...q, ...selected })}
      onBlur={(selected) => setQ({ ...q, ...selected })}
      onSubmit={() => setQuery({ exclude: ["modal"] })}
      onClear={() => clearQ({ exclude: ["all"] })}
      {...props}
    />
  );
}
