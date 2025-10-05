"use client";

import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Upload, X, Image as ImageIcon, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { FormDataType } from "./Types";
import { FullSchemaType } from "./Schemas";
import axios from "axios";
import { useState, useCallback, useRef } from "react";

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

// File validation constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_COMPANY_IMAGES = 10;

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
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState<{[key: string]: boolean}>({});

  // File validation function
  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return "Зөвхөн JPG, PNG, WebP форматын зургууд зөвшөөрөгдөнө";
    }
    if (file.size > MAX_FILE_SIZE) {
      return "Файлын хэмжээ 5MB-аас бага байх ёстой";
    }
    return null;
  };

  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);
    
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("upload_preset", UPLOAD_PRESET);

      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        form,
        {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1)
            );
            setUploadProgress(percentCompleted);
          },
        }
      );

      return res.data.secure_url;
    } catch (error) {
      setUploadError("Зураг байршуулахад алдаа гарлаа. Дахин оролдоно уу.");
      throw error;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Drag & drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent, type: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(prev => ({ ...prev, [type]: true }));
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent, type: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(prev => ({ ...prev, [type]: false }));
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(async (
    e: React.DragEvent, 
    type: string,
    handler: (file: File) => void
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(prev => ({ ...prev, [type]: false }));

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      const validationError = validateFile(file);
      if (validationError) {
        setUploadError(validationError);
        return;
      }
      handler(file);
    }
  }, []);

  const handleSingleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    key: "backGroundImage" | "aboutUsImage",
    setPreview: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (isUploading) {
      setUploadError("Өмнөх зураг хуулагдаж дуусаагүй байна. Түр хүлээнэ үү.");
      return;
    }

    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setUploadError(validationError);
      return;
    }

    const previewURL = URL.createObjectURL(file);
    setPreview(previewURL);

    try {
      const url = await uploadImageToCloudinary(file);
      setFormData((prev) => ({ ...prev, [key]: url }));
      setValue(key, url);
    } catch (error) {
      setPreview("");
      setUploadError("Зураг байршуулахад алдаа гарлаа.");
    }
  };

  return (
    <>
      {/* Logo */}
      <div>
        <Label className="block mb-2 text-white font-medium">Компаний лого *</Label>
        <p className="text-xs text-white/60 mb-3">Лого зурагаа сонгоно уу</p>
        <div 
          className={`border-2 border-dashed rounded-lg p-6 transition-all duration-200 ${
            dragActive.logo 
              ? "border-blue-400 bg-blue-500/10" 
              : "border-white/30 bg-white/5 hover:bg-white/10"
          }`}
          onDragEnter={(e) => handleDragEnter(e, 'logo')}
          onDragLeave={(e) => handleDragLeave(e, 'logo')}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'logo', (file) => {
            const input = document.createElement('input');
            input.type = 'file';
            const fileList = {
              0: file,
              length: 1,
              item: (index: number) => index === 0 ? file : null,
              [Symbol.iterator]: function* () { yield file; }
            } as FileList;
            input.files = fileList;
            handleLogoChange({ target: input } as any);
          })}
        >
          {logoPreview ? (
            <div className="relative flex justify-center">
              <div className="relative">
                <img
                  src={logoPreview}
                  alt="Лого"
                  className="h-32 w-32 object-contain rounded-lg mx-auto bg-white/10 p-3 shadow-lg"
                />
                <button
                  type="button"
                  onClick={removeLogo}
                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          ) : (
            <div className="relative text-center cursor-pointer py-8">
              {dragActive.logo ? (
                <div className="flex flex-col items-center">
                  <ImageIcon className="w-12 h-12 text-blue-400 mb-3" />
                  <p className="text-blue-400 font-medium">Зураг тавих</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Upload className="w-8 h-8 text-white/70 mb-3" />
                  <p className="text-white/70 font-medium">Лого оруулах</p>
                  <p className="text-xs text-white/50 mt-1">Эсвэл зургаа энд чирээрэй</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          )}
        </div>
        
        {/* Upload Status */}
        {isUploading && (
          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
              <span className="text-white text-sm">Зураг байршуулж байна...</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
        
        {uploadError && (
          <div className="flex items-center gap-2 mt-2 text-red-400">
            <AlertCircle className="w-4 h-4" />
            <p className="text-sm">{uploadError}</p>
          </div>
        )}
        
        {errors.logo && (
          <div className="flex items-center gap-2 mt-2 text-red-400">
            <AlertCircle className="w-4 h-4" />
            <p className="text-sm">{errors.logo.message}</p>
          </div>
        )}
      </div>

      {/* Background Image */}
      <div>
        <Label className="block mb-2 text-white mt-6 font-medium">
          Компаний background зураг *
        </Label>
        <p className="text-xs text-white/60 mb-3">16:9 харьцаатай өргөн зураг сонгоно уу (жишээ: 1920x1080)</p>
        <div 
          className={`border-2 border-dashed rounded-lg p-6 transition-all duration-200 ${
            dragActive.background 
              ? "border-blue-400 bg-blue-500/10" 
              : "border-white/30 bg-white/5 hover:bg-white/10"
          }`}
          onDragEnter={(e) => handleDragEnter(e, 'background')}
          onDragLeave={(e) => handleDragLeave(e, 'background')}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'background', (file) => {
            const input = document.createElement('input');
            input.type = 'file';
            const fileList = {
              0: file,
              length: 1,
              item: (index: number) => index === 0 ? file : null,
              [Symbol.iterator]: function* () { yield file; }
            } as FileList;
            input.files = fileList;
            handleSingleImageUpload({ target: input } as any, "backGroundImage", setBgPreview);
          })}
        >
          {bgPreview ? (
            <div className="relative">
              <img
                src={bgPreview}
                alt="Background"
                className="h-32 w-full object-cover rounded-lg bg-white/10 shadow-lg"
              />
              <button
                type="button"
                onClick={() => {
                  setBgPreview("");
                  setFormData((prev) => ({ ...prev, backGroundImage: "" }));
                  setValue("backGroundImage", "");
                }}
                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            </div>
          ) : (
            <div className="relative text-center cursor-pointer py-8">
              {dragActive.background ? (
                <div className="flex flex-col items-center">
                  <ImageIcon className="w-12 h-12 text-blue-400 mb-3" />
                  <p className="text-blue-400 font-medium">Зураг тавих</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Upload className="w-8 h-8 text-white/70 mb-3" />
                  <p className="text-white/70 font-medium">Background зураг оруулах</p>
                  <p className="text-xs text-white/50 mt-1">Эсвэл зургаа энд чирээрэй</p>
                </div>
              )}
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
      </div>

      {/* About Us Image */}
      <div>
        <Label className="block mb-2 text-white mt-6 font-medium">
          Компаний танилцуулга зураг *
        </Label>
        <p className="text-xs text-white/60 mb-3">4:3 харьцаатай зураг сонгоно уу (жишээ: 1200x900)</p>
        <div 
          className={`border-2 border-dashed rounded-lg p-6 transition-all duration-200 ${
            dragActive.about 
              ? "border-blue-400 bg-blue-500/10" 
              : "border-white/30 bg-white/5 hover:bg-white/10"
          }`}
          onDragEnter={(e) => handleDragEnter(e, 'about')}
          onDragLeave={(e) => handleDragLeave(e, 'about')}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'about', (file) => {
            const input = document.createElement('input');
            input.type = 'file';
            const fileList = {
              0: file,
              length: 1,
              item: (index: number) => index === 0 ? file : null,
              [Symbol.iterator]: function* () { yield file; }
            } as FileList;
            input.files = fileList;
            handleSingleImageUpload({ target: input } as any, "aboutUsImage", setAboutPreview);
          })}
        >
          {aboutPreview ? (
            <div className="relative">
              <img
                src={aboutPreview}
                alt="About Us"
                className="h-32 w-full object-cover rounded-lg bg-white/10 shadow-lg"
              />
              <button
                type="button"
                onClick={() => {
                  setAboutPreview("");
                  setFormData((prev) => ({ ...prev, aboutUsImage: "" }));
                  setValue("aboutUsImage", "");
                }}
                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            </div>
          ) : (
            <div className="relative text-center cursor-pointer py-8">
              {dragActive.about ? (
                <div className="flex flex-col items-center">
                  <ImageIcon className="w-12 h-12 text-blue-400 mb-3" />
                  <p className="text-blue-400 font-medium">Зураг тавих</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Upload className="w-8 h-8 text-white/70 mb-3" />
                  <p className="text-white/70 font-medium">Танилцуулга зураг оруулах</p>
                  <p className="text-xs text-white/50 mt-1">Эсвэл зургаа энд чирээрэй</p>
                </div>
              )}
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
      </div>

      {/* Multiple Images */}
      <div className="mt-8">
        <Label className="block mb-2 text-white mt-6 font-medium">
          Компаний зургууд (олон зураг)
        </Label>
        <p className="text-xs text-white/60 mb-3">Хамгийн ихдээ {MAX_COMPANY_IMAGES} зураг оруулах боломжтой</p>
        
        <div 
          className={`border-2 border-dashed rounded-lg p-4 transition-all duration-200 ${
            dragActive.company 
              ? "border-blue-400 bg-blue-500/10" 
              : "border-white/30 bg-white/5 hover:bg-white/10"
          }`}
          onDragEnter={(e) => handleDragEnter(e, 'company')}
          onDragLeave={(e) => handleDragLeave(e, 'company')}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'company', (file) => {
            if (companyImagePreview.length >= MAX_COMPANY_IMAGES) {
              setUploadError(`Хамгийн ихдээ ${MAX_COMPANY_IMAGES} зураг оруулах боломжтой`);
              return;
            }
            const input = document.createElement('input');
            input.type = 'file';
            const fileList = {
              0: file,
              length: 1,
              item: (index: number) => index === 0 ? file : null,
              [Symbol.iterator]: function* () { yield file; }
            } as FileList;
            input.files = fileList;
            handleImageChange({ target: input } as any);
          })}
        >
          {companyImagePreview.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {companyImagePreview.map((src, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={src}
                      alt={`Зураг ${index + 1}`}
                      className="h-24 w-full object-cover rounded-lg bg-white/10 shadow-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeCompanyImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                  </div>
                ))}
              </div>
              
              {companyImagePreview.length < MAX_COMPANY_IMAGES && (
                <div className="relative text-center cursor-pointer border-t border-white/20 pt-4">
                  {dragActive.company ? (
                    <div className="flex flex-col items-center py-4">
                      <ImageIcon className="w-8 h-8 text-blue-400 mb-2" />
                      <p className="text-blue-400 font-medium">Зургууд тавих</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center py-4">
                      <Upload className="w-6 h-6 mx-auto text-white/70 mb-2" />
                      <p className="text-sm text-white/70">Нэмэлт зураг оруулах</p>
                      <p className="text-xs text-white/50 mt-1">
                        {companyImagePreview.length}/{MAX_COMPANY_IMAGES} зураг
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              )}
              
              {isUploading && (
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                    <span className="text-white text-sm">Зургууд байршуулж байна...</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="relative text-center cursor-pointer py-12">
              {dragActive.company ? (
                <div className="flex flex-col items-center">
                  <ImageIcon className="w-16 h-16 text-blue-400 mb-4" />
                  <p className="text-blue-400 font-medium text-lg">Зургууд тавих</p>
                  <p className="text-blue-300 text-sm mt-1">Эсвэл товшиж сонгоно уу</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Upload className="w-12 h-12 mx-auto text-white/70 mb-4" />
                  <p className="text-white/70 font-medium text-lg">Компаний зургууд оруулах</p>
                  <p className="text-xs text-white/50 mt-2">
                    Олон зураг сонгож болно (Хамгийн ихдээ {MAX_COMPANY_IMAGES})
                  </p>
                </div>
              )}
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
        
        <p className="text-sm text-white/70 mt-3">
          Компаний орчин, хамт олны зураг, хэрэглэгчдэд харуулахыг хүссэн зургуудыг оруулна уу.
        </p>
        
        {uploadError && (
          <div className="flex items-center gap-2 mt-3 text-red-400">
            <AlertCircle className="w-4 h-4" />
            <p className="text-sm">{uploadError}</p>
          </div>
        )}
      </div>
    </>
  );
};
