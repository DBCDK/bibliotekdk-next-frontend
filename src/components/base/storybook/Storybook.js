import Title from "@/components/base/title";
import Text from "@/components/base/text";
import Button from "@/components/base/button";

import styles from "./Storybook.module.css";
import cx from "classnames";

/**
 * Function to copy text to clipboard
 *
 * @param {string} text
 *
 */
function copyToClipboard(text) {
  const el = document.createElement("textarea");
  el.value = text;
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
}

function CopyButton({ el, txt = "Copy" }) {
  return (
    <Button
      className={styles.copy}
      type="secondary"
      size="small"
      onClick={() => copyToClipboard(el)}
    >
      {txt}
    </Button>
  );
}

/**
 * (FOR INTERNAL/STORYBOOK USE ONLY!)
 * Function to return storybook titles
 *
 * @param {Object} children
 * @param {boolean} copy // adds a copy button
 *
 * @returns {React.JSX.Element}
 */
export function StoryTitle({ children, copy = false }) {
  const el = "<StoryTitle>Im a storybook title</StoryTitle>";

  return (
    <div className={styles.title}>
      <Title type="title4">{children}</Title>

      {copy && <CopyButton el={el} txt="Copy title element" />}
    </div>
  );
}

/**
 * (FOR INTERNAL/STORYBOOK USE ONLY!)
 * Function to return storybook descriptions
 *
 * @param {Object} children
 * @param {boolean} copy // adds a copy button
 *
 * @returns {React.JSX.Element}
 */
export function StoryDescription({ children, copy }) {
  const el =
    "<StoryDescription>Im a storybook description ...</StoryDescription>";

  return (
    <div className={styles.description}>
      <Text type="text2">{children}</Text>

      {copy && <CopyButton el={el} txt="Copy description element" />}
    </div>
  );
}

/**
 * (FOR INTERNAL/STORYBOOK USE ONLY!)
 * Function to return storybook spacing
 *
 * @param {string} space
 * @param {string} direction
 * @param {boolean} demo // makes spaces visible
 * @param {boolean} copy // adds a copy button
 *
 * @returns {React.JSX.Element}
 */
export function StorySpace({
  space = "2",
  direction = "h",
  demo = false,
  copy,
}) {
  const key = `${direction}-space-${space}`;

  if (copy) {
    const el = `<StorySpace direction="${direction}" space="2" />`;
    return <CopyButton el={el} txt="Copy space element" />;
  }

  return (
    <div
      className={cx({
        [styles["v-space-1"]]: key === "v-space-1",
        [styles["v-space-2"]]: key === "v-space-2",
        [styles["v-space-3"]]: key === "v-space-3",
        [styles["v-space-4"]]: key === "v-space-4",
        [styles["v-space-5"]]: key === "v-space-5",
        [styles["v-space-6"]]: key === "v-space-6",
        [styles["v-space-7"]]: key === "v-space-7",
        [styles["v-space-8"]]: key === "v-space-8",
        [styles["h-space-1"]]: key === "h-space-1",
        [styles["h-space-2"]]: key === "h-space-2",
        [styles["h-space-3"]]: key === "h-space-3",
        [styles["h-space-4"]]: key === "h-space-4",
        [styles["h-space-5"]]: key === "h-space-5",
        [styles["h-space-6"]]: key === "h-space-6",
        [styles["h-space-7"]]: key === "h-space-7",
        [styles["h-space-8"]]: key === "h-space-8",
        [styles.demo]: demo,
      })}
    />
  );
}

/**
 * (FOR INTERNAL/STORYBOOK USE ONLY!)
 * Function to return storybook label
 *
 * @param {Object} children
 * @param {boolean} copy // adds a copy button
 *
 * @returns {React.JSX.Element}
 */
export function StoryLabel({ children, copy }) {
  const el = "<StoryLabel>Im a label</StoryLabel>";

  return (
    <div className={styles.label}>
      <Text type="text4">{children}</Text>

      {copy && <CopyButton el={el} txt="Copy label element" />}
    </div>
  );
}

/**
 * (FOR INTERNAL/STORYBOOK USE ONLY!)
 * Function to return storybook label
 *
 * @param {Object} children
 * @param {boolean} copy // adds a copy button
 *
 * @returns {React.JSX.Element}
 */
export function StoryRouter({ router }) {
  return (
    <div className={styles.router}>
      <div>
        <Text type="text3">Pathname:</Text>
        <Text type="text4" dataCy="router-pathname">
          {router?.pathname}
        </Text>
      </div>
      <div>
        <Text type="text3">Query:</Text>
        <Text type="text4" tag="span" dataCy="router-query">
          {JSON.stringify(router?.query)}
        </Text>
      </div>
      <div>
        <Text type="text3">Action:</Text>
        <Text type="text4" dataCy="router-action">
          {router?.action}
        </Text>
      </div>
    </div>
  );
}
