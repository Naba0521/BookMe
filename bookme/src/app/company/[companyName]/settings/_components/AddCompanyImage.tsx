"use client";
import { Input } from "@/components/ui/input";
import { useSettings } from "../_providers/CompanySettingsProvider";
import { useState } from "react";
import { LoadingSvg } from "@/app/_components/assets/LoadingSvg";

export const AddCompanyImage = () => {
  const { handleInputCompanyImage } = useSettings();

  return (
    <div className="relative w-[270px] h-[204px]">
      <div className="w-full h-full rounded-3xl relative flex flex-col items-center justify-center">
        <div className="w-full h-full rounded-3xl flex flex-col items-center justify-center absolute top-0 border-2">
          <div className="flex flex-col items-center">
            <span>Зураг нэмэх</span>
            <span>+</span>
          </div>
        </div>
      </div>
      <Input
        type="file"
        className="absolute w-full h-full top-0 opacity-0"
        onChange={handleInputCompanyImage}
      />
    </div>
  );
};
