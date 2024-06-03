import List from "@/components/base/forms/list";
import styles from "./quickFilter.module.css";
import { useQuickFilters } from "@/components/search/advancedSearch/useQuickFilters";
import Text from "@/components/base/text/Text";

function ListGroup({ filter }) {
  const { addQuickFilter, selectedQuickFilters } = useQuickFilters();

  const currentFilter = selectedQuickFilters.find(
    (selected) => selected.searchIndex === filter.searchIndex
  );

  return (
    <div className={styles.groupcontainer}>
      <div className={styles.groupcontent}>
        <List.Group
          label={filter.label}
          className={styles.group}
          disableGroupOutline={true}
        >
          {filter.values.map((value) => {
            const selected = currentFilter && currentFilter.value === value.cql;
            return (
              <List.Radio
                key={value.label}
                selected={selected}
                onSelect={(e) => {
                  if (e) {
                    e.preventDefault();
                  }
                  addQuickFilter(filter, value, !selected);
                }}
                label={value.label}
                className={styles.radio}
                checkBoxStyle={true}
              >
                <Text type="text3" className={styles.text}>
                  {value.label}
                </Text>
              </List.Radio>
            );
          })}
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
