import useFilters from "@/components/hooks/useFilters";
import useQ from "@/components/hooks/useQ";
import { useModal } from "@/components/_modal";
import { FilterTypeEnum } from "@/lib/enums";

import Translate from "@/components/base/translate";
import Button from "@/components/base/button";
import Icon from "@/components/base/icon/Icon";

import styles from "./FilterButton.module.css";

export function FilterButton({ className, onClick, count, isLoading }) {
  const filtersLabel = Translate({
    context: "search",
    label: count === "0" ? "showAllFilters" : "showAllFiltersCount",
    vars: count === "0" ? null : [count],
  });

  return (
    <Button
      id="view-all-filters"
      className={`${styles.filterButton} ${className}`}
      type="secondary"
      size="medium"
      dataCy="view-all-filters"
      onClick={onClick}
      skeleton={isLoading}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.keyCode === 13) {
          onClick();
        }
      }}
    >
      <Icon src="settings.svg" size={2} />
      {filtersLabel}
    </Button>
  );
}

export default function Wrap(props) {
  const { getCount } = useFilters();
  const count = getCount([FilterTypeEnum.WORK_TYPES]).toString();

  const q = useQ().getQuery();

  const modal = useModal();

  return (
    <FilterButton
      count={count}
      onClick={() => modal.push("filter", { q })}
      {...props}
    />
  );
}
