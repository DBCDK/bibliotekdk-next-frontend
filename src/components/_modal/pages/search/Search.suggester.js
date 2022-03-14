import React, { useEffect, useMemo, useState } from "react";
import { TitleSuggester } from "@/components/header/advancedsearch/AdvancedSearch";

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

/*export default function Wrap({ type = "title" }) {
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
}*/

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
