import ProductPage from "@/pages/products/ProductPage";
import React from "react";
import { getDictionary } from "../../dictionaries";

export default async function Page({
  params,
}: {
  params: { lang: "en" | "az" | "ru" };
}) {
  const dict = await getDictionary(params.lang);
  return (
    <ProductPage t={typeof dict.products === "object" ? dict.products : {}} />
  );
}
