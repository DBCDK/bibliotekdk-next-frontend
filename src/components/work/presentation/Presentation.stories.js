export default {
  title: "Module",
};

// Current text types
const texts = ["text1", "text2", "text3"];

/**
 * Returns all Text types
 *
 */
export function Presentation() {
  return <div>Work presentation</div>;
}

/**
 * Returns all Text types in skeleton loading mode (note the numer of lines wanted)
 *
 */
export function Loading() {
  return <div>Loading . . .</div>;
}
