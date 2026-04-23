"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { MobileQuickActions } from "./MobileQuickActions";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import { manrope } from "@/lib/fonts";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBackButton?: boolean;
}

const BREAKPOINTS = {
  DESKTOP: 1024,
  MOBILE: 768,
};

export const DASHBOARD_ROUTE =
  process.env.NEXT_PUBLIC_DASHBOARD_ROUTE || "/dashboard";

const ROUTE_MAP: Record<string, string> = {
  categories: `${DASHBOARD_ROUTE}/category`,
  "manage-categories": `${DASHBOARD_ROUTE}/category`,
  "additional-details": `${DASHBOARD_ROUTE}/category/additional-details`,
  "all-products": `${DASHBOARD_ROUTE}/products`,
  "site-settings": `${DASHBOARD_ROUTE}/settings`,
  "top-banner": `${DASHBOARD_ROUTE}?tab=top-banner`,
  "popup-banner": `${DASHBOARD_ROUTE}/popup-banner`,
  media: `${DASHBOARD_ROUTE}/media`,
  about: `${DASHBOARD_ROUTE}/about`,
  "terms-and-conditions": `${DASHBOARD_ROUTE}/terms-and-conditions`,
  "privacy-policy": `${DASHBOARD_ROUTE}/privacy-policy`,
  sliders: `${DASHBOARD_ROUTE}/sliders`,
  "website-analytics": `${DASHBOARD_ROUTE}/website-analytics`,
  "google-analytics": `${DASHBOARD_ROUTE}?tab=google-analytics`,
  "facebook-pixel": `${DASHBOARD_ROUTE}?tab=facebook-pixel`,
  navigation: `${DASHBOARD_ROUTE}/navigation`,
  "product-performance": `${DASHBOARD_ROUTE}/product-performance`,
  discounts: `${DASHBOARD_ROUTE}/discounts`,
  "all-orders": `${DASHBOARD_ROUTE}/orders`,
  billing: `${DASHBOARD_ROUTE}/billing`,
  "shipped-delivered": `${DASHBOARD_ROUTE}/orders/shipped-delivered`,
  returns: `${DASHBOARD_ROUTE}/orders/returns`,
  refunds: `${DASHBOARD_ROUTE}/orders/refunds`,
  cancellations: `${DASHBOARD_ROUTE}/orders/cancellations`,
};

export default function DashboardLayout({
  children,
  title,
  showBackButton,
}: DashboardLayoutProps) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const userInitials = useMemo(() => {
    if (!user) return "A";
    const firstName = user.firstName || "";
    const lastName = user.lastName || "";
    if (firstName && lastName)
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    if (firstName) return firstName.charAt(0).toUpperCase();
    if (user.username) return user.username.charAt(0).toUpperCase();
    return "A";
  }, [user]);

  const fullName = useMemo(() => {
    if (!user) return "Admin";
    if (user.firstName && user.lastName)
      return `${user.firstName} ${user.lastName}`;
    if (user.firstName) return user.firstName;
    return user.username || "Admin";
  }, [user]);

  const checkScreenSize = useCallback(() => {
    if (typeof window === "undefined") return;
    const width = window.innerWidth;
    setIsDesktop(width >= BREAKPOINTS.DESKTOP);
    setIsMobile(width < BREAKPOINTS.MOBILE);
    setSidebarOpen(width >= BREAKPOINTS.DESKTOP);
  }, []);

  useEffect(() => {
    checkScreenSize();
    if (typeof window !== "undefined") {
      window.addEventListener("resize", checkScreenSize);
      return () => window.removeEventListener("resize", checkScreenSize);
    }
  }, [checkScreenSize]);

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
    },
    [router],
  );

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  return (
    <ErrorBoundary>
      <ProtectedRoute>
        {/* Skip to main content link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg"
        >
          Skip to main content
        </a>

        <div className="min-h-screen bg-gray-50">
          {sidebarOpen && !isDesktop && (
            <div
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setSidebarOpen(false)}
              role="button"
              tabIndex={-1}
              onKeyDown={(e) => e.key === "Escape" && setSidebarOpen(false)}
            />
          )}

          <div
            className={`fixed inset-y-0 left-0 z-50 bg-white shadow-lg flex flex-col ${isDesktop ? "w-64" : "w-80"} ${isDesktop ? "translate-x-0" : sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
          >
            <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">G</span>
                </div>
                <span className="text-2xl font-bold text-black title-regular">
                  Admin
                </span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 rounded-md text-black hover:text-black hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <Sidebar
              expandedSections={expandedSections}
              onToggleSection={toggleSection}
              onNavigate={handleNavigate}
              isMobile={isMobile}
              onClose={() => setSidebarOpen(false)}
              userPermissions={user?.permissions || []}
              userRole={user?.role}
            />

            <div className="p-4 border-t border-gray-200 flex-shrink-0">
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-3 py-2 text-base font-bold text-black hover:bg-gray-50 hover:text-black rounded-lg transition-colors custom-font"
              >
                <span className="mr-3">→</span>
                Logout
              </button>
            </div>
          </div>

          <div className={`${isDesktop ? "pl-64" : "pl-0"} w-full`}>
            <Header
              user={user}
              userInitials={userInitials}
              fullName={fullName}
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
              showBackButton={showBackButton}
              title={title}
              onLogout={handleLogout}
            />

            {isMobile && (
              <MobileQuickActions onNavigate={(id) => handleNavigate(id)} />
            )}

            <main id="main-content" className="p-4 sm:p-6">
              <div className={`max-w-7xl mx-auto `}>{children}</div>
            </main>
          </div>
        </div>
      </ProtectedRoute>
    </ErrorBoundary>
  );
}
