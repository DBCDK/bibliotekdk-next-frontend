import { StoryTitle, StoryDescription, StorySpace } from "@/storybook";
import { toColor } from "./utils.js";

import Modal, { useModal } from ".";

export default {
  title: "Modal2.0",
};

const Link = ({ id, context = {} }) => {
  const { push } = useModal();
  return (
    <a
      href=""
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
      href=""
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
      href=""
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
      href=""
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
      href=""
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

export function Default() {
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
          <a
            href=""
            tabIndex="-1"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            i'm not tabbable
          </a>
        </div>
      </div>
    );
  };

  return (
    <Modal.Provider>
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
}

export function Scroll() {
  const ExampleComponent = ({ context }) => {
    const { title } = context;

    const styles = {
      padding: "24px",
      height: "100%",
      overflowY: "auto",
      backgroundColor: toColor(title || "random"),
    };

    return (
      <div style={styles}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            height: "100px",
          }}
        >
          {title}
          <Clear />
        </div>

        <div style={{ height: "2000px" }}>
          <p>Modal content ...</p>

          <div>
            <a href="#">link</a>
          </div>
          <div>
            <a href="#">link</a>
          </div>
          <div>
            <a href="#">link</a>
          </div>
          <div>
            <a href="#">link</a>
          </div>
          <div>
            <a href="#">link</a>
          </div>
          <div>
            <a href="#">link</a>
          </div>
        </div>
      </div>
    );
  };
  return (
    <Modal.Provider>
      <div>
        <Link id="Modal" context={{ title: "This is a long modal" }} />
        <Modal.Container>
          <Modal.Page id="Modal" component={ExampleComponent} />
        </Modal.Container>
      </div>
    </Modal.Provider>
  );
}
