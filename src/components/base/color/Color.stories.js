import { StoryTitle, StoryDescription, StorySpace } from "../storybook";

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
    { name: "concrete", hex: "#f2f2f2" },
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
    { name: "rose-bud", hex: "#fbad94" },
    { name: "linen", hex: "#f8dfd9" },
    { name: "eunry", hex: "#d3a79d" },
    { name: "pancho", hex: "#efd5a5" },
    { name: "albescent-white", hex: "#f7ead2" },
    { name: "sorrell-brown", hex: "#d2bb91" },
    { name: "aqua-island", hex: "#a1d8dd" },
    { name: "botticelli", hex: "#d4e8ea" },
    { name: "shadow-green", hex: "#95b8ba" },
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
