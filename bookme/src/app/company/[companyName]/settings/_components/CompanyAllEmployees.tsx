"use client";
import { useParams } from "next/navigation";
import {
  EmployeeType,
  useSettings,
} from "../_providers/CompanySettingsProvider";
import { useEffect, useState } from "react";
import { EmployeeCard } from "./EmployeeCard";
import { Button } from "@/components/ui/button";
import { EmployeeEditForm } from "./EmployeeEditForm";

export const CompanyAllEmployees = () => {
  const { companyData } = useSettings();
  const { companyName } = useParams();
  const [companyEmployees, setCompanyEmployees] = useState<EmployeeType[]>([]);
  const [selectedTab, setSelectedtab] = useState<
    "Ажилтнууд" | "Ажилтан засварлах"
  >("Ажилтнууд");

  useEffect(() => {
    if (!companyData || companyData.length === 0) return;

    const foundCompany = companyData.find(
      (company) => company.companyName === companyName
    );
    if (foundCompany) {
      setCompanyEmployees(foundCompany?.employees);
    }
  }, [companyData, companyName, companyEmployees]);

  return (
    <div className="w-full h-fit rounded-2xl p-4 flex flex-col gap-4 bg-white">
      <div className="flex flex-col gap-3">
        <div className="text-[20px] font-bold">Ажилтнуудын мэдээлэл</div>
        <div className="w-full flex gap-4">
          <Button
            variant={selectedTab === "Ажилтнууд" ? "default" : "outline"}
            className="text-[14px] font-normal w-fit"
            onClick={() => setSelectedtab("Ажилтнууд")}
          >
            Ажилтнууд
          </Button>
          <Button
            variant={
              selectedTab === "Ажилтан засварлах" ? "default" : "outline"
            }
            className="text-[14px] font-normal w-fit"
            onClick={() => setSelectedtab("Ажилтан засварлах")}
          >
            Ажилтан засварлах
          </Button>
        </div>
      </div>
      <div>
        {selectedTab === "Ажилтнууд" && (
          <div className="grid grid-cols-3 gap-3">
            {companyEmployees.length === 0 && (
              <p className="opacity-50 ">Ажилтны мэдээлэл хоосон байна.</p>
            )}
            {companyEmployees.map((employ, i) => (
              <div key={i}>
                <EmployeeCard
                  _id={employ._id}
                  employeeName={employ.employeeName}
                  description={employ.description}
                  profileImage={employ.profileImage}
                />
              </div>
            ))}
          </div>
        )}

        {selectedTab === "Ажилтан засварлах" && (
          <div>
            <EmployeeEditForm companyEmployees={companyEmployees} />
          </div>
        )}
      </div>
    </div>
  );
};
