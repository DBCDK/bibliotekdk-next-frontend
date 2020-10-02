import Overview from "./Overview";

export default {
  title: "Work: Overview",
};

/**
 * Returns all Text types
 *
 */
export function WorkOverview() {
  return (
    <div>
      <Overview workId={"some-id"} />
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
