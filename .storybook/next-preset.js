/**
 * @file
 * This is a preset for storybook
 * see https://storybook.js.org/docs/react/api/presets
 *
 * Basically, it modifies the webpack config to enable CSS modules.
 */

const path = require("path");

module.exports = {
  webpackFinal: async (baseConfig, options) => {
    // Modify or replace config. Mutating the original reference object can cause unexpected bugs.
    const { module = {} } = baseConfig;

    const newConfig = {
      ...baseConfig,

      resolve: {
        ...baseConfig.resolve,
        alias: {
          ...baseConfig.resolve.alias,
          "@/storybook": path.resolve(
            __dirname,
            "../src/components/base/storybook"
          ),
          "@/public": path.resolve(__dirname, "../public"),
          "css/animations": path.resolve(
            __dirname,
            "../src/components/base/animation/animations.module.css"
          ),
          "css/clamp": path.resolve(
            __dirname,
            "../src/components/base/clamp/Clamp.module.css"
          ),
          "@": path.resolve(__dirname, "../src"),
        },
      },

      module: {
        ...module,
        rules: [...(module.rules || [])],
      },
    };
    //
    // CSS Modules
    // Many thanks to https://github.com/storybookjs/storybook/issues/6055#issuecomment-521046352
    //

    // First we prevent webpack from using Storybook CSS rules to process CSS modules
    newConfig.module.rules.find(
      (rule) => rule.test.toString() === "/\\.css$/"
    ).exclude = /\.module\.css$/;

    // Then we tell webpack what to do with CSS modules
    newConfig.module.rules.push({
      test: /\.module\.css$/,
      use: [
        "style-loader",
        {
          loader: "css-loader",
          options: {
            importLoaders: 1,
            modules: true,
          },
        },
      ],
    });

    newConfig.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: "javascript/auto",
    });

    newConfig.module.rules.push({
      test: /\.scss$/,
      use: [
        // Creates `style` nodes from JS strings
        "style-loader",
        // Translates CSS into CommonJS
        "css-loader",
        // Compiles Sass to CSS
        "sass-loader",
      ],
      exclude: path.resolve(__dirname, "./node_modules"),
      include: path.resolve(__dirname, "./src/scss"),
    });

    // Adds svg loader to storybook webpack config
    const fileLoaderRule = newConfig.module.rules.find(
      (rule) => rule.test && rule.test.test && rule.test.test(".svg")
    );
    fileLoaderRule.exclude = /\.svg$/;

    newConfig.module.rules.push({
      test: /\.svg$/,
      enforce: "pre",
      use: require.resolve("@svgr/webpack"),
    });

    return newConfig;
  },
};
