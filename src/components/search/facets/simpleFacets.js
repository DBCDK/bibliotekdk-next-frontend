import { AdvancedFacets } from "@/components/search/advancedSearch/facets/advancedFacets";

export function SimpleFacets({
  facets = [],
  isLoading = false,
  selectedFacets = [],
  onItemClick = () => {
    alert("fisk");
  },
}) {
  console.log(facets, "STORY FACETS");
  return (
    <>
      <div>FISK</div>
      <AdvancedFacets
        facets={facets}
        isLoading={isLoading}
        selectedFacets={selectedFacets}
        onItemClick={onItemClick}
        origin="simpleSearch"
      />
    </>
  );
}

export default function Wrap() {
  return <SimpleFacets />;
}
