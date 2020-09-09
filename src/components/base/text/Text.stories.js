import Text from "./Text";
import { useEffect, useState } from "react";

export default {
  title: "Texts",
};

// Current text types
const texts = ["text1", "text2", "text3"];

/**
 * Returns all Text types
 *
 */
export function Body() {
  return (
    <div>
      <div className="story-heading">Body Text</div>

      {texts.map((type) => (
        <React.Fragment key={type}>
          <Text tag="h1" type={type}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
            mollis purus a iaculis finibus. Integer lacus dui, condimentum quis
            elit in, feugiat hendrerit urna. Etiam facilisis id ligula congue
            ultrices.
          </Text>

          <div className="v-space-2" />
        </React.Fragment>
      ))}
    </div>
  );
}

/**
 * Returns all Text types in skeleton loading mode (note the numer of lines wanted)
 *
 */
export function Loading() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsLoaded(!isLoaded), 14500);
  }, [isLoaded]);

  return (
    <div>
      <div className="story-heading">[Loading] Text</div>

      <div className="story-heading">2 lines block</div>

      <Text type={"text1"} skeleton={true} lines={2} />

      <div className="story-heading">3 lines block</div>

      <Text type={"text2"} skeleton={true} lines={3} />

      <div className="story-heading">4 lines block</div>

      <Text type={"text3"} skeleton={true} lines={4} />
    </div>
  );
}
