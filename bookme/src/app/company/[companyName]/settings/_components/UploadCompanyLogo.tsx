"use client";
import { ImageSVG } from "./assets/ImageSVG";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CompanyStatus } from "./CompanyStatus";
import { useSettings } from "../_providers/CompanySettingsProvider";
import { useCompanyAuth } from "@/app/_providers/CompanyAuthProvider";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { api } from "@/axios";
import { toast } from "sonner";
import { ClickSVG } from "./assets/ClickSVG";
export const UploadCompanyLogo = () => {
  const { company } = useCompanyAuth();
  const { companyLogo, companyLogoTest, handleInputCompanyLogo } =
    useSettings();

  const handleUploadNewLogo = async () => {
    try {
      const data = await api.put(`/company/${company?._id}`, {
        companyLogo: companyLogo,
      });
      toast.success("Компанийн лого амжилттай солигдлоо.");
    } catch (error) {
      console.error("Компанийн лого шинэчилэхэд алдаа гарлаа.");
      toast.error("Компанийн лого шинэчилэхэд алдаа гарлаа.");
    }
  };

  if (!company) return null;

  return (
    <div className="rounded-2xl w-[20%] h-fit flex flex-col gap-5 ">
      <div className="w-full h-full bg-white rounded-2xl p-4">
        <div className="text-[20px] font-bold">Business logo</div>
        <div className="w-full h-fit flex justify-center p-4">
          <div className="w-[100px] h-[100px] rounded-2xl  bg-[#e4e4e4] overflow-hidden">
            {company.companyLogo || companyLogoTest ? (
              <div className="relative flex items-center justify-center w-full h-full">
                <div className="absolute">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <img
                        src={companyLogoTest ?? company.companyLogo}
                        alt="Company Logo Preview"
                        className="w-full h-full object-cover cursor-pointer"
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="flex gap-1 items-center">
                        <ClickSVG />
                        <p>Click to change logo</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Input
                  className="flex w-full h-full opacity-0 z-10 absolute cursor-pointer"
                  type="file"
                  onChange={handleInputCompanyLogo}
                />
              </div>
            ) : (
              <div className="w-full h-full flex flex-col justify-center items-center relative">
                <div className="absolute">
                  <ImageSVG />
                </div>
                <Input
                  className="w-full h-full opacity-0 cursor-pointer"
                  type="file"
                  onChange={handleInputCompanyLogo}
                />
              </div>
            )}
          </div>
        </div>
        <div className="w-full">
          <Button
            className="w-full"
            variant={"outline"}
            onClick={handleUploadNewLogo}
          >
            Лого шинэчлэх
          </Button>
        </div>
      </div>

      <CompanyStatus employeeCount={company.employees.length ?? 0} />
    </div>
  );
};
