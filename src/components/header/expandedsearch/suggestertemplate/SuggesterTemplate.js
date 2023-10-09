import styles from "./SuggesterTemplate.module.css";
import Suggester from "@/components/base/suggester/Suggester";
import Input from "@/components/base/forms/input/Input";
import React, { useMemo } from "react";
import useQ from "@/components/hooks/useQ";
import useFilters from "@/components/hooks/useFilters";
import { useData } from "@/lib/api/api";
import * as suggestFragments from "@/lib/api/suggest.fragments";
import Translate from "@/components/base/translate";
import { SuggestTypeEnum } from "@/lib/enums";

/**
 * Subcomponent - show input field with suggestions. Exported for reuse in
 * mobile version @see /expandedmobile/ExpandedSearchMobile.js
 *
 * @param type
 * @param onChange
 * @param data
 * @param {function} onSelect
 * @param {string} value
 * @param {function} onClear
 * @param {string} title
 * @param {string} placeholder
 * @returns {React.ReactElement | null}
 */
export function SuggesterWithInput({
  type,
  data,
  onChange,
  onSelect,
  value = "",
  onClear,
  // eslint-disable-next-line no-unused-vars
  title = "",
  placeholder = "",
}) {
  return (
    <div className={styles.suggestionswrap}>
      <Suggester
        id={`advanced-search-${type}`}
        data={data}
        onSelect={(val) => {
          onSelect && onSelect(val, type);
        }}
        onClear={() => onClear && onClear(type)}
        initialValue={value}
      >
        <Input
          className={styles.expandedinput}
          id={`search-${type}`}
          dataCy={`search-input-${type}`}
          placeholder={placeholder}
          onChange={(e) => {
            onChange && onChange(e?.target?.value, type);
          }}
          value={value}
        />
      </Suggester>
    </div>
  );
}

/**
 *
 * @param title
 * @param {string} type
 * @returns {React.ReactElement | null}
 */
export default function Wrap({ title = "", type = "" }) {
  const { q, setQ, setQuery } = useQ();

  // connected filters hook
  const { filters, types } = useFilters();

  const exclude = types.filter((t) => t !== "workTypes");

  // extract selected workType, if any
  const workType = filters.workTypes?.[0];

  // use the useData hook to fetch data
  const query = q[type] ? q[type] : "";

  const { data: allData } = useData(
    suggestFragments.all({
      q: query,
      workType,
      limit: 10,
    })
  );

  const { data: typedSuggestData } = useData(
    suggestFragments.typedSuggest({
      q: query,
      workType,
      suggestType: type,
      limit: 10,
    })
  );

  const data = type === SuggestTypeEnum.ALL ? allData : typedSuggestData;

  const filtered = useMemo(
    () =>
      data?.suggest?.result
        ?.filter((obj) => obj.type.toLowerCase() === type)
        ?.map((obj) => ({
          value: obj.term,
        })),
    [data?.suggest?.result]
  );

  const value = q[type];

  const onChange = (val, type) => {
    setQ({ ...q, [type]: val });
  };

  const onSelect = (val, type) => {
    setQuery({
      pathname: "/find",
      include: { ...q, [type]: val },
      exclude: ["page", ...exclude],
    });
    document.activeElement.blur();
  };

  const onClear = (type) => {
    setQ({ ...q, [type]: "" });
  };

  const label = workType
    ? `placeholder-${workType}-${type}`
    : `placeholder-${type}`;

  const placeholder = Translate({
    context: "search",
    label: label,
  });

  return (
    <SuggesterWithInput
      type={type}
      title={title}
      data={filtered}
      onSelect={onSelect}
      onChange={onChange}
      onClear={onClear}
      value={value}
      placeholder={placeholder}
    />
  );
}
