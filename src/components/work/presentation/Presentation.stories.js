import Presentation from "./Presentation";

export default {
  title: "Module: Presentation",
};

/**
 * Returns all Text types
 *
 */
export function WorkPresentation() {
  return (
    <div>
      <Presentation />
    </div>
  );
}

/**
 * Returns all Text types in skeleton loading mode (note the numer of lines wanted)
 *
 */
export function Loading() {
  return (
    <div>
      <Presentation skeleton={true} />
    </div>
  );
}
