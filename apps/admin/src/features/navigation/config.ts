export const NAVIGATION_CONFIG = {
  colors: {
    link: {
      bg: "bg-gray-100",
      text: "text-gray-600",
    },
    dropdown: {
      bg: "bg-purple-100",
      text: "text-purple-700",
    },
  },
  buttons: {
    save: {
      bg: "bg-orange-600",
      hover: "hover:bg-orange-700",
    },
    edit: {
      bg: "bg-blue-50",
      text: "text-blue-600",
    },
    delete: {
      bg: "bg-red-50",
      text: "text-red-600",
    },
  },
} as const;

export const DRAG_ACTIVATION_CONSTRAINT = { distance: 8 };
