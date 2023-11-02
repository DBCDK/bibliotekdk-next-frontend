/**
 * @name SearchResultList.js
 * Shows a list of branches from the search result
 */

import List from "@/components/base/forms/list";
import PropTypes from "prop-types";
import Select from "../Select";

/**
 * Shows a list of branches from the search result
 * @param {*} props
 * @returns {JSX.Element}
 */
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

SearchResultList.propTypes = {
  allBranches: PropTypes.array,
  isLoading: PropTypes.bool,
  onSelect: PropTypes.func,
  isVisible: PropTypes.bool,
  includeArrows: PropTypes.bool,
};
