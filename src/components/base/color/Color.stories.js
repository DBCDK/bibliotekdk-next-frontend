import { StoryTitle, StoryDescription, StorySpace } from "@/storybook";

import Color from "./Color";

export default {
  title: "Colors",
};

/**
 * Returns all Primary colors
 *
 */
export const Primary = () => {
  const colors = [
    { name: "blue", hex: "#3333ff" },
    { name: "mine-shaft", hex: "#212121" },
  ];

  return (
    <div>
      <StoryTitle>Primary Colors</StoryTitle>
      <StoryDescription>
        Copy #hex by clicking on the hexcode. Copy variable by clicking on the
        color name
      </StoryDescription>

      {colors.map((color) => (
        <React.Fragment key={color.name}>
          <Color hex={color.hex} name={color.name} />
          <StorySpace space="5" />
        </React.Fragment>
      ))}
    </div>
  );
};

/**
 * Returns all Secondary colors
 *
 */
export const Secondary = () => {
  const colors = [
    { name: "concrete", hex: "#f2f2f2" },
    { name: "pippin", hex: "#ffe7e0" },
    { name: "chardon", hex: "#fff3f0" },
    { name: "bone", hex: "#e5c7bd" },
    { name: "parchment", hex: "#f4efdd" },
    { name: "merino", hex: "#f9f7ee" },
    { name: "chamois", hex: "#eed9b0" },
    { name: "jagged-ice", hex: "#d0ebee" },
    { name: "black-squeeze", hex: "#e7f5f6" },
    { name: "ziggurat", hex: "#b7dee2" },
  ];

  return (
    <div>
      <StoryTitle>Secondary Colors</StoryTitle>
      <StoryDescription>
        Copy #hex by clicking on the hexcode. Copy variable by clicking on the
        color name
      </StoryDescription>
      {colors.map((color) => (
        <React.Fragment key={color.name}>
          <Color hex={color.hex} name={color.name} />
          <StorySpace space="5" />
        </React.Fragment>
      ))}
    </div>
  );
};

/**
 * Returns all Grey colors/tones
 *
 */
export const Greys = () => {
  const colors = [
    { name: "white", hex: "#ffffff" },
    { name: "iron", hex: "#d6d6d7" },
    { name: "gray", hex: "#828282" },
  ];

  return (
    <div>
      <StoryTitle>Greys Colors</StoryTitle>
      <StoryDescription>
        Copy #hex by clicking on the hexcode. Copy variable by clicking on the
        color name
      </StoryDescription>
      {colors.map((color) => (
        <React.Fragment key={color.name}>
          <Color hex={color.hex} name={color.name} />
          <StorySpace space="5" />
        </React.Fragment>
      ))}
    </div>
  );
};

/**
 * Returns all Alert colors
 *
 */
export const Alerts = () => {
  const colors = [
    { name: "error", hex: "#e45e6a" },
    { name: "error-light", hex: "#fab8ba" },
    { name: "warning", hex: "#fbd85b" },
    { name: "warning-light", hex: "#fbeaad" },
    { name: "info", hex: "#3333ff" },
    { name: "info-light", hex: "#d0e5f9" },
    { name: "success", hex: "#27ae60" },
    { name: "success-light", hex: "#d0f1d2" },
  ];

  return (
    <div>
      <StoryTitle>Alert Colors</StoryTitle>
      <StoryDescription>
        Copy #hex by clicking on the hexcode. Copy variable by clicking on the
        color name
      </StoryDescription>
      {colors.map((color) => (
        <React.Fragment key={color.name}>
          <Color hex={color.hex} name={color.name} />
          <StorySpace space="5" />
        </React.Fragment>
      ))}
    </div>
  );
};
