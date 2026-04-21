export function cn(
  ...classes: (string | boolean | undefined | null)[]
): string {
  return classes.filter(Boolean).join(" ");
}

export const BREAKPOINTS = {
  DESKTOP: 1024,
  MOBILE: 768,
} as const;

export const SIDEBAR_WIDTH = {
  DESKTOP: "w-64",
  MOBILE: "w-80",
} as const;

export const ANIMATION = {
  OVERLAY: "bg-black/50",
  TRANSITION: "transition-colors",
} as const;

export function getInitials(
  firstName?: string | null,
  lastName?: string | null,
  username?: string | null,
): string {
  if (firstName && lastName)
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  if (firstName) return firstName.charAt(0).toUpperCase();
  if (username) return username.charAt(0).toUpperCase();
  return "A";
}

export function getFullName(
  firstName?: string | null,
  lastName?: string | null,
  username?: string | null,
): string {
  if (firstName && lastName) return `${firstName} ${lastName}`;
  if (firstName) return firstName;
  return username || "Admin";
}
