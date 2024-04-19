import List from "@/components/base/forms/list";
import styles from "./quickFilter.module.css";
import { useQuickFilters } from "@/components/search/advancedSearch/useQuickFilters";

function ListGroup({ filter }) {
  const { addQuickFilter, selectedQuickFilters } = useQuickFilters();

  const currentFilter = selectedQuickFilters.find(
    (selected) => selected.searchIndex === filter.searchIndex
  );

  return (
    <div className={styles.filterContainer}>
      <div>{filter.label}</div>
      <List.Group className={styles.group} label={filter.label}>
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
            <b>{value.label}</b>
            {/*<p>{row.description}</p>*/}
          </List.Radio>
        ))}
      </List.Group>
    </div>
  );
}

export default function QuickFilter() {
  const { quickFilters } = useQuickFilters();
  return quickFilters.map((filter) => (
    <ListGroup filter={filter} key={filter.searchIndex} />
  ));
}
