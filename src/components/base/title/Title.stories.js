import Title from "./Title";

export default {
  title: "Titles",
};

// Current title types
const titles = ["title1", "title2", "title3", "title4"];

/**
 * Returns all Titles as h1 tags
 *
 */
export function Titles() {
  return (
    <div>
      <div className="story-heading">Titles</div>

      {titles.map((type) => (
        <React.Fragment key={type}>
          <div className="story-heading">{`Title (${type})`}</div>
          <Title tag="h1" key={type} type={type}>
            Hello World
          </Title>
        </React.Fragment>
      ))}
    </div>
  );
}

/**
 * Returns all Titles as h1 in skeleton loading mode
 *
 */
export function Loading() {
  return (
    <div>
      <div className="story-heading">[Loading] Titles</div>

      {titles.map((type) => (
        <React.Fragment key={type}>
          <div className="story-heading">{`[Loading] Title (${type})`}</div>

          <Title tag="h1" type={type} skeleton={true}>
            Hello World
          </Title>
        </React.Fragment>
      ))}
    </div>
  );
}
