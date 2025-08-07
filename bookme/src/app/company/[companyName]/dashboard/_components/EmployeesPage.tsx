"use client";

import { useEffect, useState } from "react";
import { EmployeeAddSection } from "./EmployeeAddSection";
import { useCompanyAuth } from "@/app/_providers/CompanyAuthProvider";
import { EmployeeCard } from "./EmployeeCard";
import { EmployeeSearchSection } from "./EmployeeSearchSection";
import { Employee } from "../../_components/CompanyTypes";
import { LoadingSvg } from "@/app/_components/assets/LoadingSvg";

export function EmployeesPage() {
  const { company, getCompany } = useCompanyAuth();
  const [loading, setLoading] = useState(false);
  const [searchedEmployees, setSearchedEmployees] = useState<Employee[] | null>(
    null
  );
  const [searchValue, setSearchValue] = useState("");

  const employeesToRender =
    (searchedEmployees ?? company?.employees)?.filter(
      (employee) =>
        (typeof employee.employeeName === "string" && employee.employeeName) ??
        "".toLowerCase().includes(searchValue.toLowerCase())
    ) ?? [];
  console.log(employeesToRender);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="w-full flex items-center justify-between p-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Ажилтан засварлах
          </h2>
          <p className="text-muted-foreground">
            Энэ хэсэгт та компанийн ажилтнуудын мэдээллийг шинэчилж, өөрчлөх
            болон ажилтан устгах боломжтой.
          </p>
        </div>
        <EmployeeAddSection />
      </div>

      {/* Search */}
      <EmployeeSearchSection
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        setSearchedEmployees={setSearchedEmployees}
      />

      {/* Employee Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
        {employeesToRender
          .slice()
          .reverse()
          .map((employee) => (
            <EmployeeCard
              key={employee._id}
              employee={employee}
              getCompanyAction={getCompany}
            />
          ))}

        {employeesToRender.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground">
            {!loading ? <LoadingSvg /> : "Үр дүн олдсонгүй"}
          </div>
        )}
      </div>
    </div>
  );
}
