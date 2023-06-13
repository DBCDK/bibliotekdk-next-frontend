/**
 * @file
 * This is the main configuration file for setting up storybook
 * See https://storybook.js.org/docs/react/configure/overview#configure-your-storybook-project
 *
 * Our aim is to have a build configuration that resembles the Next.js configuration.
 * I.e. for now it means that storybook should have a webpack configuration
 * that enables us to use CSS modules. This is configured in next-preset.js.
 */

const path = require("path");
module.exports = {
  stories: ["../src/components/**/*.stories.js"],
  presets: [path.resolve(__dirname, "./next-preset.js")],
  addons: ["@storybook/addon-a11y"],
  framework: {
    name: "@storybook/nextjs",
    options: {}
  },
  docs: {
    autodocs: true
  }
};