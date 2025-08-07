"use client";
import { Button } from "@/components/ui/button";
import { Employee } from "@/app/signup/_components/Types";
import { useCompanyAuth } from "@/app/_providers/CompanyAuthProvider";
import { useState } from "react";
import { tr } from "date-fns/locale";
import { api } from "@/axios";
import { toast } from "sonner";
import { UpdatedData } from "./EmployeeCard";
import { LoadingSvg } from "@/app/_components/assets/LoadingSvg";
interface Props {
  updatedEmployee: UpdatedData;
  employeeId: string;
  employeeName: string;
}

export const EmployeeEditButton = ({
  updatedEmployee,
  employeeId,
  employeeName,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const { getCompany } = useCompanyAuth();

  const handleEditEmployeeData = async () => {
    setLoading(true);
    try {
      const req = await api.put(`/employee/${employeeId}`, {
        profileImage: updatedEmployee.profileImage,
        startTime: updatedEmployee.startTime,
        endTime: updatedEmployee.endTime,
        lunchTimeStart: updatedEmployee.lunchTimeStart,
        lunchTimeEnd: updatedEmployee.lunchTimeEnd,
        description: updatedEmployee.description,
      });

      toast.success(`${employeeName} ажилтны мэдээлэл шинэчлэгдлээ.`);
      await getCompany();
    } catch (error) {
      console.error(`${employeeName}-н мэдээллийг шинэчлэхэд алдаа гарлаа.`);
      toast.error(`${employeeName}-н мэдээллийг шинэчлэхэд алдаа гарлаа.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      className="text-gray-700"
      variant={"outline"}
      onClick={handleEditEmployeeData}
    >
      {!loading ? "Ажилтны мэдээлэл шинэчлэх" : <LoadingSvg />}
    </Button>
  );
};
