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
  onShowAll?: () => void;
};

export function StaffOrdersList({
  company,
  selectedEmployee,
  onEmployeeSelect,
  getEmployeeBookings,
  onShowAll,
}: StaffOrdersListProps) {
  return (
    <div className="overflow-hidden bg-white border border-gray-200/60 shadow-xl rounded-2xl">
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-50 to-gray-50 border-b border-gray-200/60">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5"></div>
        <div className="relative p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-slate-600 to-gray-700 rounded-xl shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Ажилтнууд</h2>
                <p className="mt-1 text-sm text-gray-600">
                  Ажилтан дээр дарж тухайн ажилтны захиалгуудыг календар дээр
                  харах
                </p>
              </div>
            </div>
            {onShowAll && (
              <Button
                variant="outline"
                onClick={onShowAll}
                className="flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm border-gray-300 hover:bg-white hover:border-gray-400 transition-all duration-200 shadow-sm"
              >
                <Users className="w-4 h-4" />
                Бүх захиалга
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="p-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {company.employees?.map((employee) => {
            const bookingCount = getEmployeeBookings(employee._id).length;
            const isSelected = selectedEmployee?._id === employee._id;

            return (
              <div
                key={employee._id}
                onClick={() => onEmployeeSelect(employee)}
                className={`group relative overflow-hidden rounded-xl border-2 transition-all duration-300 cursor-pointer hover:shadow-lg hover:-translate-y-1 ${
                  isSelected
                    ? "border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-lg shadow-md ${
                          isSelected
                            ? "bg-gradient-to-br from-blue-500 to-indigo-500"
                            : "bg-gradient-to-br from-gray-500 to-gray-600"
                        }`}
                      >
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {employee.employeeName}
                        </h3>
                        <p className="text-xs text-gray-500">Ажилтан</p>
                      </div>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        isSelected
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {bookingCount} захиалга
                    </div>
                  </div>

                  {employee.startTime && employee.endTime && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Ажлын цаг:</span>
                        <span className="font-medium text-gray-900">
                          {employee.startTime} - {employee.endTime}
                        </span>
                      </div>
                      {employee.lunchTimeStart && employee.lunchTimeEnd && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Цайны цаг:</span>
                          <span className="font-medium text-gray-900">
                            {employee.lunchTimeStart} - {employee.lunchTimeEnd}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {isSelected && (
                    <div className="mt-4 flex items-center space-x-2 text-blue-600">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">Сонгогдсон</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
