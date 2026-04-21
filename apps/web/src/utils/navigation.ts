interface NavItem {
  id: string;
  label: string;
  href: string;
  type: "link" | "dropdown";
  columns?: NavColumn[];
}

interface NavColumn {
  title: string;
  groups?: NavGroup[];
  items?: NavLink[];
}

interface NavGroup {
  title: string;
  items: NavLink[];
}

interface NavLink {
  label: string;
  href: string;
}

export async function getNavigationItems(): Promise<NavItem[]> {
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!API_BASE_URL) {
      return [];
    }

    const response = await fetch(
      `${API_BASE_URL}/api/v1/configuration/public/navigation`,
      { cache: "no-store" },
    );

    if (!response.ok) {
      return [];
    }

    const result = await response.json();

    if (!result.success) {
      return [];
    }

    if (!Array.isArray(result.data) || result.data.length === 0) {
      return [];
    }

    return result.data;
  } catch (error) {
    return [];
  }
}

export type { NavItem, NavColumn, NavGroup, NavLink };
