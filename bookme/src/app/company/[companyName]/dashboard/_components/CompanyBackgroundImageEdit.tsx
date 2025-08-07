"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSettings } from "../_providers/CompanySettingsProvider";
import { useCompanyAuth } from "@/app/_providers/CompanyAuthProvider";
import { api } from "@/axios";
import { toast } from "sonner";
import { LoadingSvg } from "@/app/_components/assets/LoadingSvg";
import { ImageSVG } from "./assets/ImageSVG";
import { Input } from "@/components/ui/input";

export const CompanyBackgroundImageEdit = () => {
  const { company, getCompany } = useCompanyAuth();
  const { bgLoading, setBgLoading, handleInputBackgroundImage } = useSettings();

  const handleDeleteBackground = async () => {
    setBgLoading(true);
    try {
      const req = await api.put(`/company/${company?._id}`, {
        backGroundImage: null,
      });
      getCompany();
      toast.success("Зураг амжилттай устгалаа.");
    } catch (error) {
      console.error("Зураг устгахад алдаа гарлаа.", error);
      toast.error("Зураг устгахад алдаа гарлаа.");
    } finally {
      setBgLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Арын зураг</CardTitle>
        <CardDescription>
          Компанийн арын зураг шинэчлэх (хэмжээ: 300x300px)
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="w-full h-fit flex items-center py-3">
          <div className="relative w-[500px] h-[500px]">
            {bgLoading ? (
              <div className="flex w-[500px] h-[500px] items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50">
                <LoadingSvg />
              </div>
            ) : !company?.backGroundImage ? (
              <div className="flex w-[500px] h-[500px] items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50">
                <ImageSVG />
              </div>
            ) : (
              <div className="relative w-full h-full">
                <img
                  src={`${company?.backGroundImage}`}
                  alt="Company Logo"
                  className="w-full h-full rounded-2xl object-cover"
                />
                <Button
                  className="absolute right-2 top-2 rounded-full bg-white hover:bg-black hover:text-white text-black w-6 h-6 text-xs cursor-pointer"
                  onClick={handleDeleteBackground}
                >
                  x
                </Button>
              </div>
            )}
          </div>
        </div>
        <div className="space-y-2 relative">
          <div>
            <Button
              variant="outline"
              className="border-[#007FFF] text-[#007FFF] hover:bg-[#007FFF]/10 hover:text-[#007FFF]"
            >
              <Upload className="mr-2 h-4 w-4" />
              Зураг оруулах
            </Button>
          </div>
          <div className="w-[141px] absolute top-0 opacity-0">
            <Input
              type="file"
              className="w-full cursor-pointer"
              onChange={handleInputBackgroundImage}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
