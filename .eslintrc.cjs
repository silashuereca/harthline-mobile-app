const off = 0,
  warn = 1,
  error = 2;

module.exports = {
  env: {
    browser: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:prettier-vue/recommended",
    "plugin:vue/vue3-recommended",
  ],
  parserOptions: {
    ecmaFeatures: { legacyDecorators: true },
    ecmaVersion: 2015,
    extraFileExtensions: [".vue"],
    parser: "@typescript-eslint/parser",
    requireConfigFile: false,
  },
  plugins: [
    "jest",
    "prettier-vue",
    "promise",
    "simple-import-sort",
    "eslint-plugin-perfectionist",
  ],
  root: true,
  rules: {
    "jest/no-disabled-tests": warn,
    "jest/no-focused-tests": error,
    "jest/no-identical-title": error,
    "jest/prefer-to-have-length": warn,
    "jest/valid-expect": error,
    "no-console": process.env.NODE_ENV === "production" ? error : off,
    "no-debugger": process.env.NODE_ENV === "production" ? error : off,
    "no-restricted-imports": [
      error,
      {
        message: "Please use luxon instead.",
        name: "date-fns",
      },
      {
        message: "Please use luxon instead.",
        name: "moment",
      },
    ],

    "no-tabs": ["error", { allowIndentationTabs: false }],
    "perfectionist/sort-enums": [error, { ignoreCase: false }],
    "perfectionist/sort-interfaces": [error, { ignoreCase: false }],
    "perfectionist/sort-object-types": [error, { ignoreCase: false }],
    "perfectionist/sort-objects": [warn, { groups: [], ignoreCase: false }],
    "prettier-vue/prettier": [error],
    "require-await": error,
    "simple-import-sort/exports": "error",
    "simple-import-sort/imports": "error",
    "vue/component-name-in-template-casing": [error, "PascalCase"],
    "vue/max-attributes-per-line": [
      error,
      {
        multiline: 1,
        singleline: 4,
      },
    ],
    "vue/order-in-components": off,
    "vue/valid-attribute-name": off,
  },
  settings: {
    "prettier-vue": {
      // ignoring template tag
      SFCBlocks: {
        template: false,
      },
    },
  },
};
