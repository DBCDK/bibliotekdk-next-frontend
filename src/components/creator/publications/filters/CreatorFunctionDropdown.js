import { useData } from "@/lib/api/api";
import { creatorFunctionFacets } from "@/lib/api/creator.fragments";
import { SimpleDropDown } from "@/components/search/advancedSearch/advancedSearchSort/AdvancedSearchSort";
import Translate from "@/components/base/translate";

/**
 * Dropdown for creator functions - handles data fetching and rendering
 */
export default function CreatorFunction({
  creatorId,
  selected,
  onSelect,
  filters,
}) {
  // Exclude own filter from the filters object
  const filtersWithoutCreatorFunction = { ...filters, creatorFunction: null };

  const { data, isLoading, error } = useData(
    creatorId &&
      creatorFunctionFacets({
        creatorId,
        filters: filtersWithoutCreatorFunction,
      })
  );

  const facets = data?.complexSearch?.facets || [];

  // Find the facet.creatorfunction facet
  const creatorFunctionFacet = facets.find(
    (facet) => facet.name === "facet.creatorcontributorfunction"
  );

  // Create mapping from parsed function to original facet value
  const functionToOriginalMap = {};
  const parsedFunctions = [];

  // Only process if we have values
  if (creatorFunctionFacet?.values?.length) {
    creatorFunctionFacet.values
      .map((value) => value.key)
      ?.filter?.((value) => {
        // Match values that start with creatorId followed by " (function)" format
        // e.g. "Jakob Martin Strid (forfatter)" or "Frantz Frantzen (f. 1990) (producent)"
        // Escapes special regex characters in creatorId to handle cases like parentheses in names
        const regex = new RegExp(
          `^${creatorId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} \\([^)]+\\)$`,
          "i"
        );
        return regex.test(value);
      })
      ?.forEach((originalValue) => {
        // Find the function part in parentheses
        const match = originalValue.match(/.*\(([^)]+)\)$/);
        const parsedFunction = match ? match[1] : originalValue;

        functionToOriginalMap[parsedFunction] = originalValue;
        if (!parsedFunctions.includes(parsedFunction)) {
          parsedFunctions.push(parsedFunction);
        }
      });
  }

  const options = parsedFunctions.sort();

  // Parse selected value to show only function
  const parseSelectedValue = (value) => {
    if (!value) return "";
    const match = value.match(/.*\(([^)]+)\)$/);
    return match ? match[1] : value;
  };

  return (
    <SimpleDropDown
      placeholder={Translate({
        context: "facets",
        label: "label-creatorfunction",
      })}
      selected={parseSelectedValue(selected)}
      onSelect={(entry) => {
        // Map the parsed function back to original value
        const originalValue = entry ? functionToOriginalMap[entry] || "" : "";
        onSelect(originalValue);
      }}
      options={options}
      clearRow="Alle"
    />
  );
}
