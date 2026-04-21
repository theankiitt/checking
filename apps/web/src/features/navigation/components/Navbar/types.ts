export interface NavItem {
  id: string;
  label: string;
  href: string;
  type: "link" | "dropdown";
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

export interface SiteSettings {
  siteName: string;
  siteLogo: string;
  siteFavicon: string;
}

export interface NavbarClientProps {
  navigationItems: NavItem[];
}
