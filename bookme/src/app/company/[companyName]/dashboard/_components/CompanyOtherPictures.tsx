"use client";
import { useCompanyAuth } from "@/app/_providers/CompanyAuthProvider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Upload } from "lucide-react";
import { useSettings } from "../_providers/CompanySettingsProvider";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "@/axios";
import { CompanyImageCard } from "./CompanyImageCard";
import { LoadingSvg } from "@/app/_components/assets/LoadingSvg";
import { Input } from "@/components/ui/input";
export const CompanyOtherPictures = () => {
  const { company, getCompany } = useCompanyAuth();
  const { otherImgLoading, setOtherImgLoading } = useSettings();
  const [images, setImages] = useState<string[]>([]);
  const { handleInputCompanyImage } = useSettings();

  const handleDeleteImage = async (index: number) => {
    setOtherImgLoading(true);
    try {
      const updatedImages = [...images];
      updatedImages.splice(index, 1);
      setImages(updatedImages);

      await api.put(`/company/${company?._id}`, {
        companyImages: updatedImages,
      });
       getCompany();
      toast.success("Зураг амжилттай устгалаа.");
    } catch (error) {
      console.error("Зураг устгахад алдаа гарлаа.", error);
      toast.error("Зураг устгахад алдаа гарлаа.");
    } finally {
      setOtherImgLoading(false);
    }
  };

  useEffect(() => {
    if (company?.companyImages) {
      setImages(company.companyImages);
    }
  }, [company?.companyImages]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Нүүр зураг</CardTitle>
        <CardDescription>Компанийн нүүр зургууд</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-5 ">
            <div className="w-[200px] h-[200px] flex relative aspect-video items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50">
              <Button
                variant="outline"
                className="border-[#007FFF] text-[#007FFF] hover:bg-[#007FFF]/10 "
              >
                <Upload className="mr-2 h-4 w-4" />
                Зураг нэмэх
              </Button>

              <Input
                type="file"
                className="absolute w-full h-full top-0 opacity-0 cursor-pointer"
                onChange={handleInputCompanyImage}
              />
            </div>
            {otherImgLoading && (
              <div className="w-[200px] h-[200px] flex items-center justify-center rounded-3xl border-2">
                <LoadingSvg />
              </div>
            )}
            {company?.companyImages.map((image, index) => (
              <div
                key={index}
                className="w-[200px] h-[200px] flex items-center"
              >
                <CompanyImageCard
                  image={image}
                  index={index}
                  newImage={null}
                  id={company?._id}
                  handleDeleteImage={() => handleDeleteImage(index)}
                />
              </div>
            ))}

          </div>
        </div>
      </CardContent>
    </Card>
  );
};
