// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt(
  {
    ignores: ["drizzle/"],
  },
  // Your custom configs here
  {
    rules: {
      "vue/multi-word-component-names": [
        "off", // disabled for now
        // {
        //   ignores: ["default"],
        // },
      ],
    },
  },
);
