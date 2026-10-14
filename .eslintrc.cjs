module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "plugin:storybook/recommended",
    "plugin:storybook/recommended",
    "plugin:prettier/recommended",
    "prettier",
  ],
  ignorePatterns: ["dist", "dev-dist", "node_modules", ".eslintrc.cjs"],
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  globals: { __DEMO_BUILD__: "readonly" },
  settings: { react: { version: "18.2" } },
  plugins: ["react-refresh", "prettier"],
  rules: {
    // This legacy JavaScript project does not use runtime PropTypes. Keep the
    // lint policy focused on correctness rules instead of partial annotations.
    "react/prop-types": "off",
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
      },
    ],
  },
};
