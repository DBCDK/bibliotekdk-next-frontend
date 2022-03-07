import React, { useEffect, useMemo, useState } from "react";

import Input from "@/components/base/forms/input";
import Suggester from "@/components/base/suggester";

import useFilters from "@/components/hooks/useFilters";
import useQ from "@/components/hooks/useQ";

import { useData } from "@/lib/api/api";
import { all, work, subject, creator } from "@/lib/api/suggest.fragments";

const dummy = [
  { value: "hest" },
  { value: "kat" },
  { value: "hund" },
  { value: "ko" },
  { value: "fisk" },
];

export function TitleSuggester({ q, onChange, data }) {
  return (
    <Suggester id="advanced-search-title" data={data}>
      <Input
        id="search-title"
        dataCy="search-input-title"
        value={q.title}
        placeholder={"hej"}
        onChange={(e) => {
          const val = e?.target?.value;
          onChange(val);
          // onChange prop
          // props?.onChange?.(e);
        }}
      />
    </Suggester>
  );
}

export default function Wrap({ type = "title" }) {
  const { q: _q, base } = useQ();
  const { filters } = useFilters();
  const [state, setState] = useState({ ...base, ..._q });

  // extract selected workType, if any
  const workType = filters.workType?.[0] || null;

  const q = state[type];

  // use the useData hook to fetch data
  const { data, isLoading, error } = useData(all({ q, workType }));

  const filtered = data?.suggest?.result?.map((obj) => ({
    value: obj.value || obj.title || obj.name,
  }));

  if (error) {
    return null;
  }

  return (
    <TitleSuggester
      data={filtered || dummy}
      q={state}
      skeleton={isLoading}
      onChange={(val) => {
        setState({ ...state, [type]: val });
      }}
    />
  );
}

// export function Provider({ type = "title", loader, children }) {
//   const { q: _q, base } = useQ();
//   const { filters } = useFilters();
//   const [state, setState] = useState({ ...base, ..._q });

//   // extract selected workType, if any
//   const workType = filters.workType?.[0] || null;

//   const q = state[type];

//   console.log("loader", loader(state[type]));

//   // use the useData hook to fetch data
//   const { data, isLoading, error } = useData(loader(state[type]));

//   const filtered = data?.suggest?.result?.map((obj) => ({
//     value: obj.value || obj.title || obj.name,
//   }));

//   if (error) {
//     return null;
//   }

//   const newProps = {
//     data: filtered || dummy,
//     q: state,
//     skeleton: isLoading,
//     onChange: (e) => {
//       const val = e?.target?.value;
//       setState({ ...state, [type]: val });
//     },
//   };

//   return React.cloneElement(children, newProps);

//   // return (
//   //   <TitleSuggester
//   //     data={filtered || dummy}
//   //     q={state}
//   //     skeleton={isLoading}
//   //     onChange={(val) => {
//   //       setState({ ...state, [type]: val });
//   //     }}
//   //   />
//   // );
// }
