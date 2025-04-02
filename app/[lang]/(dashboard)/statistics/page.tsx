import dynamic from "next/dynamic";
import React from "react";
const DashBoardPage = dynamic(() => import("@/container/dashboard/DashBoardPage"), {
  ssr: false,
});
const page = () => {
  return <DashBoardPage />;
};

export default page;
