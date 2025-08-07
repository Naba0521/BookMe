"use client";
import { useCompanyAuth } from "@/app/_providers/CompanyAuthProvider";
import { CompanyImageCard } from "./CompanyImageCard";
import { useEffect, useState } from "react";
import { api } from "@/axios";
import { toast } from "sonner";
import { AddCompanyImage } from "./AddCompanyImage";
import { LoadingSvg } from "@/app/_components/assets/LoadingSvg";
import { useSettings } from "../_providers/CompanySettingsProvider";

export const CompanyImagesSection = () => {
  const { company } = useCompanyAuth();
  const { loading, setLoading } = useSettings();
  const [images, setImages] = useState<string[]>([]);

  const handleDeleteImage = async (index: number) => {
    setLoading(true);
    try {
      const updatedImages = [...images];
      updatedImages.splice(index, 1);
      setImages(updatedImages);

      await api.put(`/company/${company?._id}`, {
        companyImages: updatedImages,
      });

      toast.success("Зураг амжилттай устгалаа.");
    } catch (error) {
      console.error("Зураг устгахад алдаа гарлаа.", error);
      toast.error("Зураг устгахад алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (company?.companyImages) {
      setImages(company.companyImages);
    }
  }, [company?.companyImages]);

  return (
    <div className="bg-white w-full rounded-2xl p-4 flex flex-col gap-4">
      <div>
        <div className="text-[20px] font-bold">Компанийн зургууд</div>
        <div className="text-[14px] font-normal text-[#aaa]">
          Зураг засварлах хэсэг
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 justify-between items-center ">
        <AddCompanyImage />
        {loading && (
          <div className="w-[270px] h-[204px] flex items-center justify-center">
            <LoadingSvg />
          </div>
        )}
        {images.length === 0 && !loading ? (
          <div className="w-[270px] h-[204px] flex justify-center items-center border-2 rounded-2xl opacity-50">
            Компанийн зураг оруулна уу.
          </div>
        ) : (
          images.map((image, index) => (
            <div
              key={index}
              className="w-[270px] h-[204px] relative justify-center rounded-3xl border-2"
            >
              <CompanyImageCard
                image={image}
                index={index}
                newImage={null}
                id={company?._id}
                handleDeleteImage={() => handleDeleteImage(index)}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};
