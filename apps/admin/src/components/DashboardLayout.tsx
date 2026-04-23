"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { X, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Sidebar } from "./dashboard/Sidebar";
import { Header } from "./dashboard/Header";
import { MobileQuickActions } from "./dashboard/MobileQuickActions";
import { useSidebar, useMediaQuery } from "@/hooks";
import { cn, getInitials, getFullName } from "@/lib/utils";

const ROUTE_MAP: Record<string, string> = {
  notifications: "/dashboard/notifications",
  categories: "/dashboard/category",
  "manage-categories": "/dashboard/category",
  "additional-details": "/dashboard/category/additional-details",
  "all-products": "/dashboard/products",
  "site-settings": "/dashboard/settings",
  "top-banner": "/dashboard/top-banner",
  "popup-banner": "/dashboard/popup-banner",
  media: "/dashboard/media",
  about: "/dashboard/about",
  sliders: "/dashboard/sliders",
  "website-analytics": "/dashboard/website-analytics",
  "google-analytics": "/dashboard/google-analytics",
  "facebook-pixel": "/dashboard/facebook-pixel",
  navigation: "/dashboard/navigation",
  "product-performance": "/dashboard/product-performance",
  discounts: "/dashboard/discounts",
  "all-orders": "/dashboard/orders",
  "custom-orders": "/dashboard/custom-orders",
  billing: "/dashboard/billing",
  "shipped-delivered": "/dashboard/orders/shipped-delivered",
  returns: "/dashboard/orders/returns",
  refunds: "/dashboard/orders/refunds",
  cancellations: "/dashboard/orders/cancellations",
  "quick-insights": "/dashboard/quick-insights",
  articles: "/dashboard/articles",
};

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBackButton?: boolean;
}

export default function DashboardLayout({
  children,
  title,
  showBackButton,
}: DashboardLayoutProps) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const {
    isOpen: sidebarOpen,
    isDesktop,
    isMobile,
    close: closeSidebar,
  } = useSidebar();
  const { isMobile: isMobileDevice } = useMediaQuery();
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const userInitials = useMemo(
    () => getInitials(user?.firstName, user?.lastName, user?.username),
    [user?.firstName, user?.lastName, user?.username],
  );

  const fullName = useMemo(
    () => getFullName(user?.firstName, user?.lastName, user?.username),
    [user?.firstName, user?.lastName, user?.username],
  );

  const toggleSection = useCallback((sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId],
    );
  }, []);

  const handleNavigate = useCallback(
    (itemId: string, parentId?: string) => {
      const route = ROUTE_MAP[itemId];
      if (route) {
        router.push(route);
      } else if (!parentId) {
        router.push(`/dashboard/${itemId}`);
      }
      closeSidebar();
    },
    [router, closeSidebar],
  );

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Overlay visible={sidebarOpen && !isDesktop} onClose={closeSidebar} />

        <SidebarContainer
          isOpen={sidebarOpen}
          isDesktop={isDesktop}
          onClose={closeSidebar}
        >
          <Sidebar
            expandedSections={expandedSections}
            onToggleSection={toggleSection}
            onNavigate={handleNavigate}
            isMobile={isMobile}
            onClose={closeSidebar}
          />

          <LogoutButton onClick={handleLogout} />
        </SidebarContainer>

        <MainContent isDesktop={isDesktop}>
          <Header
            user={user}
            userInitials={userInitials}
            fullName={fullName}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={closeSidebar}
            showBackButton={showBackButton}
            title={title}
            onLogout={handleLogout}
          />

          {isMobileDevice && <MobileQuickActions onNavigate={handleNavigate} />}

          <main className="p-4 sm:p-6">
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
        </MainContent>
      </div>
    </ProtectedRoute>
  );
}

function Overlay({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  if (!visible) return null;
  return (
    <div
      className="fixed inset-0 bg-black/50 z-40"
      onClick={onClose}
      aria-hidden="true"
    />
  );
}

function SidebarContainer({
  isOpen,
  isDesktop,
  onClose,
  children,
}: {
  isOpen: boolean;
  isDesktop: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 bg-white shadow-lg flex flex-col",
        isDesktop ? "w-64" : "w-80",
        isDesktop || isOpen ? "translate-x-0" : "-translate-x-full",
        "transition-transform duration-200 ease-in-out",
      )}
    >
      <SidebarHeader onClose={onClose} />
      {children}
    </aside>
  );
}

function SidebarHeader({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 flex-shrink-0">
      <span className="text-2xl font-bold text-black title-regular">
        Admin
      </span>
      <button
        onClick={onClose}
        className="lg:hidden p-2 rounded-md text-black hover:text-black hover:bg-gray-100 transition-colors"
        aria-label="Close sidebar"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}

function LogoutButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="p-4 border-t border-gray-200 flex-shrink-0">
      <button
        onClick={onClick}
        className="w-full flex items-center px-3 py-2 text-base font-bold text-black hover:bg-gray-50 hover:text-black rounded-lg transition-colors custom-font"
      >
        <LogOut className="w-4 h-4 mr-3" />
        Logout
      </button>
    </div>
  );
}

function MainContent({
  isDesktop,
  children,
}: {
  isDesktop: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={cn(isDesktop ? "pl-64" : "pl-0", "w-full")}>{children}</div>
  );
}
