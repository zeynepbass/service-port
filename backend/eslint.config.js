import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import globals from "globals";

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

export default [
  { ignores: ["node_modules/", "coverage/", "uploads/", "tests/.uploads/"] },
  js.configs.recommended,
  importPlugin.flatConfigs.recommended,
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.node,
    },
    plugins: { local: { rules: { "no-comments": noCommentsRule } } },
    rules: {
      "no-console": "error",
      "local/no-comments": "error",
      "no-unused-vars": ["error", { argsIgnorePattern: "^_|^next$|^req$|^res$" }],
      "import/no-unresolved": ["error", { ignore: ["^@asteasolutions/zod-to-openapi$", "^vitest/config$"] }],
      "import/order": ["error", { alphabetize: { order: "asc" } }],
      eqeqeq: ["error", "always"],
      "prefer-const": "error",
    },
  },
  prettier,
];
