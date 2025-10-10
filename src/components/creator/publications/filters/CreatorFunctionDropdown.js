import { useData } from "@/lib/api/api";
import { creatorFunctionFacets } from "@/lib/api/creator.fragments";
import { SimpleDropDown } from "@/components/search/advancedSearch/advancedSearchSort/AdvancedSearchSort";
import Translate from "@/components/base/translate";

function parseValue(value, creatorId) {
  return value
    ?.toLowerCase()
    ?.replace(creatorId?.toLowerCase(), "")
    ?.replace(/\(|\)/g, "")
    ?.trim();
}
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

  const { data } = useData(
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
      // Match values that start with creatorId followed by " (function)" format
      // e.g. "Jakob Martin Strid (forfatter)" or "Frantz Frantzen (f. 1990) (producent)"
      // Escapes special regex characters in creatorId to handle cases like parentheses in names
      ?.filter?.((value) =>
        value?.toLowerCase()?.startsWith(creatorId?.toLowerCase())
      )
      .forEach((originalValue) => {
        const func = parseValue(originalValue, creatorId);
        parsedFunctions.push(func);
        functionToOriginalMap[func] = originalValue;
      });
  }

  const options = parsedFunctions.sort((a, b) => a.localeCompare(b));

  return (
    <SimpleDropDown
      placeholder={Translate({
        context: "facets",
        label: "label-creatorfunction",
      })}
      selected={parseValue(selected, creatorId)}
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
