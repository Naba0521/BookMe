"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { api } from "@/axios";
import { Company } from "./_components/CompanyTypes";
import { Template1 } from "./_components/_templates/Template1";
import { Template2 } from "./_components/_templates/Template2";
import { Template3 } from "./_components/_templates/Template3";
import { SelectTemplate } from "./_components/_templates/SelectTemplate";
import { toast } from "sonner";

export default function CompanyTemplateSelector() {
  const { companyName } = useParams<{ companyName: string }>();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const templateNumber = company?.templateNumber ?? 0;
  const fetchCompany = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/company/name/${companyName}`);

      if (response.data?.company) {
        setCompany(response.data.company);
      }
    } catch (err) {
      console.error("Компаний мэдээлэл авахад алдаа гарлаа:", err);
      setError("Компаний мэдээлэл авахад алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (companyName) {
      fetchCompany();
    }
  }, [companyName]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md">
          <strong className="font-bold">Анхаар!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
        <Button
          className="mt-4 cursor-pointer"
          onClick={() => window.location.reload()}
        >
          Дахин оролдох
        </Button>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Компаний мэдээлэл олдсонгүй</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {templateNumber === 0 && <SelectTemplate fetchCompany={fetchCompany} />}
      {templateNumber === 1 && (
        <Template1 data={company} companyName={companyName} />
      )}
      {templateNumber === 2 && (
        <Template2 data={company} companyName={companyName} />
      )}
      {templateNumber === 3 && <Template3 data={company} />}
    </div>
  );
}
