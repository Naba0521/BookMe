"use client";
import { EmployeeType } from "../_providers/CompanySettingsProvider";
import { EmployeeEditCard } from "./EmployeeEditCard";

type PropsType = {
  companyEmployees: EmployeeType[];
};

export const EmployeeEditForm = ({ companyEmployees }: PropsType) => {
  return (
    <div className="flex flex-col gap-3 ">
      {companyEmployees.map((employee, i) => {
        return (
          <div key={employee._id}>
            <EmployeeEditCard employee={employee} employeeIndex={i} />
          </div>
        );
      })}
    </div>
  );
};
