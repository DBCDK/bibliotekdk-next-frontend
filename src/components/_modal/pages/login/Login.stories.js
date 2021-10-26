import { useState } from "react";

import { StoryTitle, StoryDescription, StorySpace } from "@/storybook";

import Button from "@/components/base/button";
import { Modal } from "@/components/modal";

export default {
  title: "modal/Menu",
};

/**
 * Returns Modal
 *
 */
export function ShowModal() {
  // Storybook handle suggester internal state (url params not working in storybook)
  const [template, setTemplate] = useState(false);

  return (
    <div style={{ height: "100vh" }}>
      <StoryTitle>Modal</StoryTitle>
      <StoryDescription>Full Modal component</StoryDescription>

      <Button type="secondary" size="small" onClick={() => setTemplate("menu")}>
        {"Toggle menu"}
      </Button>

      <Modal
        onClose={() => setTemplate(false)}
        onLang={() => alert("Language changed")}
        template={template}
      />
    </div>
  );
}

/**
 * Menu template
 *
 */
export function MenuTemplate() {
  return (
    <div style={{ height: "100vh" }}>
      <StoryTitle>Menu template</StoryTitle>
      <StoryDescription>
        Modal template for the menu, this is the default template
      </StoryDescription>

      <Modal onClose={null} onLang={null} template={"menu"} />
    </div>
  );
}
