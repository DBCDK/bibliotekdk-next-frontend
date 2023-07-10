import { StoryTitle, StoryDescription } from "@/storybook";

import animations from "css/animations";

const exportedObject = {
  title: "base/Animation",
};

export default exportedObject;

const outerStyle = {
  width: 100,
  height: 64,
  background: "var(--concrete)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 42,
};

export function CSS() {
  return (
    <div>
      <StoryTitle>Animations</StoryTitle>
      <StoryDescription>
        {`On hover container -> animate container.`}
      </StoryDescription>
      <div
        style={outerStyle}
        className={`${animations["on-hover"]} ${animations["h-border-bottom"]}`}
      >
        <p>hej</p>
      </div>
      <StoryDescription>
        {`On hover container -> animate inner element.`}`
      </StoryDescription>
      <div style={outerStyle} className={`${animations["on-hover"]}`}>
        <p className={animations["h-border-bottom"]}>hej</p>
      </div>
      <StoryDescription>
        {`On hover container -> translate-right inner element.`}`
      </StoryDescription>
      <div style={outerStyle} className={`${animations["on-hover"]}`}>
        <p className={animations["h-translate-right"]}>hej</p>
      </div>
      <StoryDescription>
        {`On hover container -> color blue inner element.`}
      </StoryDescription>
      <div style={outerStyle} className={`${animations["on-hover"]}`}>
        <p className={animations["h-color-blue"]}>hej</p>
      </div>
      <StoryDescription>
        {`On hover container -> outline container.`}
      </StoryDescription>
      <div
        style={outerStyle}
        className={`${animations["on-hover"]} ${animations["h-outline"]}`}
      >
        <p>hej</p>
      </div>
      <StoryDescription>
        Combinations:
        <br />
        {`On hover container -> color and underline inner element.`}
        <br />
        {`On focus container -> outline container, and translate inner element.`}
      </StoryDescription>
      <div
        style={{
          ...outerStyle,
          background: "white",
          borderBottom: "1px solid var(--gray)",
          borderTop: "1px solid var(--gray)",
          justifyContent: "left",
        }}
        tabIndex="0"
        className={[
          animations["on-focus"],
          animations["on-hover"],
          animations["f-outline"],
        ].join(" ")}
      >
        <p
          className={[
            animations["f-translate-right"],
            animations["h-color-blue"],
            animations["h-border-bottom"],
          ].join(" ")}
        >
          hej
        </p>
      </div>
    </div>
  );
}
