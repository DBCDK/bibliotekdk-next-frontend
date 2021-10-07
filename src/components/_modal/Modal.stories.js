import { useState } from "react";

import { StoryTitle, StoryDescription, StorySpace } from "@/storybook";
import { toColor } from "./utils.js";

import Modal, { useModal } from "./";

export default {
  title: "Modal2.0",
};

const Link = ({ id, context = {} }) => {
  const { push } = useModal();
  return (
    <a href="#" tabIndex="0" onClick={() => push(id, context)}>
      {id}
    </a>
  );
};

const Close = () => {
  const { pop } = useModal();
  return (
    <a href="#" tabIndex="0" onClick={() => pop()}>
      x
    </a>
  );
};

const ExampleComponent = ({ context }) => {
  const { title } = context;

  const styles = {
    padding: "24px",
    height: "100%",
    backgroundColor: toColor(title || "random"),
  };

  return (
    <div style={styles}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {title}
        <Close />
      </div>
      <input tabIndex="0" type="text" placeholder="Help" />
      <div>
        <Link id="Settings" context={{ title: "Change your settings" }} />
      </div>
    </div>
  );
};

/**
 * Returns all Primary colors
 *
 */
export const Default = () => {
  return (
    <Modal.Provider
      load={() => []}
      save={(stack) => console.log("...saving changes in stack", stack)}
    >
      <div>
        <Link id="Profile" context={{ title: "This is your profile" }} />
        <Modal.Container>
          <Modal.Page id="Profile" component={ExampleComponent} />
          <Modal.Page id="Settings" component={ExampleComponent} />
        </Modal.Container>
      </div>
    </Modal.Provider>
  );
};
