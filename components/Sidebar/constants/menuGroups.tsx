// components/Sidebar/constants/menuGroups.ts
import React from "react";
import { SidebarTranslationsType } from "@/shared/types/Sidebar";
import DashBoardIcon from "../../Icons/DashBoardIcon";
import ProductIcon from "../../Icons/ProductIcon";

export const getMenuGroups = (translations: SidebarTranslationsType) => [
  {
    name: "MENU",
    menuItems: [
      {
        icon: <DashBoardIcon />,
        label: translations.dashboard,
        route: "/statistics",
      },
      {
        icon: <ProductIcon />,
        label: translations.inquiries,
        route: "/inquiries",
      },
      {
        icon: <ProductIcon />,
        label: translations.videos,
        ad: translations?.ad,
        route: "#",
      },
    ],
  },
];
