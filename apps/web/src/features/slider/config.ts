export const SLIDER_CONFIG = {
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
  speed: 1500,
  revalidate: 300,
  breakpoints: {
    sm: { height: 300 },
    md: { height: 400 },
    lg: { height: 500 },
    xl: { height: 600 },
  },
  spacing: {
    x: 32, // left/right padding
    y: 16, // top margin
  },
} as const;
