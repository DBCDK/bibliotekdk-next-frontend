import Overview from "./Overview";

export default {
  title: "Module: Overview",
};

/**
 * Returns all Text types
 *
 */
export function WorkOverview() {
  return (
    <div>
      <Overview />
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
      <Overview skeleton={true} />
    </div>
  );
}
