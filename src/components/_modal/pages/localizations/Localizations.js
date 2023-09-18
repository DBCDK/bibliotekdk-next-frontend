import Top from "@/components/_modal/pages/base/top";
import styles from "./Localizations.module.css";
import { useData } from "@/lib/api/api";
import { useEffect, useState } from "react";
import * as libraryFragments from "@/lib/api/library.fragments";
import Translate from "@/components/base/translate";
import debounce from "lodash/debounce";
import Search from "@/components/base/forms/search";
import LocalizationItem from "./localizationitem/LocalizationItem";

import Text from "@/components/base/text/Text";
import Title from "@/components/base/title";
import { dummyData_localizations } from "@/components/_modal/pages/localizations/dummyData.localizations.fixture";

export function Localizations({
  context,
  branchData,
  isLoading,
  onChange,
  testing = false,
}) {
  const allBranches = branchData?.result;
  return (
    <div data-cy="localizations-modal" className={styles.wrapper}>
      <Top />

      <div>
        <Title type="title4" className={styles.title} tag="h2">
          {Translate({
            context: "holdings",
            label: "label_localizations_title",
          })}
        </Title>

        <Text type="text3" className={styles.description}>
          {Translate({
            context: "holdings",
            label: "label_localization_description",
          })}
        </Text>
      </div>

      <Search
        dataCy="pickup-search-input"
        placeholder={Translate({
          context: "order",
          label: "pickup-input-placeholder",
        })}
        onChange={debounce((value) => onChange(value), 100)}
        id="localizations_search"
      />

      {!isLoading && (
        <div>
          {allBranches?.length > 0 && (
            <div>
              {allBranches.map((branch, idx) => {
                return (
                  <LocalizationItem
                    key={branch.branchId}
                    props={{
                      ...context,
                      index: { idx },
                      testing: testing,
                      branchId: branch.branchId,
                      branch: branch,
                    }}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Wrap({ context, modal }) {
  const { agency, pids } = { ...context };

  const [query, setQuery] = useState("");

  useEffect(() => {
    if (modal.isVisible) {
      setTimeout(() => {
        document.getElementById("localizations_search").focus();
      }, 300);
    }
  }, [modal.isVisible]);

  const { data, isLoading } = useData(
    libraryFragments.search({ q: query || "" })
  );

  const branches = !query ? agency : data?.branches;

  const props = { ...context, ...data, pids };
  return (
    <Localizations
      context={props}
      branchData={isLoading ? dummyData_localizations : branches}
      isLoading={isLoading}
      onChange={(q) => setQuery(q)}
    />
  );
}
