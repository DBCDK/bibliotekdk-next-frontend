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
      {sizes.map((size) => {
        return (
          <React.Fragment>
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
      {sizes.map((size) => {
        return (
          <React.Fragment>
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
  const src = "checkmark.svg";
  const bgColor = "var(--blue)";
  const skeleton = true;

  return (
    <div>
      {sizes.map((size) => {
        return (
          <React.Fragment>
            <Icon src={src} size={size} bgColor={bgColor} skeleton={skeleton} />
            <div className="space-5" />
          </React.Fragment>
        );
      })}
    </div>
  );
}
