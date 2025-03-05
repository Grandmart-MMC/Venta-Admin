import InquiriesPage from "@/pages/inquiries/InquiriesPage";
import React from "react";
import { getDictionary } from "../../dictionaries";


const Page =async({params}:{params: { lang: "en" | "az" | "ru" }}) => {
    const dict = await getDictionary(params.lang);
  return (

      <InquiriesPage t={dict?.inquiries ?? {}} />
 
  );
};

export default Page;
