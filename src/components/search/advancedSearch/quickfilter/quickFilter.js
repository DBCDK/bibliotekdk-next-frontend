import List from "@/components/base/forms/list";
import styles from "./quickFilter.module.css";
import { useQuickFilters } from "@/components/search/advancedSearch/useQuickFilters";
import Translate from "@/components/base/translate";
import Text from "@/components/base/text/Text";
import { useEffect } from "react";

function ListGroup({ filter }) {
  const { addQuickFilter, selectedQuickFilters } = useQuickFilters();

  const currentFilter = selectedQuickFilters.find(
    (selected) => selected.searchIndex === filter.searchIndex
  );

  return (
    <div className={styles.groupcontainer}>
      <div className={styles.groupcontent}>
        <Text type="text2" className={styles.boldtext}>
          {Translate({ context: "quickfilters", label: filter.label })}
        </Text>
        <List.Group label={filter.label} className={styles.group}>
          {filter.values.map((value) => (
            <List.Radio
              key={value.label}
              selected={
                (currentFilter && currentFilter.value === value.cql) ||
                (!currentFilter && !value.cql)
              }
              onSelect={() => {
                addQuickFilter(filter, value);
              }}
              label={value.label}
              className={styles.radio}
            >
              <Text type="text3" className={styles.text}>
                {value.label}
              </Text>
              {/*<p>{row.description}</p>*/}
            </List.Radio>
          ))}
        </List.Group>
      </div>
    </div>
  );
}

export default function QuickFilter() {
  const { quickFilters } = useQuickFilters();

  return (
    <div className={styles.filterContainer}>
      {quickFilters.map((filter) => (
        <ListGroup filter={filter} key={filter.searchIndex} />
      ))}
    </div>
  );
}
