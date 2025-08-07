"use client";

import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";
import { FormDataType } from "./Types";
import { FullSchemaType } from "./Schemas";
import axios from "axios";
import { useState } from "react";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUD_NAME!;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_UPLOAD_PRESET_DATA!;

type Step4Props = {
  formData: FormDataType;
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  companyImagePreview: string[];
  removeCompanyImage: (index: number) => void;
  handleLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  logoPreview: string;
  removeLogo: () => void;
};

export const Step4 = ({
  formData,
  setFormData,
  handleImageChange,
  companyImagePreview,
  removeCompanyImage,
  handleLogoChange,
  logoPreview,
  removeLogo,
}: Step4Props) => {
  const {
    setValue,
    formState: { errors },
  } = useFormContext<FullSchemaType>();

  const [bgPreview, setBgPreview] = useState(formData.backGroundImage || "");
  const [aboutPreview, setAboutPreview] = useState(formData.aboutUsImage || "");
  const [isUploading, setIsUploading] = useState(false);

  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    setIsUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("upload_preset", UPLOAD_PRESET);

      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        form
      );

      return res.data.secure_url;
    } catch (error) {
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSingleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    key: "backGroundImage" | "aboutUsImage",
    setPreview: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (isUploading) {
      alert("Өмнөх зураг хуулагдаж дуусаагүй байна. Түр хүлээнэ үү.");
      return;
    }

    const file = e.target.files?.[0];
    if (!file) return;

    const previewURL = URL.createObjectURL(file);
    setPreview(previewURL);

    const url = await uploadImageToCloudinary(file);

    setFormData((prev) => ({ ...prev, [key]: url }));
    setValue(key, url);
  };

  return (
    <>
      {/* Logo */}
      <div>
        <Label className="block mb-2 text-white">Компаний лого *</Label>
        <div className="border-2 border-dashed border-white/30 rounded-lg p-6 bg-white/5 hover:bg-white/10 transition-colors">
          {logoPreview ? (
            <div className="relative">
              <img
                src={logoPreview}
                alt="Лого"
                className="h-32 w-32 object-contain rounded mx-auto bg-white/10 p-2"
              />
              <button
                type="button"
                onClick={removeLogo}
                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="relative text-center cursor-pointer">
              <Upload className="w-8 h-8 mx-auto text-white/70 mb-2" />
              <p className="text-sm text-white/70">Лого оруулах</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          )}
        </div>
        {isUploading && (
          <div className="flex items-center gap-2 mt-2">
            <div className="h-4 w-4 rounded-full border-2 border-t-white border-white/30 animate-spin"></div>
            <p className="text-white text-sm">Зураг байршуулж байна...</p>
          </div>
        )}
        {errors.logo && (
          <p className="text-red-400 text-sm mt-1">{errors.logo.message}</p>
        )}
      </div>

      {/* Background Image */}
      <div>
        <Label className="block mb-2 text-white mt-4">
          Компаний background зураг *
        </Label>
        <div className="border-2 border-dashed border-white/30 rounded-lg p-6 bg-white/5 hover:bg-white/10">
          {bgPreview ? (
            <div className="relative">
              <img
                src={bgPreview}
                alt="Background"
                className="h-32 w-full object-contain rounded bg-white/10"
              />
              <button
                type="button"
                onClick={() => {
                  setBgPreview("");
                  setFormData((prev) => ({ ...prev, backGroundImage: "" }));
                  setValue("backGroundImage", "");
                }}
                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="relative text-center cursor-pointer">
              <Upload className="w-8 h-8 mx-auto text-white/70 mb-2 mt-2" />
              <p className="text-sm text-white/70">Зураг оруулах</p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleSingleImageUpload(e, "backGroundImage", setBgPreview)
                }
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          )}
        </div>
        {isUploading && (
          <div className="flex items-center gap-2 mt-2">
            <div className="h-4 w-4 rounded-full border-2 border-t-white border-white/30 animate-spin"></div>
            <p className="text-white text-sm">Зураг байршуулж байна...</p>
          </div>
        )}
      </div>

      {/* About Us Image */}
      <div>
        <Label className="block mb-2 text-white mt-4">
          Компаний танилцуулга зураг *
        </Label>
        <div className="border-2 border-dashed border-white/30 rounded-lg p-6 bg-white/5 hover:bg-white/10">
          {aboutPreview ? (
            <div className="relative">
              <img
                src={aboutPreview}
                alt="About Us"
                className="h-32 w-full object-contain rounded bg-white/10"
              />
              <button
                type="button"
                onClick={() => {
                  setAboutPreview("");
                  setFormData((prev) => ({ ...prev, aboutUsImage: "" }));
                  setValue("aboutUsImage", "");
                }}
                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="relative text-center cursor-pointer">
              <Upload className="w-8 h-8 mx-auto text-white/70 mb-2" />
              <p className="text-sm text-white/70">Зураг оруулах</p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleSingleImageUpload(e, "aboutUsImage", setAboutPreview)
                }
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          )}
        </div>
        {isUploading && (
          <div className="flex items-center gap-2 mt-2">
            <div className="h-4 w-4 rounded-full border-2 border-t-white border-white/30 animate-spin"></div>
            <p className="text-white text-sm">Зураг байршуулж байна...</p>
          </div>
        )}
      </div>

      {/* Multiple Images */}
      <div className="mt-8">
        <Label className="block mb-2 text-white mt-2">
          Компаний зургууд (олон зураг)
        </Label>
        <div className="border-2 border-dashed border-white/30 rounded-lg p-4 bg-white/5 hover:bg-white/10">
          {companyImagePreview.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {companyImagePreview.map((src, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={src}
                      alt={`Зураг ${index + 1}`}
                      className="h-24 w-full object-cover rounded bg-white/10"
                    />
                    <button
                      type="button"
                      onClick={() => removeCompanyImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="relative text-center cursor-pointer border-t border-white/20 pt-4">
                <Upload className="w-6 h-6 mx-auto text-white/70 mb-1 mt-2" />
                <p className="text-sm text-white/70">Нэмэлт зураг оруулах</p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
              {isUploading && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="h-4 w-4 rounded-full border-2 border-t-white border-white/30 animate-spin"></div>
                  <p className="text-white text-sm">Зураг байршуулж байна...</p>
                </div>
              )}
            </>
          ) : (
            <div className="relative text-center cursor-pointer py-8">
              <Upload className="w-8 h-8 mx-auto text-white/70 mb-2 mt-2" />
              <p className="text-sm text-white/70">Зургууд оруулах</p>
              <p className="text-xs text-white/50 mt-1">
                Олон зураг сонгож болно
              </p>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          )}
        </div>
        <p className="text-[15px] text-white mt-2">
          Компаний орчин, хамт олны зураг, хэрэглэгчдэд харуулахыг хүссэн зургаа
          оруулна уу.
        </p>
      </div>
    </>
  );
};
