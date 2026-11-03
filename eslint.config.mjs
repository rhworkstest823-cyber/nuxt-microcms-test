import oxlint from "eslint-plugin-oxlint";
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt(
  {
    files: ["**/*.vue"],
    rules: {
      "vue/block-order": [
        "error",
        {
          order: ["spec", "script", "template", "style"],
        },
      ],
      "vue/no-empty-component-block": "error",
      // 既存コードはcamelCaseのprop指定・props分割代入でデフォルト値を設定する方針のため無効化
      "vue/attribute-hyphenation": "off",
      "vue/require-default-prop": "off",
      // 整形は oxfmt / 既存の書式に任せる
      "vue/html-self-closing": "off",
      "vue/attributes-order": "off",
    },
  },
  {
    // 既存のレイアウト構造を維持（単一ルート化はデザイン確認後に検討）
    files: ["app/layouts/default.vue"],
    rules: { "vue/no-multiple-template-root": "off" },
  },
).append(
  // oxlintで検査済みのルールをeslint側で無効化（.oxlintrc.json と同期）
  ...oxlint.buildFromOxlintConfigFile("./.oxlintrc.json"),
);
