"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { api } from "@/axios";
import { Check, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

import { Template1 } from "./Template1";
import { Template2 } from "./Template2";
import { Template3 } from "./Template3";
import { Company } from "../CompanyTypes";

export const SelectTemplate = ({ fetchCompany }: any) => {
  const { companyName } = useParams<{ companyName: string }>();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTemplateIndex, setCurrentTemplateIndex] = useState(0);
  const [saving, setSaving] = useState(false);

  const templates = [
    {
      templateNumber: 1,
      name: "Загвар 1",
      description: "Цэвэрхэн, орчин үеийн бөгөөд зөөлөн ягаан өнгийн дизайн",
      component: Template1,
    },
    {
      templateNumber: 2,
      name: "Загвар 2",
      description:
        "Ирээдүйг илтгэх элементүүдтэй, хүчтэй визуал нөлөө бүхий модерн дизайн",
      component: Template2,
    },
    {
      templateNumber: 3,
      name: "Загвар 3",
      description:
        "Анхаарал сарниулах зүйлгүй, цэвэрхэн, агуулгад төвлөрсөн энгийн дизайн",
      component: Template3,
    },
  ];

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/company/name/${companyName}`);
        const companyData = response.data?.company;
        if (companyData) {
          setCompany(companyData);
          if (companyData.templateNumber) {
            const index = templates.findIndex(
              (t) => t.templateNumber === companyData.templateNumber
            );
            if (index !== -1) setCurrentTemplateIndex(index);
          }
        } else {
          setError("Компани олдсонгүй");
        }
      } catch (err) {
        console.error("Компаний мэдээлэл авахад алдаа гарлаа:", err);
        setError("Компаний мэдээлэл авахад алдаа гарлаа");
      } finally {
        setLoading(false);
      }
    };

    if (companyName) fetchCompany();
  }, [companyName]);

  const handleSaveTemplate = async () => {
    if (!company) return;
    setSaving(true);
    try {
      const selectedNumber = templates[currentTemplateIndex].templateNumber;
      await api.put(`/company/${company._id}`, {
        templateNumber: selectedNumber,
      });
      toast.success("Дизайн амжилттай хадгалагдлаа.");
      await fetchCompany();
    } catch (err) {
      console.error("Template хадгалахад алдаа гарлаа:", err);
      toast.error("Template хадгалахад алдаа гарлаа.");
    } finally {
      setSaving(false);
    }
  };

  const goToNextTemplate = () => {
    setCurrentTemplateIndex((prev) => (prev + 1) % templates.length);
  };

  const goToPrevTemplate = () => {
    setCurrentTemplateIndex(
      (prev) => (prev - 1 + templates.length) % templates.length
    );
  };

  const renderTemplatePreview = (isFullSize = false) => {
    const template = templates[currentTemplateIndex];
    const TemplateComponent = template.component;
    return company ? (
      <div className={`${isFullSize ? "" : "scale-100"} origin-top-left`}>
        <TemplateComponent
          data={company}
          isPreview={true}
          companyName={companyName}
        />
      </div>
    ) : null;
  };

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
        <Button className="mt-4" onClick={() => window.location.reload()}>
          Дахин оролдох
        </Button>
      </div>
    );
  }

  const currentTemplate = templates[currentTemplateIndex];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4 m-auto">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">
            {company?.companyName} - Дизайн сонгох хэсэг
          </h1>
          <p className="text-gray-600 mt-1">
            Та бизнестээ тохирох дизайныг сонгоно уу!
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={goToPrevTemplate}
                disabled={currentTemplateIndex === 0}
                size="sm"
                aria-label="Previous template"
              >
                <ChevronLeft size={16} />
              </Button>
              <span className="text-sm text-gray-500">
                Дизайн {currentTemplateIndex + 1} / {templates.length}
              </span>

              <Button
                variant="outline"
                onClick={goToNextTemplate}
                disabled={currentTemplateIndex === templates.length - 1}
                size="sm"
                aria-label="Next template"
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 mb-8">
          <div className="w-full order-2 lg:order-1">
            <div className="bg-white rounded-lg p-4 border border-gray-200 relative">
              <h3 className="font-semibold text-gray-900 mb-4">
                Урьдчилан харах
              </h3>
              <div className="border rounded-lg overflow-hidden h-[600px]">
                <div className="h-full w-full overflow-auto flex justify-center">
                  {renderTemplatePreview(false)}
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="bg-white rounded-lg p-6 border border-gray-200 h-fit">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Star className="text-black-600" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {currentTemplate.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {currentTemplate.description}
                  </p>
                </div>
              </div>

              <Button
                onClick={handleSaveTemplate}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2"
                size="lg"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    Хадгалж байна...
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    Энэ дизайныг сонгох
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
