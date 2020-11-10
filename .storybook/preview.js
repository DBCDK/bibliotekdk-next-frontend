/**
 * @file This is loaded in the "preview" iframe
 * https://storybook.js.org/docs/react/configure/overview#configure-story-rendering
 */
import "lazysizes";
import "lazysizes/plugins/attrchange/ls.attrchange";
import "../src/css/styles.css";
import { withNextRouter } from "storybook-addon-next-router";
import { addDecorator } from "@storybook/react";

// Make Next.js Link tags work in storybook by mocking the router
// https://www.npmjs.com/package/storybook-addon-next-router
addDecorator(
  withNextRouter({
    async replace(path) {
      alert(path);
    },
    async push(path) {
      alert(path);
    },
  })
);
