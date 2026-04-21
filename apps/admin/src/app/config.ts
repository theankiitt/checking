export const APP_CONFIG = {
  locale: "en",
  title: "Admin Dashboard",
  titleTemplate: "%s | GharSamma Admin",
  description: "GharSamma E-commerce Admin Dashboard",
  viewport: {
    width: "device-width" as const,
    initialScale: 1,
  },
  bodyClasses: "antialiased tracking-tight",
} as const;

export const TOAST_CONFIG = {
  position: "bottom-right" as const,
  duration: 2000,
  style: {
    background: "#ffffff",
    color: "#111111",
    fontSize: "14px",
  },
  success: {
    duration: 1500,
    iconTheme: {
      primary: "#16a34a",
      secondary: "#ffffff",
    },
  },
  error: {
    duration: 2000,
    iconTheme: {
      primary: "#ef4444",
      secondary: "#ffffff",
    },
  },
} as const;
