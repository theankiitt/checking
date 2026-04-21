import NavbarClient from "./NavbarClient";
import { getNavigationItems } from "@/utils/navigation";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function Navbar() {
  const navigationItems = await getNavigationItems();

  return (
    <Suspense fallback={null}>
      <NavbarClient navigationItems={navigationItems} />
    </Suspense>
  );
}
