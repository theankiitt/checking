import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../../base/Button";

const meta: Meta<typeof Button> = {
  title: "UI/Base/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A versatile button component with multiple variants and states. Perfect for any call-to-action.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "outline", "ghost", "danger"],
      description: "Visual style of the button",
      table: {
        defaultValue: { summary: "primary" },
        type: { summary: "string" },
      },
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size of the button",
      table: {
        defaultValue: { summary: "md" },
        type: { summary: "string" },
      },
    },
    isLoading: {
      control: "boolean",
      description: "Show loading state",
      table: {
        defaultValue: { summary: "false" },
        type: { summary: "boolean" },
      },
    },
    disabled: {
      control: "boolean",
      description: "Disable the button",
      table: {
        defaultValue: { summary: "false" },
        type: { summary: "boolean" },
      },
    },
    children: {
      control: "text",
      description: "Button label",
      table: {
        type: { summary: "ReactNode" },
      },
    },
  },
  args: {
    children: "Button",
    variant: "primary",
    size: "md",
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// Primary Button
export const Primary: Story = {
  args: {
    variant: "primary",
    children: "Primary Button",
  },
  parameters: {
    docs: {
      story: {
        inline: true,
        description: "Primary button for main actions",
      },
    },
  },
};

// Secondary Button
export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary Button",
  },
  parameters: {
    docs: {
      story: {
        inline: true,
        description: "Secondary button for less important actions",
      },
    },
  },
};

// Outline Button
export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Outline Button",
  },
  parameters: {
    docs: {
      story: {
        inline: true,
        description: "Outline button with border",
      },
    },
  },
};

// Ghost Button
export const Ghost: Story = {
  args: {
    variant: "ghost",
    children: "Ghost Button",
  },
  parameters: {
    docs: {
      story: {
        inline: true,
        description: "Ghost button without background",
      },
    },
  },
};

// Danger Button
export const Danger: Story = {
  args: {
    variant: "danger",
    children: "Danger Button",
  },
  parameters: {
    docs: {
      story: {
        inline: true,
        description: "Button for destructive actions",
      },
    },
  },
};

// Loading State
export const Loading: Story = {
  args: {
    variant: "primary",
    isLoading: true,
    children: "Loading...",
  },
  parameters: {
    docs: {
      story: {
        inline: true,
        description: "Button in loading state",
      },
    },
  },
};

// Disabled State
export const Disabled: Story = {
  args: {
    variant: "primary",
    disabled: true,
    children: "Disabled Button",
  },
  parameters: {
    docs: {
      story: {
        inline: true,
        description: "Disabled button",
      },
    },
  },
};

// Small Size
export const Small: Story = {
  args: {
    variant: "primary",
    size: "sm",
    children: "Small Button",
  },
  parameters: {
    docs: {
      story: {
        inline: true,
        description: "Small sized button",
      },
    },
  },
};

// Large Size
export const Large: Story = {
  args: {
    variant: "primary",
    size: "lg",
    children: "Large Button",
  },
  parameters: {
    docs: {
      story: {
        inline: true,
        description: "Large sized button",
      },
    },
  },
};

// With Left Icon
export const WithLeftIcon: Story = {
  args: {
    variant: "primary",
    children: "With Icon",
    leftIcon: "🎉",
  },
  parameters: {
    docs: {
      story: {
        inline: true,
        description: "Button with icon on the left",
      },
    },
  },
};

// With Right Icon
export const WithRightIcon: Story = {
  args: {
    variant: "primary",
    children: "With Icon",
    rightIcon: "→",
  },
  parameters: {
    docs: {
      story: {
        inline: true,
        description: "Button with icon on the right",
      },
    },
  },
};

// All Variants
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 items-center">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
    </div>
  ),
  parameters: {
    docs: {
      story: {
        inline: true,
        description: "All button variants at once",
      },
    },
  },
};

// All Sizes
export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
  parameters: {
    docs: {
      story: {
        inline: true,
        description: "All button sizes at once",
      },
    },
  },
};
