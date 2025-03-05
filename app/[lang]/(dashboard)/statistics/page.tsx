import dynamic from "next/dynamic";
import React from "react";
const DashBoardPage = dynamic(() => import("@/pages/dashboard/DashBoardPage"), {
  ssr: false,
});
const page = () => {
  return <DashBoardPage />;
};

export default page;
