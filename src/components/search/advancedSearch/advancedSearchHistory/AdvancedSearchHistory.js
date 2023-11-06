import Accordion, { Item } from "@/components/base/accordion";
import React from "react";
import useAdvancedSearchHistory from "@/components/hooks/useAdvancedSearchHistory";
import Icon from "@/components/base/icon";
import styles from "./AdvancedSearchHistory.module.css";
import { useRouter } from "next/router";
import { cyKey } from "@/utils/trim";
import Text from "@/components/base/text";

export function AdvancedSearchHistory() {
  const [storedValue, deleteValue] = useAdvancedSearchHistory();
  const router = useRouter();

  const goToCql = (value) => {
    router.push(`/avanceret?cql=${value.cql}`);
  };

  return (
    <Accordion
      dataCy={cyKey({
        name: "search-history",
        prefix: "advanced-search",
      })}
    >
      <Item title="Søgehistorik" key={1} id="søgehistorik-1">
        {storedValue?.map((stored, index) => {
          return (
            <div key={index} className={styles.history}>
              <Text type="text3">
                <span>{stored?.cql}</span>
              </Text>
              <Text type="text3">
                <span>{stored?.hitcount} hits</span>
              </Text>

              <span>
                <Icon
                  className={styles.actionicon}
                  src="play-circle.svg"
                  size={{ w: 2, h: "auto" }}
                  onClick={() => goToCql(stored)}
                />
              </span>
              <span>
                <Icon
                  data-cy={`delete-history-${index}`}
                  className={styles.actionicon}
                  src="close.svg"
                  size={{ w: 2, h: "auto" }}
                  onClick={() => deleteValue(stored)}
                />
              </span>
            </div>
          );
        })}
      </Item>
    </Accordion>
  );
}
