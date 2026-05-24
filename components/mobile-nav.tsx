"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

import {
  House,
  ClipboardList,
  Package,
  Hammer,
  User,
} from "lucide-react";

const navItems = [
  {
    label: "Home",
    href: "/",
    icon: House,
  },

  {
    label: "Tasks",
    href: "/tasks",
    icon: ClipboardList,
  },

  {
    label: "Items",
    href: "/items",
    icon: Package,
  },

  {
    label: "Hideout",
    href: "/hideout",
    icon: Hammer,
  },

  {
    label: "Profile",
    href: "/profile",
    icon: User,
  },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur">
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-3">
        {navItems.map((item) => {
          const Icon = item.icon;

          const isActive =
            pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 rounded-xl px-3 py-2 transition ${
                isActive
                  ? "text-green-400"
                  : "text-zinc-500 hover:text-white"
              }`}
            >
              <Icon size={22} />

              <span className="text-xs font-medium">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}