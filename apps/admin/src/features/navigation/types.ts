export type NavItemType = "link" | "dropdown";
export type LinkSource = "category" | "custom";

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  type: NavItemType;
  columns?: NavColumn[];
}

export interface NavColumn {
  title: string;
  groups?: NavGroup[];
  items?: NavLink[];
}

export interface NavGroup {
  title: string;
  items: NavLink[];
}

export interface NavLink {
  label: string;
  href: string;
}

export interface Category {
  id: string;
  name: string;
  children?: Category[];
}

export interface FormData {
  label: string;
  type: NavItemType;
  linkSource: LinkSource;
  selectedCategory: string;
  customUrl: string;
  id: string;
  columns: NavColumn[];
}
