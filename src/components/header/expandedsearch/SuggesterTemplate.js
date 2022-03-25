import styles from "@/components/header/expandedsearch/ExpandedSearch.module.css";
import Suggester from "@/components/base/suggester/Suggester";
import Input from "@/components/base/forms/input/Input";
import React, { useState } from "react";
import useQ from "@/components/hooks/useQ";
import useFilters from "@/components/hooks/useFilters";
import { useData } from "@/lib/api/api";
import { all } from "@/lib/api/suggest.fragments";

/**
 * Subcomponent - show input field with suggestions. Exported for reuse in
 * mobile version @see /expandedmobile/ExpandedSearchMobile.js
 *
 * @param onChange
 * @param data
 * @param onSelect
 * @param value
 * @param onClear
 * @param title
 * @returns {JSX.Element}
 * @constructor
 */
export function SuggesterWithInput({
  type,
  data,
  onChange,
  onSelect,
  value = "",
  onClear,
  title = "",
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
          placeholder={title}
          onChange={(e) => {
            onChange && onChange(e?.target?.value, type);
          }}
          value={value}
        />
      </Suggester>
    </div>
  );
}

export default function wrap({ title = "", type = "" }) {
  const { q, setQ, clearQ, setQuery } = useQ();

  // connected filters hook
  const { filters } = useFilters();

  // extract selected workType, if any
  const workType = filters.workType?.[0];

  // use the useData hook to fetch data
  const query = q[type] ? q[type] : "";
  const { data, isLoading, error } = useData(
    all({ q: query, workType, suggesttype: type })
  );

  const filtered = data?.suggest?.result?.map((obj) => ({
    value: obj.value || obj.title || obj.name,
  }));

  const value = q[type];

  /*const onReset = () => clearQ({ exclude: ["all"] });

  const doSearch = () => {
    setQuery({
      pathname: "/find",
      query: { workType },
    });
    document.activeElement.blur();
  };*/

  const onChange = (val, type) => {
    setQ({ ...q, [type]: val });
  };

  const onSelect = (val, type) => {
    setQuery({ include: { ...q, [type]: val } });
    document.activeElement.blur();
  };

  const onClear = (type) => {
    setQuery({ include: { ...q, [type]: "" } });
  };

  return (
    <SuggesterWithInput
      type={type}
      title={title}
      data={filtered}
      onSelect={onSelect}
      onChange={onChange}
      onClear={onClear}
      value={value}
    />
  );
}
