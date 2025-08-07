"use client";
import { Input } from "@/components/ui/input";
import { WorkingHoursType } from "../../_components/CompanyTypes";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { api } from "@/axios";
import { useCompanyAuth } from "@/app/_providers/CompanyAuthProvider";
import { toast } from "sonner";
import { LoadingSvg } from "@/app/_components/assets/LoadingSvg";

type Props = {
  day: keyof WorkingHoursType;
  data: WorkingHoursType[keyof WorkingHoursType];
  changedTimeSchedule: WorkingHoursType;
};

export const CompanyWorkingHoursChange = ({
  day,
  data,
  changedTimeSchedule,
}: Props) => {
  const { company } = useCompanyAuth();
  const [loading, setLoading] = useState(false);
  const [updatedData, setUpdatedData] =
    useState<WorkingHoursType>(changedTimeSchedule);

  const updatedHours = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "open" | "close"
  ) => {
    const value = e.target.value;
    if (!updatedData) return;
    setUpdatedData((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  const handleChangeData = async () => {
    setLoading(true);
    try {
      const res = await api.put(`/company/${company?._id}`, {
        workingHours: updatedData,
      });
      toast.success("Ажлын цаг амжилттай шинэчлэгдлээ.");
      console.log(res);
    } catch (error) {
      console.log("Ажлын цаг шинэчилэхэд алдаа гарлаа.");
      toast.error("Ажлын цаг шинэчилэхэд алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-10 w-[640px] items-center">
      <div className="w-[300px] flex items-center gap-3 relative">
        <div className="absolute w-fit ml-4">Нээх цаг</div>
        <Input
          id={`${day}`}
          className="flex justify-end border-2 p-5 rounded-[7px] cursor-pointer"
          type="time"
          defaultValue={data.open}
          onChange={(e) => updatedHours(e, "open")}
        />
      </div>
      <div className="w-[300px] flex items-center gap-3 relative">
        <div className="absolute w-fit ml-4">Хаах цаг</div>
        <Input
          id={`${day}`}
          className="flex justify-end border-2 p-5 rounded-[7px] cursor-pointer"
          type="time"
          defaultValue={data.close}
          onChange={(e) => updatedHours(e, "close")}
        />
      </div>
      <Button
        className="bg-blue-500 hover:bg-blue-400 cursor-pointer shadow-2xl"
        onClick={handleChangeData}
      >
        {loading ? <LoadingSvg /> : "Хадгалах"}
      </Button>
    </div>
  );
};
