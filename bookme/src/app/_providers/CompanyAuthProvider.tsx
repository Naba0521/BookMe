"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PropsWithChildren } from "react";
import { api, setAuthToken } from "@/axios";
import { Company } from "../signup/_components/Types";

type AuthContextType = {
  company?: Company;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    company: Company
  ) => Promise<{ data: any; status: number } | undefined>;
  signOutCompany: () => void;
  getCompany: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const CompanyAuthProvider = ({ children }: PropsWithChildren) => {
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState<Company | undefined>();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const signIn = async (email: string, password: string) => {
    try {
      const { data } = await api.post("/signin", { email, password });
      localStorage.setItem("company_token", data.token);
      setCompany(data.company);
      console.log(data);
      
      router.push(`/company/${data.company.companyName}`);
      toast.success("Амжилттай нэвтэрлээ!");
    } catch (error) {
      toast.error("Нэвтрэхэд алдаа гарлаа");
    }
  };

  const signUp = async (
    newCompany: Company
  ): Promise<{ data: any; status: number } | undefined> => {
    try {
      const response = await api.post("/signup", newCompany);
      localStorage.setItem("company_token", response.data.token);
      setCompany(response.data.company);
      toast.success("Амжилттай бүртгэгдлээ!");
      router.push(`/company/${response.data.company.companyName}`);
      return { data: response.data, status: response.status };
    } catch (error: any) {
      if (error?.response?.status === 409) {
        toast.error("Имэйл бүртгэлтэй байна");
      } else {
        toast.error("Бүртгэл амжилтгүй боллоо");
      }
      return undefined;
    }
  };
  const signOutCompany = async () => {
    setIsLoggingOut(true);
    try {
      localStorage.removeItem("company_token");
      setCompany(undefined);
      router.push(`/company/${company?.companyName}`);
      toast.success("Системээс гарлаа");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getCompany = async () => {
    const token = localStorage.getItem("company_token");
    if (!token) return;
    setAuthToken(token);

    try {
      setLoading(true);
      const { data } = await api.get("/me");
      setCompany(data);
    } catch (error) {
      console.error("Компаний мэдээлэл авахад алдаа:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCompany();
  }, []);

  return (
    <AuthContext.Provider
      value={{ company, signIn, signOutCompany, signUp, getCompany, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useCompanyAuth = () => useContext(AuthContext);
