import Accordion, { Item } from "@/components/base/accordion";
import React from "react";
import useAdvancedSearchHistory from "@/components/hooks/useAdvancedSearchHistory";
import Icon from "@/components/base/icon";
import styles from "./AdvancedSearchHistory.module.css";
import { useRouter } from "next/router";
import { cyKey } from "@/utils/trim";
import Text from "@/components/base/text";
import translate from "@/components/base/translate";

export function AdvancedSearchHistory({ type }) {
  const { storedValue, deleteValue } = useAdvancedSearchHistory();
  const router = useRouter();

  const goToCql = (value) => {
    type === "cql"
      ? router.push({
          pathname: router.pathname,
          query: { cql: value.cql },
        })
      : router.push({
          pathname: router.pathname,
          query: { fieldSearch: JSON.stringify(value.fieldSearch) },
        });
  };

  const accordionTitle = translate({
    context: "suggester",
    label: "historyTitle",
  });

  return (
    <Accordion
      dataCy={cyKey({
        name: "search-history",
        prefix: "advanced-search",
      })}
      className={styles.accordionwrap}
    >
      <Item title={accordionTitle} key={1} additionalTxt={[""]}>
        {storedValue?.map((stored, index) => {
          return (
            <div key={index} className={styles.history}>
              <Text type="text3">
                <span>
                  {type === "cql"
                    ? stored?.cql
                    : JSON.stringify(stored.fieldSearch)}
                </span>
              </Text>
              <Text type="text3">
                <span>{stored?.hitcount} hits</span>
              </Text>

              <Icon
                className={styles.actionicon}
                src="play-circle.svg"
                size={{ w: 2, h: "auto" }}
                onClick={() => goToCql(stored)}
              />

              <Icon
                data-cy={`delete-history-${index}`}
                className={styles.actionicon}
                src="close.svg"
                size={{ w: 2, h: "auto" }}
                onClick={() => deleteValue(stored)}
              />
            </div>
          );
        })}
      </Item>
    </Accordion>
  );
}
