import Title from "./Title";

export default {
  title: "Titles",
};

const titles = ["title1", "title2", "title3", "title4"];

export const Titles = () => {
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
};

export const Loading = () => {
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
};
