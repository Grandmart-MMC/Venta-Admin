// app/[lang]/layout.tsx
import React from "react";
import DefaultLayout from "@/components/Layout/DefaultLayout";
import { getDictionary } from "../dictionaries";

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { lang: "en" | "az" | "ru" };
}>) {
  const dict = await getDictionary(params.lang);

  return <DefaultLayout dict={dict}>{children}</DefaultLayout>;
}
