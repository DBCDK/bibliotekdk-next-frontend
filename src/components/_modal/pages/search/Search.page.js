import { useEffect, useMemo, useState } from "react";

import merge from "lodash/merge";

import Top from "../base/top";

import Title from "@/components/base/title";
import Label from "@/components/base/forms/label";
import Text from "@/components/base/text";
import Link from "@/components/base/link";
import Button from "@/components/base/button";
import Input from "@/components/base/forms/input";

import Translate from "@/components/base/translate";

import useFilters, { includedTypes } from "@/components/hooks/useFilters";
import useQ from "@/components/hooks/useQ";

import { useData } from "@/lib/api/api";
import { facets, hitcount } from "@/lib/api/search.fragments";

import animations from "@/components/base/animation/animations.module.css";
import styles from "./Search.module.css";

/**
 * The Component function
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export function Search({
  data,
  isLoading,
  workType,
  onSubmit,
  onChange,
  onClear,
  modal,
  context,
}) {
  return (
    <div className={`${styles.search}`} data-cy="search-modal">
      <Top modal={modal} back={false} />
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

      <div className={styles.content}>
        <Label for="search-title" skeleton={isLoading}>
          titel
        </Label>
        <Input id="search-title" />
        <Label for="search-creator" skeleton={isLoading}>
          forfatter
        </Label>
        <Input id="search-creator" />
        <Label for="search-subject" skeleton={isLoading}>
          emne
        </Label>
        <Input id="search-subject" />
      </div>

      <Button
        dataCy="vis-resultater"
        skeleton={isLoading}
        onClick={() => onSubmit && onSubmit()}
        className={styles.submit}
      >
        {Translate({
          context: "search",
          label: "showXResults",
          vars: [data.hitcount],
        })}
      </Button>
    </div>
  );
}

export default function Wrap(props) {
  const { modal, context } = props;

  // update query params when modal closes
  useEffect(() => {
    if (!modal.isVisible && modal.hasBeenVisible) {
      setQuery({ exclude: ["modal"] });
    }
  }, [modal.isVisible]);

  // get search query from context
  const { facet } = context;

  // connect useQ hook
  const { q, setQ, setQuery } = useQ();

  console.log("q", q);

  // connected filters hook
  const { filters } = useFilters();

  // extract selected workType, if any
  const workType = filters.workType?.[0];

  // hitcount according to selected filters
  const { data, isLoading } = useData(q && hitcount({ q, filters }));

  return (
    <Search
      data={{ hitcount: data?.search?.hitcount }}
      workType={workType}
      isLoading={isLoading}
      selected={filters}
      onChange={(selected) => setQ({ ...q, ...selected })}
      onSubmit={() => setQuery({ exclude: ["modal"] })}
      onClear={() => setQ({})}
      {...props}
    />
  );
}
