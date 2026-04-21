import type { StorybookConfig } from "@storybook/nextjs";

const config: StorybookConfig = {
  stories: [
    "../../../packages/ui/src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../../../packages/ui/src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../src/**/*.mdx",
  ],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-a11y",
    "@storybook/addon-webpack5-compiler-swc",
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  swc: () => ({
    jsc: {
      transform: {
        react: {
          runtime: "automatic",
          development: process.env.NODE_ENV === "development",
          refresh: true,
        },
      },
    },
  }),
  docs: {
    autodocs: "tag",
    defaultName: "Docs",
  },
  typescript: {
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) =>
        prop.parent ? !/node_modules/.test(prop.parent.fileName) : true,
    },
  },
};

export default config;
