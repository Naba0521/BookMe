"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { EmployeeForm } from "./EmployeeForm";

export type FormDataType = {
  employeeData: EmployeeData;
  setEmployeeData: React.Dispatch<React.SetStateAction<EmployeeData>>;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};
export type EmployeeData = {
  companyName: string;
  startTime: string;
  endTime: string;
  lunchTimeStart: string;
  lunchTimeEnd: string;
  employeeName: string;
  description: string;
  profileImage: string;
  duration: string;
  workingHours: string;
  availability: boolean;
};

export const EmployeeAddSection = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [employeeData, setEmployeeData] = useState<EmployeeData>({
    companyName: "",
    startTime: "09:00",
    endTime: "18:00",
    lunchTimeStart: "12:00",
    lunchTimeEnd: "13:00",
    employeeName: "",
    description: "",
    profileImage: "",
    duration: "",
    workingHours: "",
    availability: true,
  });

  return (
    <div className="flex justify-between items-center p-4">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="bg-[#007FFF] hover:bg-[#007FFF]/90 ">
            + Ажилтан нэмэх
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-white w-[600px]">
          <DialogHeader>
            <DialogTitle>Ажилтан шинээр бүртгэх</DialogTitle>
          </DialogHeader>
          <EmployeeForm
            employeeData={employeeData}
            setEmployeeData={setEmployeeData}
            setIsOpen={setIsOpen}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
