import { StoryTitle } from "@/storybook";

import LibrariesTable from "./LibrariesTable";
const mockData = [
  {
    agencyName: "Silkeborg Biblioteker",
    agencyId: "774000",
  },
  {
    agencyId: "710100",
    agencyName: "Københavns Biblioteker",
  },
  {
    agencyName: "Syddansk Universitetsbibliotek",
    agencyId: "820030",
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
