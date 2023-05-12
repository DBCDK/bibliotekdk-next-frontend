import { StoryTitle } from "@/storybook";

import LibrariesTable from "./LibrariesTable";
const mockData = [
  {
    agency: "Biblioteket kilden",
    libraryName: "Herlev bibliotek",
    type: "Folkebibliotek",
  },
  {
    agency: null,
    libraryName: "Ballerup bibliotek",
    type: "Folkebibliotek",
  },
  {
    agency: "Biblioteket Danasvej",
    libraryName: "Biblioteket Frederiksberg",
    type: "Folkebibliotek",
  },
  {
    agency: "Københavns Universitetsbibliotek, Søndre Campus",
    libraryName: "Det Kgl. Bibliotek",
    type: "Uddannelsesbibliotek",
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
      <LibrariesTable mockData={mockData} />
    </div>
  );
}
