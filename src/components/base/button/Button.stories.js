import Button from "./Button";
import Skeleton from "../skeleton";
import { useEffect, useState } from "react";

export default {
  title: "Buttons",
};

// Current button types
const sizes = ["large", "medium", "small"];

/**
 * Returns all filled buttons (Default button style)
 *
 */
export function Filled() {
  const type = "filled";

  return (
    <div>
      <div className="story-heading">Filled buttons </div>

      {sizes.map((size) => (
        <React.Fragment key={`${type}-${size}`}>
          <Button type={type} size={size}>
            {size}
          </Button>
          <div className="space-2" />
        </React.Fragment>
      ))}

      <div className="story-heading">[Disabled] Filled buttons </div>

      {sizes.map((size) => (
        <React.Fragment key={`${type}-${size}`}>
          <Button type={type} size={size} disabled={true}>
            {size}
          </Button>
          <div className="space-2" />
        </React.Fragment>
      ))}
    </div>
  );
}

/**
 * Returns all outlined buttons
 *
 */
export function Outlined() {
  const type = "outlined";

  return (
    <div>
      <div className="story-heading">Outlined buttons </div>

      {sizes.map((size) => (
        <React.Fragment key={`${type}-${size}`}>
          <Button type={type} size={size}>
            {size}
          </Button>
          <div className="space-2" />
        </React.Fragment>
      ))}

      <div className="story-heading">[Disabled] Outlined buttons </div>

      {sizes.map((size) => (
        <React.Fragment key={`${type}-${size}`}>
          <Button type={type} size={size} disabled={true}>
            {size}
          </Button>
          <div className="space-2" />
        </React.Fragment>
      ))}
    </div>
  );
}

/**
 * Returns a skeleton loading version of the buttons
 *
 */
export function Loading() {
  const type = "filled";

  const [isSlow, setIsSlow] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsSlow(!isSlow), 4500);
  }, [isSlow]);

  return (
    <div>
      <div className="story-heading">[Loading] Outlined skeleton buttons </div>

      {sizes.map((size) => (
        <React.Fragment key={`${type}-${size}`}>
          <Button type={type} size={size} skeleton={true}>
            {size}
          </Button>
          <div className="space-2" />
        </React.Fragment>
      ))}

      <div className="story-heading">
        [Bad Loading] Outlined skeleton buttons
      </div>

      {sizes.map((size) => (
        <React.Fragment key={`${type}-${size}`}>
          <Skeleton isSlow={isSlow}>
            <Button type={type} size={size}>
              {size}
            </Button>
          </Skeleton>
          <div className="space-2" />
        </React.Fragment>
      ))}
    </div>
  );
}
