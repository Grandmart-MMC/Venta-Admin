import React from "react";
import LoginPage from "@/pages/login/LoginPage";
import { getDictionary } from "./dictionaries";

export default async function Page({
  params,
}: {
  params: { lang: "en" | "az" | "ru" };
}) {
  const dict = await getDictionary(params.lang);
  return <LoginPage t={dict.login} />;
}
