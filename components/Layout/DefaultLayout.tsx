"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Translations } from "@/shared/types/Dictionary";
import Header from "../Header";

interface DefaultLayoutProps {
  children: React.ReactNode;
  dict: Translations;
}

const Sidebar = dynamic(() => import("@/components/Sidebar"), {
  ssr: false,
});

export default function DefaultLayout({ children, dict }: DefaultLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <div className="flex">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          t={dict?.sidebar ?? {}}
        />
        <div className="relative flex flex-1 flex-col lg:ml-72.5">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
