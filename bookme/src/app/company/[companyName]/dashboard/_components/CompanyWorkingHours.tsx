"use client";
import { api } from "@/axios";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Company, WorkingHoursType } from "../../_components/CompanyTypes";
import { Switch } from "@/components/ui/switch";
import { Label } from "@radix-ui/react-dropdown-menu";
import { MoonSvg } from "./assets/MoonSvg";
import { CompanyWorkingHoursChange } from "./CompanyWorkingHoursChange";

const dayLabels: Record<keyof WorkingHoursType, string> = {
  monday: "Даваа",
  tuesday: "Мягмар",
  wednesday: "Лхагва",
  thursday: "Пүрэв",
  friday: "Баасан",
  saturday: "Бямба",
  sunday: "Ням",
};

type PropsType = {
  company: Company;
};

export const CompanyWorkingHours = ({ company }: PropsType) => {
  const [loadingDay, setLoadingDay] = useState<string | null>(null);

  const [changedTimeSchedule, setChangedTimeSchedule] = useState(
    company.workingHours
  );
  console.log(company.workingHours);

  return (
    <div className="w-full h-fit rounded-2xl p-3">
      <div className="flex flex-col p-3">
        <div className="text-[20px] font-bold">Ажлын цаг</div>
        <div className="text-[14px] font-normal text-[#aaa]">
          Ажлын өдрийн төлөв өөрчлөх хэсэг.
        </div>
      </div>
      <div className="flex flex-wrap gap-10">
        {changedTimeSchedule &&
          Object.entries(changedTimeSchedule)
            .filter(([key]) => key !== "_id")
            .map(([day, data]) => (
              <div
                key={day}
                className="w-full flex justify-between gap-3 p-3 border-1 rounded-2xl shadow-md hover:shadow-lg"
              >
                <div className="flex items-center space-x-2">
                  <Switch
                    className="cursor-pointer"
                    id={`switch-${day}`}
                    checked={!data.closed}
                    onCheckedChange={async (isChecked) => {
                      const updatedClosed = !isChecked;

                      setChangedTimeSchedule((prev) => ({
                        ...prev!,
                        [day]: {
                          ...prev?.[day as keyof WorkingHoursType],
                          closed: updatedClosed,
                        },
                      }));

                      try {
                        setLoadingDay(day);
                        await api.put(`company/${company._id}`, {
                          workingHours: {
                            ...changedTimeSchedule,
                            [day]: {
                              ...changedTimeSchedule?.[
                                day as keyof WorkingHoursType
                              ],
                              closed: updatedClosed,
                            },
                          },
                        });
                        toast.success(
                          `${
                            dayLabels[day as keyof WorkingHoursType]
                          } гараг өөрчлөгдлөө`
                        );
                      } catch (error) {
                        console.error("Хүсэлт илгээхэд алдаа:", error);
                        toast.error("Сервертэй холбогдоход алдаа гарлаа.");
                      } finally {
                        setLoadingDay(null);
                      }
                    }}
                  />
                  <Label> {dayLabels[day as keyof WorkingHoursType]}</Label>
                </div>

                {data.closed ? (
                  <div className="flex items-center pl-2 gap-3 w-[640px] h-[44px] bg-gray-100 rounded-[7px]">
                    <div className="opacity-50">
                      <MoonSvg />
                    </div>
                    <div className="opacity-50">Хаалттай</div>
                  </div>
                ) : (
                  <CompanyWorkingHoursChange
                    day={day as keyof WorkingHoursType}
                    data={data}
                    changedTimeSchedule={changedTimeSchedule}
                  />
                )}
              </div>
            ))}
      </div>
    </div>
  );
};
