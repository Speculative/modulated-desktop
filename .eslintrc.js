module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "@emotion"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "prettier",
  ],
  rules: {
    // CRA & React 17 jsx transform takes care of this
    "react/react-in-jsx-scope": "off",

    // For now, have to specify @jsxImportSource at the top of every file using emotion
    // https://github.com/emotion-js/emotion/issues/2041
    // https://github.com/emotion-js/emotion/issues/2442
    // https://github.com/facebook/create-react-app/issues/9847
    // https://github.com/babel/babel/pull/12542

    // Auto-fixable, waiting for this to land
    // https://github.com/emotion-js/emotion/pull/2353
    // "@emotion/jsx-import": [2, "jsxImportSource"],
  },
};
