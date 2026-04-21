import type { Preview } from "@storybook/react";
import "../src/app/globals.css";

const preview: Preview = {
  parameters: {
    actions: {
      argTypesRegex: "^on[A-Z].*",
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#ffffff" },
        { name: "dark", value: "#1a1a1a" },
        { name: "gray", value: "#f3f4f6" },
        { name: "primary", value: "#3b82f6" },
      ],
    },
    darkMode: {
      stylePreview: true,
      darkClass: "dark",
      lightClass: "light",
      test: true,
    },
    nextRouter: {
      Provider: ({ children }) => children,
    },
    layout: "centered",
    viewport: {
      viewports: {
        mobile: {
          name: "Mobile",
          styles: {
            width: "375px",
            height: "812px",
          },
        },
        tablet: {
          name: "Tablet",
          styles: {
            width: "768px",
            height: "1024px",
          },
        },
        desktop: {
          name: "Desktop",
          styles: {
            width: "1280px",
            height: "720px",
          },
        },
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story, context) => {
      const theme = context.globals.backgrounds?.value || "light";
      const isDark = theme === "#1a1a1a";

      return (
        <div className={isDark ? "dark" : ""}>
          <div
            className={
              isDark ? "bg-gray-900 text-white" : "bg-white text-gray-900"
            }
          >
            <Story />
          </div>
        </div>
      );
    },
  ],
};

export default preview;
