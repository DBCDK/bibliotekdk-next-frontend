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
    <a
      href="#"
      tabIndex="0"
      onClick={(e) => {
        e.preventDefault();
        push(id, context);
      }}
    >
      {id}
    </a>
  );
};

const Pop = () => {
  const { pop } = useModal();
  return (
    <a
      href="#"
      tabIndex="0"
      onClick={(e) => {
        e.preventDefault();
        pop();
      }}
    >
      I will pop the layer
    </a>
  );
};

const Prev = () => {
  const { prev } = useModal();
  return (
    <a
      href="#"
      tabIndex="0"
      onClick={(e) => {
        e.preventDefault();
        prev();
      }}
    >
      I will go to previous layer
    </a>
  );
};

const Next = () => {
  const { next } = useModal();
  return (
    <a
      href="#"
      tabIndex="0"
      onClick={(e) => {
        e.preventDefault();
        next();
      }}
    >
      I will go to next layer
    </a>
  );
};

const Clear = () => {
  const { clear } = useModal();
  return (
    <a
      href="#"
      tabIndex="0"
      onClick={(e) => {
        e.preventDefault();
        clear();
      }}
    >
      I will clear all layers
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
      {title}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          height: "100px",
        }}
      >
        <Prev />
        <Next />
      </div>
      <div>
        <Pop />
      </div>
      <div>
        <Clear />
      </div>
      <input tabIndex="0" type="text" placeholder="Help" />
      <div>
        <a href="#" tabIndex="-1">
          i'm not tabbable
        </a>
      </div>
      <div>
        <br />
        <br />
        <Link id="Settings" context={{ title: "Im a new layer" }} />
        <br />
        <Link id="Order" context={{ title: "Im also a new layer" }} />
        <br />
        <Link id="Profile" context={{ title: "Im a new layer two" }} />
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
      <div
        onClick={() => {
          window.history.pushState("", "", "?hest=ost");
          console.log("prut");
        }}
      >
        prut
      </div>
      <div>
        <Link id="Profile" context={{ title: "This is a Modal" }} />
        <br />
        <Link id="Order" context={{ title: "This is also a Modal" }} />
        <Modal.Container>
          <Modal.Page id="Profile" component={ExampleComponent} />
          <Modal.Page id="Settings" component={ExampleComponent} />
          <Modal.Page id="Order" component={ExampleComponent} />
        </Modal.Container>
      </div>
    </Modal.Provider>
  );
};
