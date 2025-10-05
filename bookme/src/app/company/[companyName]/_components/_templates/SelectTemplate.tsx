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
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-t-2 border-b-2 border-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="relative max-w-md px-4 py-3 text-red-700 bg-red-100 border border-red-400 rounded">
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
      <div className="px-6 py-4 m-auto bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl font-bold text-gray-900">
            {company?.companyName} - Дизайн сонгох хэсэг
          </h1>
          <p className="mt-1 text-gray-600">
            Та бизнестээ тохирох дизайныг сонгоно уу!
          </p>
        </div>
      </div>

      <div className="p-6 mx-auto max-w-7xl">
        {/* Navigation and Template Info */}
        <div className="mb-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            {/* 1. Template Info */}
            <div className="flex items-center flex-1 gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg">
                <Star className="text-blue-600" size={16} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {currentTemplate.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {currentTemplate.description}
                </p>
              </div>
            </div>

            {/* 2. Navigation Controls */}
            <div className="flex items-center justify-center flex-1 gap-4">
              <Button
                variant="outline"
                onClick={goToPrevTemplate}
                disabled={currentTemplateIndex === 0}
                size="sm"
                aria-label="Previous template"
                className="flex items-center gap-2"
              >
                <ChevronLeft size={16} />
                Өмнөх
              </Button>

              <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
                <span className="text-sm font-medium text-gray-700">
                  Дизайн {currentTemplateIndex + 1} / {templates.length}
                </span>
              </div>

              <Button
                variant="outline"
                onClick={goToNextTemplate}
                disabled={currentTemplateIndex === templates.length - 1}
                size="sm"
                aria-label="Next template"
                className="flex items-center gap-2"
              >
                Дараах
                <ChevronRight size={16} />
              </Button>
            </div>

            {/* 3. Select Button */}
            <div className="flex justify-center flex-1 lg:justify-end">
              <Button
                onClick={handleSaveTemplate}
                disabled={saving}
                className="bg-blue-600 cursor-pointer hover:bg-blue-700"
                size="sm"
              >
                {saving ? (
                  <>
                    <div className="w-3 h-3 mr-2 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                    Хадгалж байна...
                  </>
                ) : (
                  <>
                    <Check size={16} className="mr-2" />
                    Энэ дизайныг сонгох
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Template Preview */}
        <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">
              Урьдчилан харах
            </h3>
            <p className="text-sm text-gray-600">
              Сонгосон дизайныг эндээс урьдчилан харж болно
            </p>
          </div>
          <div className="p-6">
            <div className="overflow-hidden border border-gray-200 rounded-lg bg-gray-50">
              <div className="max-h-[70vh] overflow-auto">
                <div className="flex justify-center">
                  {renderTemplatePreview(false)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
