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

export interface QuickLink {
  label: string;
  href: string;
}

export interface SocialLink {
  name: string;
  href: string;
  icon: string;
}

export interface SiteSettings {
  siteName: string;
  siteLogo: string;
  siteFavicon: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  footerQuickLinks?: QuickLink[];
  socialLinks?: SocialLink[];
  footerDescription?: string;
}

export interface NavbarClientProps {
  navigationItems: NavItem[];
}
