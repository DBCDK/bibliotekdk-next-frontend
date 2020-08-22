const path = require('path');

module.exports = {
  stories: ['../src/components/**/*.stories.js'],
  presets: [path.resolve(__dirname, './next-preset.js')],
};
