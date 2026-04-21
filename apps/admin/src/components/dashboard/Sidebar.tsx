"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { NAVIGATION_ITEMS, NavItem, NavItemChild } from "@/data/navigation";

interface SidebarProps {
  expandedSections: string[];
  onToggleSection: (id: string) => void;
  onNavigate: (id: string, parentId?: string) => void;
  isMobile?: boolean;
  onClose?: () => void;
  userPermissions?: string[];
  userRole?: string;
}

const hasPermission = (
  permissions: string[] = [],
  required?: string,
): boolean => {
  if (!required) return true;
  return permissions.includes("*") || permissions.includes(required);
};

export function Sidebar({
  expandedSections,
  onToggleSection,
  onNavigate,
  isMobile,
  onClose,
  userPermissions = [],
  userRole = "ADMIN",
}: SidebarProps) {
  const pathname = usePathname();
  const isAdmin = userRole === "ADMIN";

  const isActive = (itemId: string, parentId?: string): boolean => {
    const path = pathname.toLowerCase();
    if (parentId) {
      return (
        path.includes(parentId.toLowerCase()) &&
        path.includes(itemId.toLowerCase())
      );
    }
    const routePrefix = process.env.NEXT_PUBLIC_DASHBOARD_ROUTE || "/dashboard";
    return (
      path === `${routePrefix}/${itemId.toLowerCase()}` ||
      path === `${routePrefix}/${itemId.toLowerCase()}/`
    );
  };

  const visibleItems = useMemo(() => {
    if (isAdmin) return NAVIGATION_ITEMS;

    return NAVIGATION_ITEMS.filter((item) => {
      if (hasPermission(userPermissions, item.permission)) return true;
      return item.children?.some((child) =>
        hasPermission(userPermissions, child.permission),
      );
    });
  }, [isAdmin, userPermissions]);

  const renderNavItem = (item: NavItem) => {
    const Icon = item.icon;
    const hasChildren = !!item.children?.length;
    const expanded = expandedSections.includes(item.id);
    const active = isActive(item.id);
    const canView = isAdmin || hasPermission(userPermissions, item.permission);
    if (!canView) return null;

    const handleClick = () => {
      if (hasChildren) {
        onToggleSection(item.id);
      } else {
        onNavigate(item.id);
        if (isMobile && onClose) onClose();
      }
    };

    return (
      <div key={item.id}>
        <button
          onClick={handleClick}
          aria-expanded={hasChildren ? expanded : undefined}
          aria-current={active ? "page" : undefined}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${
            active
              ? "bg-orange-50 text-orange-700 border-l-2 border-orange-500"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <div className="flex items-center min-w-0 flex-1">
            <Icon className={`w-5 h-5 mr-3 flex-shrink-0 ${active ? 'text-orange-600' : 'text-gray-500'}`} />
            <span className={`text-lg font-medium ${active ? 'text-orange-700' : 'text-gray-700'}`}>{item.label}</span>
          </div>
          {hasChildren && (
            <ChevronRight
              className={`w-3 h-3 transition-transform ${expanded ? "rotate-90" : "text-gray-400"}`}
            />
          )}
        </button>

        {hasChildren && expanded && (
          <div className="relative ml-4 mt-1 space-y-0.5">
            {item.children!.map((child: NavItemChild) => {
              if (!isAdmin && !hasPermission(userPermissions, child.permission))
                return null;
              const ChildIcon = child.icon;
              return (
                <button
                  key={child.id}
                  onClick={() => {
                    onNavigate(child.id, item.id);
                    if (isMobile && onClose) onClose();
                  }}
                  aria-current={
                    isActive(child.id, item.id) ? "page" : undefined
                  }
                  className={`w-full flex items-center pl-6 pr-3 py-2 rounded-lg text-base transition-colors ${
                    isActive(child.id, item.id)
                      ? "bg-orange-50 text-orange-700 font-medium"
                      : "text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <ChildIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="text-base truncate">
                    {child.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <nav
      role="navigation"
      aria-label="Main navigation"
      className="flex-1 overflow-y-auto px-2 py-4"
      style={{ scrollbarWidth: "none" }}
    >
      <div className="space-y-0.5">{visibleItems.map(renderNavItem)}</div>
    </nav>
  );
}
