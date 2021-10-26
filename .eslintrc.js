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
    // https://github.com/emotion-js/emotion/issues/2474
    // https://github.com/evanw/esbuild/issues/1172
    // https://github.com/evanw/esbuild/issues/718

    // Auto-fixable, waiting for this to land
    // https://github.com/emotion-js/emotion/pull/2353
    // "@emotion/jsx-import": [2, "jsxImportSource"],
  },
};
