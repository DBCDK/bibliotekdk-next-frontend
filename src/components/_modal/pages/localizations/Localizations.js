import Top from "@/components/_modal/pages/base/top";
import styles from "./Localizations.module.css";
import { useData } from "@/lib/api/api";
import * as workFragments from "@/lib/api/work.fragments";
import Skeleton from "@/components/base/skeleton";
import { useState } from "react";
import * as libraryFragments from "@/lib/api/library.fragments";
import { signIn } from "next-auth/client";
import { LoginPickup } from "@/components/_modal/pages/login/Login";
import Translate from "@/components/base/translate";
import debounce from "lodash/debounce";
import Search from "@/components/base/forms/search";
import List from "@/components/base/forms/list/List";
import LocalizationItem from "./LocalizationItem";

export function Localizations({ context, branchData, isLoading, onChange }) {
  /*
  return (
    <LoginPickup
      {...context}
      isLoading={isLoading}
      data={isLoading ? {} : branchData}
      onChange={onChange}
      includeArrows="false"
      onLogin={{}}
    />
  );*/

  console.log(context, "CONTEXT");
  console.log(onChange, "ONCHANGE");
  const allBranches = branchData?.result;

  console.log(branchData, "BRANCHDATA");

  return (
    <div data-cy="localizations-modal" className={styles.wrapper}>
      <Top />
      <Search
        dataCy="pickup-search-input"
        placeholder={Translate({
          ...context,
          label: "pickup-input-placeholder",
        })}
        className={styles.input}
        onChange={debounce((value) => onChange(value), 100)}
        //onChange={(e) => {
        //  onChange ? debounce((value) => onChange(value), 100) : alert("fisk");
        //}}
      />
      <div>
        {allBranches?.length > 0 && (
          <div>
            {allBranches.map((branch, idx) => {
              return (
                <LocalizationItem
                  //callbackUrl={callbackurl}
                  //key={`${branch.branchId}-${idx}`}
                  branch={branch}
                  //onSelect={onSelect}
                  //isLoading={isLoading}
                  //includeArrows={includeArrows}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function wrap({ context }) {
  const { workId, agency } = { ...context };

  const [query, setQuery] = useState("");
  // we know there is one or more localizations
  // use the useData hook to fetch data
  const {
    data: localizations,
    isLoading: lcalizationsIsLoading,
    isSlow,
  } = useData(workFragments.localizations({ workId }));

  const { data, isLoading } = useData(
    libraryFragments.search({ q: query || "" })
  );

  const dummyData = {
    hitcount: 10,
    result: [
      { name: "This is some branch name" },
      { name: "This is some other branch name" },
      { name: "This is also a branch name" },
      { name: "A branch name" },
      { name: "Also a bracndh name" },
      { name: "This is some branch name" },
      { name: "This is some other branch name" },
      { name: "This is also a branch name" },
      { name: "A branch name" },
      { name: "Also a bracndh name" },
    ],
  };

  const branches = !query ? agency : data?.branches;

  const props = { ...context, ...data };
  return (
    <Localizations
      context={props}
      branchData={isLoading ? dummyData : branches}
      isLoading={isLoading}
      onChange={(q) => setQuery(q)}
    />
  );
}
