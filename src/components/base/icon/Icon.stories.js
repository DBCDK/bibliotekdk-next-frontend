import Icon from "./Icon";

export default {
  title: "Icon",
};

// Current button types
const sizes = [2, 3, 4, 5, 6];

/**
 * Return Icon with no background fill
 *
 */
export function BasicIcon() {
  const src = "ornament1.svg";

  return (
    <div>
      <div className="story-heading">
        Icons sized according to width [auto height]
      </div>
      {sizes.map((size) => {
        return (
          <React.Fragment key={size}>
            <Icon src={src} size={size} />
            <div className="space-5" />
          </React.Fragment>
        );
      })}
    </div>
  );
}

/**
 * Returns Round Icon with background fill
 *
 */
export function RoundIcon() {
  const src = "checkmark.svg";
  const bgColor = "var(--blue)";

  return (
    <div>
      <div className="story-heading">
        Icons sized according to width and height
      </div>
      {sizes.map((size) => {
        return (
          <React.Fragment key={size}>
            <Icon src={src} size={size} bgColor={bgColor} />
            <div className="space-5" />
          </React.Fragment>
        );
      })}
    </div>
  );
}

/**
 * Return Loading version of round Icon
 *
 */
export function Loading() {
  const src1 = "ornament1.svg";
  const src2 = "checkmark.svg";
  const bgColor = "var(--blue)";
  const skeleton = true;

  return (
    <div>
      <div className="story-heading">Loading basic icons</div>
      {sizes.map((size) => {
        return (
          <React.Fragment key={size}>
            <Icon src={src1} size={size} skeleton={skeleton} />
            <div className="space-5" />
          </React.Fragment>
        );
      })}

      <div className="story-heading">Loading round icons</div>
      {sizes.map((size) => {
        return (
          <React.Fragment key={size}>
            <Icon
              src={src2}
              size={size}
              bgColor={bgColor}
              skeleton={skeleton}
            />
            <div className="space-5" />
          </React.Fragment>
        );
      })}
    </div>
  );
}
