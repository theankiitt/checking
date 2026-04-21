"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { NavItem } from "./types";

const Z_INDEX_DROPDOWN = 9999;

interface NavigationDropdownProps {
  item: NavItem;
  isActive: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function NavigationDropdown({
  item,
  isActive,
  onMouseEnter,
  onMouseLeave,
}: NavigationDropdownProps) {
  const pathname = usePathname();
  const isCurrentPath = pathname?.startsWith(item.href);

  return (
    <div
      className="relative group"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      role="none"
    >
      <Link
        href={item.href}
        className={`transition-colors whitespace-nowrap block py-2 px-4 relative ${
          isCurrentPath ? "active-link" : ""
        }`}
        aria-haspopup="true"
        aria-expanded={isActive}
      >
        <span className={isCurrentPath ? "text-white" : ""}>{item.label}</span>
        <motion.span
          className="absolute bottom-0 left-0 w-full h-0.5 bg-white block"
          initial={{ scaleX: isCurrentPath ? 1 : 0 }}
          animate={{ scaleX: isCurrentPath ? 1 : 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          style={{ transformOrigin: "left" }}
        />
      </Link>

      {isActive && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute top-full left-0 mt-2 bg-white rounded-sm shadow-2xl border border-gray-200 text-black font-normal overflow-visible"
          style={{
            width: "max-content",
            maxWidth: "600px",
            minWidth: "400px",
            maxHeight: "none",
            zIndex: Z_INDEX_DROPDOWN,
          }}
          role="menu"
        >
          <div className="p-6 overflow-visible" style={{ maxHeight: "none" }}>
            <div className="flex gap-10 overflow-visible">
              {item.columns?.map((column, idx) => (
                <div key={idx} className="flex-1 min-w-[200px]">
                  <h3 className="text-gray-900 mb-4 text-lg font-semibold pb-2 no-underline">
                    {column.title}
                  </h3>
                  <div className="space-y-3">
                    {column.groups?.map((group, grpIdx) => (
                      <div key={grpIdx}>
                        <h4 className="text-gray-700 text-base mb-2 font-medium no-underline">
                          {group.title}
                        </h4>
                        <div className="space-y-1 ml-2">
                          {group.items.map((subItem, subIdx) => (
                            <Link
                              key={subIdx}
                              href={subItem.href}
                              className="block text-base text-black hover:text-orange-600 py-1 transition-colors no-underline"
                              role="menuitem"
                            >
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                    {column.items?.map((subItem, subIdx) => (
                      <Link
                        key={subIdx}
                        href={subItem.href}
                        className="block text-base text-black hover:text-orange-600 py-1 transition-colors no-underline"
                        role="menuitem"
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
