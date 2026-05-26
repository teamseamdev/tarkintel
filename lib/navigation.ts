import {
  House,
  ClipboardList,
  Package,
  Hammer,
  User,
} from "lucide-react";

export const navigationItems = [
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