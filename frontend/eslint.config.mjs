import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";

const ANY_DEPTH = "**";

const compat = new FlatCompat({ baseDirectory: dirname(fileURLToPath(import.meta.url)) });

const noCommentsRule = {
  meta: { type: "suggestion", schema: [], messages: { comment: "Yorum satırı kullanılmamalı." } },
  create(context) {
    return {
      Program() {
        for (const comment of context.sourceCode.getAllComments()) {
          if (comment.type !== "Shebang") context.report({ loc: comment.loc, messageId: "comment" });
        }
      },
    };
  },
};

const config = [
  { ignores: [".next/", "node_modules/", "coverage/", "playwright-report/", "test-results/", "public/"] },
  ...compat.extends("next/core-web-vitals", "plugin:jsx-a11y/recommended", "prettier"),
  {
    plugins: { local: { rules: { "no-comments": noCommentsRule } } },
    rules: {
      "no-console": "error",
      "local/no-comments": "error",
      "no-unused-vars": ["error", { argsIgnorePattern: "^_", ignoreRestSiblings: true }],
      "react/no-array-index-key": "error",
      "react/jsx-key": "error",
      "@next/next/no-img-element": "error",
      "import/no-anonymous-default-export": "off",
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
          pathGroups: [{ pattern: `@/${ANY_DEPTH}`, group: "internal" }],
          alphabetize: { order: "asc" },
        },
      ],
    },
  },
  {
    files: [["tests", ANY_DEPTH, "*.js"].join("/"), [ANY_DEPTH, "*.test.js"].join("/")],
    rules: { "@next/next/no-img-element": "off", "jsx-a11y/alt-text": "off" },
  },
];

export default config;
