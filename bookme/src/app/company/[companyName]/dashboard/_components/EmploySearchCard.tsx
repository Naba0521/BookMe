"use client";

import { Users } from "lucide-react";
import { Employee } from "../../_components/CompanyTypes";
import { Dispatch, SetStateAction } from "react";

interface Props {
  employ: Employee;
}
export const EmploySearchCard = ({ employ }: Props) => {
  return (
    <div className="w-full  rounded-2xl">
      <div className="flex items-center text-gray-500 gap-5 w-full hover:bg-white hover:text-black rounded-2xl hover:shadow-2xl p-2 cursor-pointer">
        <Users className="h-4 w-4 text-muted-foreground" />
        <div className="flex items-center gap-1">
          <div
            className="p-1 w-[5px] h-[5px] rounded-full"
            style={{
              backgroundColor: employ.availability ? "#00c04b" : "#ff0000",
              animation: "pulse 3s infinite",
            }}
          ></div>
          <div className="text-[15px]"> {employ.employeeName}</div>
        </div>
      </div>
    </div>
  );
};
