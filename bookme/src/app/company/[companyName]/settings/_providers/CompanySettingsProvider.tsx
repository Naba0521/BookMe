"use client";
import { useCompanyAuth } from "@/app/_providers/CompanyAuthProvider";
import { api } from "@/axios";
import axios from "axios";
import { toast } from "sonner";

import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

type CompanyInformationAuth = {
  handleInputCompanyLogo: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => Promise<void>;
  handleInputEmployeeImage: (
    e: React.ChangeEvent<HTMLInputElement>,
    form: any
  ) => Promise<void>;
  handleInputCompanyImage: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => Promise<void>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  companyLogo: string | null;
  employeeImage: string | null;
  companyData: Company[];
  companyLogoTest: string | null;
  companyAddedImage: string | null;
  loading: boolean;
};

type CompanyDataType = {
  companies: Company[];
};

export type Company = {
  companyName: string;
  address: string;
  companyLogo: string;
  description: string;
  email: string;
  employees: EmployeeType[];
};

export type EmployeeType = {
  _id: string;
  employeeName: string;
  description: string;
  profileImage: string;
};

const CompanyInformation = createContext<CompanyInformationAuth | undefined>(
  undefined
);

export const CompanySettingsProvider = ({ children }: PropsWithChildren) => {
  const [companyAddedImage, setCompanyAddedImage] = useState<string | null>(
    null
  );
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  const [employeeImage, setEmployeeImage] = useState<string | null>(null);
  const [companyData, setCompanyData] = useState<Company[]>([]);
  const [companyLogoTest, setCompanyLogoTest] = useState<string | null>(null);
  const { company, getCompany } = useCompanyAuth();
  const [loading, setLoading] = useState(false);

  const getCompanyData = async () => {
    try {
      const { data } = await api.get<CompanyDataType>("/company");

      setCompanyData(data.companies);
    } catch (error) {
      console.error("Сервер алдаа", error);
    }
  };

  const uploadedImageFunction = async (
    file: File | null
  ): Promise<string | null> => {
    if (!file) return null;

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_UPLOAD_PRESET_DATA!
    );

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/image/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      return response.data.url;
    } catch (error) {
      console.error("Failed to upload image", error);
      return null;
    }
  };

  const handleInputCompanyLogo = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const result = await uploadedImageFunction(file);
      setCompanyLogoTest(result);

      if (result) setCompanyLogo(result);
    }
  };

  const handleInputEmployeeImage = async (
    e: React.ChangeEvent<HTMLInputElement>,
    form: any
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const uploadedImageUrl = await uploadedImageFunction(file);
      if (uploadedImageUrl) {
        setEmployeeImage(uploadedImageUrl);
        form.setValue("profileImage", uploadedImageUrl);
      }
    }
  };

  const handleAddCompanyImage = async (result: string | null) => {
    try {
      const currentImages = company?.companyImages || [];
      const updatedImages = [...currentImages, result];
      await api.put(`/company/${company?._id}`, {
        companyImages: updatedImages,
      });

      toast.success("Зураг амжилттай нэмэгдлээ.");
    } catch (error) {
      console.error("Зураг нэмэхэд алдаа гарлаа:", error);
      toast.error("Зураг нэмэхэд алдаа гарлаа.");
    }
  };

  const handleInputCompanyImage = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLoading(true);
    const file = e.target.files?.[0];
    if (file) {
      const result = await uploadedImageFunction(file);
      await handleAddCompanyImage(result);
      await getCompany();
    }
    setLoading(false);
  };

  useEffect(() => {
    getCompanyData();
  }, []);

  return (
    <CompanyInformation.Provider
      value={{
        handleInputCompanyLogo,
        handleInputEmployeeImage,
        handleInputCompanyImage,
        setLoading,
        loading,
        companyLogo,
        employeeImage,
        companyData,
        companyLogoTest,
        companyAddedImage,
      }}
    >
      {children}
    </CompanyInformation.Provider>
  );
};
export const useSettings = (): CompanyInformationAuth => {
  const context = useContext(CompanyInformation);
  if (context === undefined) {
    throw new Error(
      "useSettings must be used within a CompanySettingsProvider"
    );
  }
  return context;
};
