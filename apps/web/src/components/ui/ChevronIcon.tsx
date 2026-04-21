import { type SVGProps } from "react";

interface ChevronIconProps extends SVGProps<SVGSVGElement> {
  direction: "left" | "right";
}

export function ChevronIcon({
  direction,
  className,
  ...props
}: ChevronIconProps) {
  const path = direction === "left" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7";

  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d={path}
      />
    </svg>
  );
}
