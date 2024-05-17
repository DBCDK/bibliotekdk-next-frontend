import { StoryTitle, StoryDescription } from "@/storybook";

import ListWithAnimation from "./ListWithAnimation";
import { useState } from "react";

const exportedObject = {
  title: "base/ListWithAnimation",
};

export default exportedObject;

/**
 * Return what-ever as a Link
 *
 */
export function ListWithAnimationStory() {
  const [items, setItems] = useState([
    { id: 1, text: "Item 1" },
    { id: 2, text: "Item 2" },
  ]);

  const addItem = () => {
    setItems((prevItems) => [
      ...prevItems,
      { id: Date.now(), text: "New Item" },
    ]);
  };

  const removeItem = (id) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };
  return (
    <div>
      <StoryTitle>ListWithAnimation</StoryTitle>
      <StoryDescription>
        ListWithAnimation adds animation to when elements are removed or added
        to a list.
      </StoryDescription>
      <button onClick={addItem}>Add Item</button>
      <button onClick={() => removeItem(items[0].id)}>Remove First Item</button>
      <ListWithAnimation>
          {items.map((item) => (
            <li key={item.id}>
              <div>
                {item.text}
                <button onClick={() => removeItem(item.id)}>Remove</button>
              </div>
            </li>
          ))}
        </ListWithAnimation>
    </div>
  );
}
