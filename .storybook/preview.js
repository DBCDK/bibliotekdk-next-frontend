/**
 * @file This is loaded in the "preview" iframe
 * https://storybook.js.org/docs/react/configure/overview#configure-story-rendering
 */
import "lazysizes";
import "lazysizes/plugins/attrchange/ls.attrchange";
import "../src/scss/custom-bootstrap.scss";
import "../src/css/styles.css";
import { AnonymousSessionContext } from "../src/components/hooks/useUser";
import { ModalContext } from "../src/components/_modal";
import { APIStateContext } from "../src/lib/api/api";
import { withNextRouter } from "storybook-addon-next-router";
import { addDecorator } from "@storybook/react";

// Make Next.js Link tags work in storybook by mocking the router
// https://www.npmjs.com/package/storybook-addon-next-router
export const decorators = [
  (Story) => {
    return (
      <APIStateContext.Provider value={{}}>
        <Story />
      </APIStateContext.Provider>
    );
  },
  (Story) => {
    return (
      <AnonymousSessionContext.Provider value={{ accessToken: "dummy-token" }}>
        <Story />
      </AnonymousSessionContext.Provider>
    );
  },
  (Story) => {
    return (
      <ModalContext.Provider value={{}}>
        <Story />
      </ModalContext.Provider>
    );
  },
  withNextRouter({
    async replace(path) {
      alert(typeof path === "object" ? JSON.stringify(path) : path);
    },
    async push(path) {
      alert(typeof path === "object" ? JSON.stringify(path) : path);
    },
  }),
];
