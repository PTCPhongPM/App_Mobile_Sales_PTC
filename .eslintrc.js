module.exports = {
  env: {
    browser: false,
    es2021: true,
    node: true,
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  extends: [
    "eslint:recommended",
    "plugin:prettier/recommended",
    "plugin:react/recommended",
    "plugin:import/recommended",
    "plugin:react-native/all",
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["react", "react-native", "react-hooks", "import"],
  rules: {
    //  Common
    "import/order": "error",
    "import/first": "error",
    "react/jsx-uses-react": "error",
    "react/jsx-uses-vars": "error",
    "import/namespace": 0,
    "no-warning-comments": 1,
    "no-console": 1,

    //  React
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "react/jsx-filename-extension": [1, { extensions: [".js", ".jsx"] }],

    // React Native
    "react-native/no-unused-styles": 2,
    "react-native/split-platform-components": 2,
    "react-native/no-inline-styles": 2,
    "react-native/no-color-literals": 2,
    "react-native/no-raw-text": 2,
    "react-native/no-single-element-style-arrays": 2,
  },
};
