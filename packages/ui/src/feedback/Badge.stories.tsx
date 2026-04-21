import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "../../feedback/Badge";

const meta: Meta<typeof Badge> = {
  title: "UI/Feedback/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "A badge component for status indicators and labels.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "success", "warning", "error", "info"],
      description: "Color variant of the badge",
      table: {
        defaultValue: { summary: "default" },
        type: { summary: "string" },
      },
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size of the badge",
      table: {
        defaultValue: { summary: "md" },
        type: { summary: "string" },
      },
    },
    dot: {
      control: "boolean",
      description: "Show dot indicator",
      table: {
        defaultValue: { summary: "false" },
        type: { summary: "boolean" },
      },
    },
    children: {
      control: "text",
      description: "Badge content",
      table: {
        type: { summary: "ReactNode" },
      },
    },
  },
  args: {
    children: "Badge",
    variant: "default",
    size: "md",
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

// Default Badge
export const Default: Story = {
  args: {
    variant: "default",
    children: "Default",
  },
};

// Success Badge
export const Success: Story = {
  args: {
    variant: "success",
    children: "Success",
  },
};

// Warning Badge
export const Warning: Story = {
  args: {
    variant: "warning",
    children: "Warning",
  },
};

// Error Badge
export const Error: Story = {
  args: {
    variant: "error",
    children: "Error",
  },
};

// Info Badge
export const Info: Story = {
  args: {
    variant: "info",
    children: "Info",
  },
};

// Badge with Dot
export const WithDot: Story = {
  args: {
    variant: "success",
    dot: true,
    children: "Online",
  },
};

// Small Badge
export const Small: Story = {
  args: {
    size: "sm",
    children: "Small",
  },
};

// Large Badge
export const Large: Story = {
  args: {
    size: "lg",
    children: "Large",
  },
};

// All Variants
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Badge variant="default">Default</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="error">Error</Badge>
      <Badge variant="info">Info</Badge>
    </div>
  ),
};

// All Variants with Dots
export const AllVariantsWithDots: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Badge variant="default" dot>
        Default
      </Badge>
      <Badge variant="success" dot>
        Online
      </Badge>
      <Badge variant="warning" dot>
        Pending
      </Badge>
      <Badge variant="error" dot>
        Offline
      </Badge>
      <Badge variant="info" dot>
        New
      </Badge>
    </div>
  ),
};

// Status Badges
export const StatusBadges: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Badge variant="success" dot>
          Active
        </Badge>
        <span className="text-sm text-gray-600">User is active</span>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="warning" dot>
          Pending
        </Badge>
        <span className="text-sm text-gray-600">Awaiting approval</span>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="error" dot>
          Inactive
        </Badge>
        <span className="text-sm text-gray-600">Account disabled</span>
      </div>
    </div>
  ),
};

// Count Badges
export const CountBadges: Story = {
  render: () => (
    <div className="flex gap-4">
      <Badge variant="error">3</Badge>
      <Badge variant="warning">10+</Badge>
      <Badge variant="info">99+</Badge>
    </div>
  ),
};
