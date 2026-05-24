"use client";

import Link from "next/link";
import {
  Home,
  ClipboardList,
  Boxes,
  Hammer,
  User,
} from "lucide-react";

import { usePathname } from "next/navigation";

const links = [
  {
    href: "/",
    icon: Home,
    label: "Home",
  },
  {
    href: "/tasks",
    icon: ClipboardList,
    label: "Tasks",
  },
  {
    href: "/items",
    icon: Boxes,
    label: "Items",
  },
  {
    href: "/hideout",
    icon: Hammer,
    label: "Hideout",
  },
  {
    href: "/profile",
    icon: User,
    label: "Profile",
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-zinc-800 bg-[#0B0F14]/95 backdrop-blur-md">
      <div className="flex items-center justify-around py-3">
        {links.map((link) => {
          const Icon = link.icon;

          const active = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-1 text-xs transition-colors ${
                active
                  ? "text-green-400"
                  : "text-zinc-500"
              }`}
            >
              <Icon size={20} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}