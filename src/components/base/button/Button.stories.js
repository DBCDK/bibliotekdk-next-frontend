import Button from "./Button";
import Skeleton from "../skeleton";
import { useEffect, useState } from "react";

export default {
  title: "Buttons",
};

// Current button types
const sizes = ["large", "medium", "small"];

/**
 * Returns all primary buttons (Default button style)
 *
 */
export function Primary() {
  const type = "primary";

  return (
    <div>
      <div className="story-heading">Primary buttons </div>
      <div className="story-description">
        Primary buttons takes up 100% of width [block]
      </div>
      {sizes.map((size) => (
        <React.Fragment key={`${type}-${size}`}>
          <Button type={type} size={size}>
            {size}
          </Button>
          <div className="space-2" />
        </React.Fragment>
      ))}

      <div className="story-heading">[Disabled] Primary buttons </div>

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
 * Returns all Secondary buttons
 *
 */
export function Secondary() {
  const type = "secondary";

  return (
    <div>
      <div className="story-heading">Secondary buttons </div>
      <div className="story-description">
        Secondary buttons adapts to content [inline]
      </div>
      {sizes.map((size) => (
        <React.Fragment key={`${type}-${size}`}>
          <Button type={type} size={size}>
            {size}
          </Button>
          <div className="space-2" />
        </React.Fragment>
      ))}

      <div className="story-heading">[Disabled] Secondary buttons </div>

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
  const type = "primary";

  const [isSlow, setIsSlow] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsSlow(!isSlow), 4500);
  }, [isSlow]);

  return (
    <div>
      <div className="story-heading">[Loading] Secondary skeleton buttons </div>

      {sizes.map((size) => (
        <React.Fragment key={`${type}-${size}`}>
          <Button type={type} size={size} skeleton={true}>
            {size}
          </Button>
          <div className="space-2" />
        </React.Fragment>
      ))}

      <div className="story-heading">
        [Bad Loading] Secondary skeleton buttons
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
