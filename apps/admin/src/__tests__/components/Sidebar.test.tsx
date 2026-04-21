import { render, screen, fireEvent } from "@testing-library/react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { NAVIGATION_ITEMS } from "@/data/navigation";

jest.mock("next/navigation", () => ({
  usePathname: () => "/dashboard/orders",
}));

describe("Sidebar", () => {
  const mockProps = {
    expandedSections: ["orders"],
    onToggleSection: jest.fn(),
    onNavigate: jest.fn(),
    isMobile: false,
    onClose: jest.fn(),
    userPermissions: [],
    userRole: "ADMIN",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders navigation items", () => {
    render(<Sidebar {...mockProps} />);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Orders")).toBeInTheDocument();
    expect(screen.getByText("Products")).toBeInTheDocument();
  });

  it("shows active state for current route", () => {
    render(<Sidebar {...mockProps} />);

    const ordersButton = screen.getByText("Orders").closest("button");
    expect(ordersButton).toHaveClass("bg-sidebar-active-bg");
  });

  it("expands child items when section is expanded", () => {
    render(<Sidebar {...mockProps} expandedSections={["orders"]} />);

    expect(screen.getByText("All Orders")).toBeInTheDocument();
    expect(screen.getByText("Billing")).toBeInTheDocument();
  });

  it("calls onNavigate when clicking a nav item", () => {
    render(<Sidebar {...mockProps} />);

    const dashboardButton = screen.getByText("Dashboard").closest("button");
    if (dashboardButton) {
      fireEvent.click(dashboardButton);
      expect(mockProps.onNavigate).toHaveBeenCalledWith("dashboard");
    }
  });

  it("calls onToggleSection when clicking parent with children", () => {
    render(<Sidebar {...mockProps} />);

    const ordersButton = screen.getByText("Orders").closest("button");
    if (ordersButton) {
      fireEvent.click(ordersButton);
      expect(mockProps.onToggleSection).toHaveBeenCalledWith("orders");
    }
  });

  it("filters items based on permissions for non-admin users", () => {
    render(
      <Sidebar
        {...mockProps}
        userRole="STAFF"
        userPermissions={["orders.view"]}
      />,
    );

    expect(screen.getByText("Orders")).toBeInTheDocument();
  });
});
