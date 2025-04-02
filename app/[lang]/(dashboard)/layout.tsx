// app/[lang]/layout.tsx
import React from "react";
import DefaultLayout from "@/components/Layout/DefaultLayout";


export default async function RootLayout({
  children,

}: Readonly<{
  children: React.ReactNode;

}>) {

  return <DefaultLayout>{children}</DefaultLayout>;
}
