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
        <Title tag="h1" key={type} type={type}>
          Hello World
        </Title>
      ))}

      <div className="story-heading">[Loading] Titles</div>

      {titles.map((type) => (
        <div key={type}>
          <Title tag="h1" type={type} skeleton={true}>
            Hello World
          </Title>

          <div className="v-space-1" />
        </div>
      ))}
    </div>
  );
};
