/**
 * @file - Select.js
 * Branch name with highlights that triggers onSelect when clicked
 */

import animations from "css/animations";
import find from "lodash/find";
import List from "@/components/base/forms/list";
import Text from "@/components/base/text";

/**
 * Shows a single branch with name and highlights the parts of the name match the search term
 * used in a list of branches in the search result list
 * @param {Object} branch
 * @param {function} onSelect
 * @param {boolean} isLoading
 * @param {boolean} disabled
 * @param {boolean} includeArrows
 * @param {*} _ref
 * @returns
 */
export default function Select({
  branch,
  onSelect,
  isLoading,
  disabled,
  includeArrows,
  _ref,
}) {
  // Check for a highlight key matching on "name" prop
  const matchName = find(branch.highlights, {
    key: "name",
  });
  // If found, use matchned name (wraps match in <mark>...</mark>)
  const title = matchName?.value || branch.name;

  // If none found use a alternative match if any found
  const matchOthers = !matchName ? branch?.highlights?.[0]?.value : null;
  disabled = false;

  return (
    <List.FormLink
      onSelect={() => onSelect(branch)}
      label={branch.name}
      disabled={disabled}
      className={[animations["on-hover"]].join(" ")}
      includeArrows={includeArrows}
      _ref={_ref}
    >
      <>
        <Text
          lines={1}
          skeleton={isLoading}
          type="text2"
          dataCy={`text-${branch.name}`}
          className={[
            animations["h-border-bottom"],
            animations["h-color-blue"],
          ].join(" ")}
        >
          <span
            dangerouslySetInnerHTML={{
              __html: title,
            }}
          />
        </Text>
        {matchOthers && (
          <Text type="text3">
            <span
              dangerouslySetInnerHTML={{
                __html: matchOthers,
              }}
            />
          </Text>
        )}
      </>
    </List.FormLink>
  );
}
