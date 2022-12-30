module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  env: {
    production: {
      plugins: [
        "transform-remove-console",
        "react-native-reanimated/plugin",
        "react-rename-unsafe-lifecycle",
      ],
    },
    development: {
      plugins: [
        "react-native-reanimated/plugin",
        "react-rename-unsafe-lifecycle",
      ],
    },
  },
  compact: true,
  comments: false,
  minified: true,
};
