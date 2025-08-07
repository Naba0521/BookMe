"use client";

import { UploadCompanyLogo } from "./_components/UploadCompanyLogo";
import { CompanyBasicInformation } from "./_components/CompanyBasicInformation";
import { CompanyWorkingHours } from "./_components/CompanyWorkingHours";
import { CompanyAllEmployees } from "./_components/CompanyAllEmployees";
import { CompanyLocationGetData } from "./_components/CompanyLocationGetData";
import { CompanyImagesSection } from "./_components/CompanyImagesSection";
import { useCompanyAuth } from "@/app/_providers/CompanyAuthProvider";
import { LoadingSvg } from "@/app/_components/assets/LoadingSvg";
import { EmployeeAddSection } from "./_components/EmployeeAddSection";

export default function Home() {
  // const { company } = useCompanyAuth();

  return (
    <div className="w-full flex flex-col justify-center items-center bg-[#f7f7f7] p-4 gap-2">
      <EmployeeAddSection />
      <div className="w-full border-b-2 pt-3 "></div>
      <div className="w-[1440px] flex justify-between gap-2 ">
        <div className="flex flex-col w-[80%] gap-5">
          {/* {company && <CompanyWorkingHours company={company} />} */}
          {/* <CompanyImagesSection /> */}
          <CompanyBasicInformation />
          <CompanyAllEmployees />
          {/* <CompanyLocationGetData /> */}
        </div>
        <UploadCompanyLogo />
      </div>
    </div>
  );
}
