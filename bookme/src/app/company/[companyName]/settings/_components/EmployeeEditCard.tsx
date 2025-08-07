"use client";
import { useState } from "react";
import { EmployeeType } from "../_providers/CompanySettingsProvider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PenSvg } from "./assets/PenSvg";
import { api } from "@/axios";
import { toast } from "sonner";
import { LoadingSvg } from "@/app/_components/assets/LoadingSvg";

type Props = {
  employee: EmployeeType;
  employeeIndex: number;
};
export const EmployeeEditCard = ({ employee, employeeIndex }: Props) => {
  const [edit, setEdit] = useState(true);
  const [loading, setLoading] = useState(false);
  const [newData, setNewData] = useState({
    employeeName: employee.employeeName,
    description: employee.description,
  });

  const handleChangeEmployeeData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setNewData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveData = async () => {
    setLoading(true);
    try {
      const request = await api.put(`/employee/${employee._id}`, {
        employeeName: newData.employeeName,
        description: newData.description,
      });
      toast.success("Ажилтны мэдээлэл амжилттай солигдлоо.");
    } catch (error) {
      console.error(error, "Ажилтны мэдээлэл хадгалахад алдаа гарлаа.");
      toast.error("Ажилтны мэдээлэл хадгалахад алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-5 items-end w-full h-fit border-[1px] rounded-2xl p-3 ">
      <div className="flex flex-col items-center gap-2">
        <div>№</div>
        <div>{employeeIndex + 1}</div>
      </div>
      <div className="flex flex-col items-center  gap-2">
        <div>Ажилтны нэр</div>
        <div className="w-full ">
          <Input
            name="employeeName"
            onChange={handleChangeEmployeeData}
            disabled={edit}
            value={newData.employeeName}
          />
        </div>
      </div>
      <div className="flex flex-col items-center  gap-2 ">
        <div>Нэмэлт мэдээлэл</div>
        <div className="w-[200px]  overflow-hidden">
          <Input
            name="description"
            onChange={handleChangeEmployeeData}
            disabled={edit}
            value={newData.description}
          />
        </div>
      </div>

      <Button variant={"outline"} onClick={() => setEdit(!edit)}>
        Засах
      </Button>

      {!edit && (
        <Button onClick={handleSaveData}>
          {loading ? <LoadingSvg /> : "Хадгалах"}
        </Button>
      )}
    </div>
  );
};
