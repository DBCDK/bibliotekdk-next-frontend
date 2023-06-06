import { StoryTitle } from "@/storybook";

import LibrariesTable from "./LibrariesTable";
const mockData = [
  {
    agencyName: "Biblioteket kilden",
    name: "Herlev bibliotek",
    type: "Folkebibliotek",
    agencyId: "71000",
  },
  {
    agencyName: null,
    name: "Ballerup bibliotek",
    type: "Folkebibliotek",
    agencyId: "72000",
  },
  {
    agencyName: "Biblioteket Danasvej",
    name: "Biblioteket Frederiksberg",
    type: "Folkebibliotek",
    agencyId: "73000",
  },
  {
    agencyName: "Københavns Universitetsbibliotek, Søndre Campus",
    name: "Det Kgl. Bibliotek",
    type: "Uddannelsesbibliotek",
    agencyId: "74000",
  },
];
const exportedObject = {
  title: "profile/LibrariesTable",
};
export default exportedObject;
/**
 * Returns a list table libraries
 *
 */
export function LibrariesTableStory() {
  return (
    <div>
      <StoryTitle>LibrariesTable</StoryTitle>
      <LibrariesTable data={mockData} />
    </div>
  );
}
