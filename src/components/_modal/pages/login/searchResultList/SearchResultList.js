import List from "@/components/base/forms/list";
import Select from "../Select";

export default function SearchResultList(props) {
  const { allBranches, isLoading, onSelect, isVisible, includeArrows } = props;
  if (!allBranches) return;
  return (
    <List.Group
      enabled={!isLoading && isVisible}
      data-cy="list-branches"
      disableGroupOutline
    >
      {allBranches.map((branch, idx) => {
        return (
          <Select
            key={`${branch.branchId}-${idx}`}
            branch={branch}
            onSelect={onSelect}
            isLoading={isLoading}
            includeArrows={includeArrows}
          />
        );
      })}
    </List.Group>
  );
}
