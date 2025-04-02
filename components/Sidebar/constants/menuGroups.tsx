import React from "react";
import ProductIcon from "../../Icons/ProductIcon";
import { useTranslations } from "next-intl";

export const useMenuGroups = () => {
  const t = useTranslations("sidebar"); 

  return [
    {
      name: t("menu"), 
      menuItems: [
        {
          icon: <ProductIcon />,
          label: t("inquiries"), 
          route: "/inquiries",
        },
        {
          icon: <ProductIcon />,
          label: t("videos"), 
          ad: t("ad"),
          route: "#",
        },
      ],
    },
  ];
};
