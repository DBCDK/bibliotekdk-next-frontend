import MaterialRow from "./MaterialRow";
import { StoryTitle } from "@/storybook";

const exportedObject = {
  title: "profile/MaterialRow",
};

export function MaterialRowStory() {
  return (
    <div>
      <StoryTitle>Material Row - Debt</StoryTitle>
      <MaterialRow title="The Way of Kings" library="Herlev bibliotek" />

      <StoryTitle>Material Row - Loan</StoryTitle>
      <MaterialRow
        image="https://default-forsider.dbc.dk/covers-12/large/470a9922-d455-590a-ae6b-333013ca86fa.jpg"
        title="The Way of Kings"
        creator="Brandon Sanderson"
        materialType="Bog"
        creationYear="2011"
        library="Herlev bibliotek"
        id="0122"
        type="LOAN"
      />

      <StoryTitle>Material Row - Order</StoryTitle>
      <MaterialRow
        image="https://default-forsider.dbc.dk/covers-12/large/470a9922-d455-590a-ae6b-333013ca86fa.jpg"
        title="The Way of Kings"
        creator="Brandon Sanderson"
        materialType="Bog"
        creationYear="2011"
        library="Herlev bibliotek"
        id="0122"
        type="ORDER"
      />
    </div>
  );
}

export default exportedObject;
