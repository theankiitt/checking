import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "../../form/Input";

const meta: Meta<typeof Input> = {
  title: "UI/Form/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A flexible input component with validation, icons, and error states.",
      },
    },
  },
  argTypes: {
    label: {
      control: "text",
      description: "Label text",
      table: {
        type: { summary: "string" },
      },
    },
    placeholder: {
      control: "text",
      description: "Placeholder text",
      table: {
        type: { summary: "string" },
      },
    },
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "tel", "url"],
      description: "Input type",
      table: {
        defaultValue: { summary: "text" },
        type: { summary: "string" },
      },
    },
    error: {
      control: "text",
      description: "Error message",
      table: {
        type: { summary: "string" },
      },
    },
    helperText: {
      control: "text",
      description: "Helper text",
      table: {
        type: { summary: "string" },
      },
    },
    disabled: {
      control: "boolean",
      description: "Disable input",
      table: {
        defaultValue: { summary: "false" },
        type: { summary: "boolean" },
      },
    },
  },
  args: {
    label: "Email",
    placeholder: "Enter your email",
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

// Default Input
export const Default: Story = {
  args: {
    label: "Email",
    placeholder: "Enter your email",
    type: "email",
  },
};

// Input with Error
export const WithError: Story = {
  args: {
    label: "Email",
    type: "email",
    value: "invalid-email",
    error: "Please enter a valid email address",
  },
};

// Input with Helper Text
export const WithHelperText: Story = {
  args: {
    label: "Password",
    type: "password",
    helperText: "Must be at least 8 characters",
  },
};

// Disabled Input
export const Disabled: Story = {
  args: {
    label: "Disabled Input",
    disabled: true,
    value: "Cannot edit this",
  },
};

// Input with Left Icon
export const WithLeftIcon: Story = {
  args: {
    label: "Search",
    placeholder: "Search...",
    type: "search",
  },
};

// Input with Right Icon
export const WithRightIcon: Story = {
  args: {
    label: "Website",
    placeholder: "https://example.com",
    type: "url",
  },
};

// All Input States
export const AllStates: Story = {
  render: () => (
    <div className="space-y-6 w-full max-w-md">
      <Input label="Default" placeholder="Default input" />
      <Input label="With value" defaultValue="john@example.com" />
      <Input label="With error" error="This field is required" />
      <Input
        label="With helper text"
        helperText="We'll never share your email"
      />
      <Input label="Disabled" disabled value="Disabled input" />
    </div>
  ),
};

// Different Input Types
export const DifferentTypes: Story = {
  render: () => (
    <div className="space-y-6 w-full max-w-md">
      <Input label="Text" type="text" placeholder="Text input" />
      <Input label="Email" type="email" placeholder="Email input" />
      <Input label="Password" type="password" placeholder="Password input" />
      <Input label="Number" type="number" placeholder="Number input" />
      <Input label="URL" type="url" placeholder="URL input" />
    </div>
  ),
};
