// app/[lang]/layout.tsx
"use client";
import React from "react";
import DefaultLayout from "@/components/Layout/DefaultLayout";
import AuthWrapper from "@/components/Auth/AuthWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthWrapper>
      <DefaultLayout>{children}</DefaultLayout>
    </AuthWrapper>
  );
}
