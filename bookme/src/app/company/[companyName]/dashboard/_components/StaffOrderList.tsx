"use client";

import { Users } from "lucide-react";
import { Company, Employee } from "../../_components/CompanyTypes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type StaffOrdersListProps = {
  company: Company;
  selectedEmployee: Employee | null;
  onEmployeeSelect: (employee: Employee) => void;
  getEmployeeBookings: (employeeId: string) => any[];
};

export function StaffOrdersList({
  company,
  selectedEmployee,
  onEmployeeSelect,
  getEmployeeBookings,
}: StaffOrdersListProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Ажилтнууд</h2>
        <p className="text-sm text-gray-500 mt-1">
          Ажилтан дээр дарж тухайн ажилтны захиалгуудыг календар дээр харах
        </p>
      </div>
      <div className="p-6">
        <div className="flex flex-wrap gap-3">
          {company.employees?.map((employee) => (
            <Button
              key={employee._id}
              variant={
                selectedEmployee?._id === employee._id ? "default" : "outline"
              }
              onClick={() => onEmployeeSelect(employee)}
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              {employee.employeeName}
              <Badge variant="secondary" className="ml-1">
                {getEmployeeBookings(employee._id).length}
              </Badge>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
