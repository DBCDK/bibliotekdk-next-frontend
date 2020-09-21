import Tag from "./Tag";
import { useState } from "react";

export default {
  title: "Forms: Tag",
};

//  Some material types to show in a Tag
const types = ["Book", "Ebook", "Audiobook"];

/**
 * Returns all filled buttons (Default button style)
 *
 */
export function TagButton() {
  const [isSelected, setIsSelected] = useState(false);
  const [selectedType, setSelectedType] = useState(types[0]);

  return (
    <div>
      <div className="story-heading">Single Tag [checkbox style]</div>

      <Tag selected={isSelected} onClick={() => setIsSelected(!isSelected)}>
        Book
      </Tag>

      <div className="story-heading">Multiple tags [Radio style]</div>

      {types.map((type) => {
        const isSelected = selectedType === type;

        return (
          <React.Fragment key={type}>
            <Tag selected={isSelected} onClick={() => setSelectedType(type)}>
              {type}
            </Tag>
            <div className="space-2" />
          </React.Fragment>
        );
      })}
    </div>
  );
}

export function Loading() {
  return (
    <div>
      <div className="story-heading">Single Tag [checkbox style]</div>

      <Tag selected={false} skeleton={true}>
        Book
      </Tag>

      <div className="story-heading">Multiple tags [Radio style]</div>
      {types.map((type, i) => {
        return (
          <React.Fragment key={type}>
            <Tag selected={false} skeleton={true}>
              {type}
            </Tag>
            <div className="space-2" />
          </React.Fragment>
        );
      })}
    </div>
  );
}
