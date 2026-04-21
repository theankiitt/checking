import { Inter, Bricolage_Grotesque, Public_Sans, Manrope } from "next/font/google";

export const public_sans = Public_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

export const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
});
