"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/axios";
import {
  Check,
  Star,
  ChevronLeft,
  ChevronRight,
  Settings,
  Eye,
  Grid3X3,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Template1 } from "../../_components/_templates/Template1";
import { Template2 } from "../../_components/_templates/Template2";
import { Template3 } from "../../_components/_templates/Template3";
import { Company } from "../../_components/CompanyTypes";

interface EditTemplatesProps {
  company: Company;
  fetchCompany: () => Promise<void>;
  onSuccess?: () => void;
}

interface Template {
  templateNumber: number;
  name: string;
  description: string;
  component: React.ComponentType<any>;
  features: string[];
}

export const EditTemplates: React.FC<EditTemplatesProps> = ({
  company,
  fetchCompany,
  onSuccess,
}) => {
  const { companyName } = useParams<{ companyName: string }>();
  const [currentTemplateIndex, setCurrentTemplateIndex] = useState(0);
  // Changed: Use Set to track which templates are currently saving
  const [savingTemplates, setSavingTemplates] = useState<Set<number>>(
    new Set()
  );
  const [previewMode, setPreviewMode] = useState(false);

  const templates = useMemo(
    () => [
      {
        templateNumber: 1,
        name: "Загвар 1",
        description:
          "Цэвэр, орчин үеийн бөгөөд зөөлөн ягаан өнгийн шийдэлтэй дизайн",
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
    ],
    []
  );

  const currentTemplate = useMemo(
    () => templates[currentTemplateIndex],
    [templates, currentTemplateIndex]
  );

  const isCurrentTemplate = useMemo(
    () => company?.templateNumber === currentTemplate?.templateNumber,
    [company?.templateNumber, currentTemplate?.templateNumber]
  );

  // Helper function to check if a specific template is saving
  const isTemplateSaving = useCallback(
    (templateNumber: number) => {
      return savingTemplates.has(templateNumber);
    },
    [savingTemplates]
  );

  // Helper function to check if any template is saving
  const isAnySaving = useMemo(() => {
    return savingTemplates.size > 0;
  }, [savingTemplates]);

  useEffect(() => {
    if (company?.templateNumber) {
      const index = templates.findIndex(
        (t) => t.templateNumber === company.templateNumber
      );
      if (index !== -1) {
        setCurrentTemplateIndex(index);
      }
    }
  }, [company?.templateNumber, templates]);

  const handleSaveTemplate = useCallback(
    async (templateIndex: number) => {
      if (!company) {
        toast.error("Company data not available");
        return;
      }

      const selectedTemplate = templates[templateIndex];
      if (!selectedTemplate) {
        toast.error("Invalid template selection");
        return;
      }

      if (company.templateNumber === selectedTemplate.templateNumber) {
        toast.info("This template is already selected");
        return;
      }

      // Prevent double execution - check if already saving
      if (savingTemplates.has(selectedTemplate.templateNumber)) {
        return;
      }

      // Add this template to the saving set
      setSavingTemplates((prev) =>
        new Set(prev).add(selectedTemplate.templateNumber)
      );

      try {
        await api.put(`/company/${company._id}`, {
          templateNumber: selectedTemplate.templateNumber,
        });

        toast.success(`${selectedTemplate.name} амжилттай сонгогдлоо`);
        await fetchCompany();
        onSuccess?.();
      } catch (error) {
        console.error("Error saving template:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        toast.error(`Дизайн хадгалахад алдаа гарлаа: ${errorMessage}`);
      } finally {
        // Remove this template from the saving set
        setSavingTemplates((prev) => {
          const newSet = new Set(prev);
          newSet.delete(selectedTemplate.templateNumber);
          return newSet;
        });
      }
    },
    [company, templates, fetchCompany, onSuccess]
  );

  const goToNextTemplate = useCallback(() => {
    setCurrentTemplateIndex((prev) => (prev + 1) % templates.length);
  }, [templates.length]);

  const goToPrevTemplate = useCallback(() => {
    setCurrentTemplateIndex(
      (prev) => (prev - 1 + templates.length) % templates.length
    );
  }, [templates.length]);

  const handleTemplateSelect = useCallback((index: number) => {
    setCurrentTemplateIndex(index);
  }, []);

  const togglePreviewMode = useCallback(() => {
    setPreviewMode((prev) => !prev);
  }, []);

  const renderTemplatePreview = useCallback(() => {
    if (!currentTemplate || !company) return null;

    const TemplateComponent = currentTemplate.component;
    return (
      <div className="w-full h-full min-h-[500px] bg-white rounded-lg overflow-hidden shadow-sm">
        <TemplateComponent
          data={company}
          isPreview={true}
          companyName={companyName}
        />
      </div>
    );
  }, [currentTemplate, company, companyName]);

  if (!company) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">Компанийн мэдээлэл ачааллаж байна...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Settings className="h-6 w-6" />
            Дизайн тохиргоо
          </h2>
          <p className="text-gray-600 mt-1">
            Та өөрийн бизнест тохирох дизайныг сонгоно уу
          </p>
        </div>
      </div>

      {previewMode ? (
        /* Preview Mode */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Template Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{currentTemplate.name}</span>
                  {isCurrentTemplate && (
                    <Badge
                      variant="default"
                      className="bg-green-500 hover:bg-green-600"
                    >
                      Одоогийн
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>{currentTemplate.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Navigation */}
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToPrevTemplate}
                    disabled={templates.length <= 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-gray-500">
                    {currentTemplateIndex + 1} / {templates.length}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToNextTemplate}
                    disabled={templates.length <= 1}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                {/* Save Button */}
                <Button
                  onClick={() => handleSaveTemplate(currentTemplateIndex)}
                  disabled={
                    isTemplateSaving(currentTemplate.templateNumber) ||
                    isCurrentTemplate
                  }
                  className="w-full"
                  size="lg"
                >
                  {isTemplateSaving(currentTemplate.templateNumber) ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Хадгалж байна...
                    </>
                  ) : isCurrentTemplate ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Одоогийн дизайн
                    </>
                  ) : (
                    <>
                      <Star className="h-4 w-4 mr-2" />
                      Энэ дизайныг сонгох
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Template Preview */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Урьдчилан харах
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {renderTemplatePreview()}
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        /* Grid Mode */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template, index) => {
            const TemplateComponent = template.component;
            const isSelected =
              company?.templateNumber === template.templateNumber;
            const isSaving = isTemplateSaving(template.templateNumber);

            return (
              <Card
                key={template.templateNumber}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${
                  isSelected
                    ? "border-blue-500 bg-blue-50 shadow-lg"
                    : "border-gray-200 hover:border-blue-300"
                }`}
                onClick={() => handleTemplateSelect(index)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    {isSelected && (
                      <Badge
                        variant="default"
                        className="bg-green-500 hover:bg-green-600"
                      >
                        Одоогийн
                      </Badge>
                    )}
                  </div>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Mini Preview */}
                  <div className="border-2 border-gray-200 rounded-lg overflow-hidden h-48 mb-4 bg-white">
                    <div className="scale-[0.3] origin-top-left w-[333%] h-[333%] overflow-hidden">
                      <TemplateComponent
                        data={company}
                        isPreview={true}
                        companyName={companyName}
                      />
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      handleSaveTemplate(index);
                    }}
                    disabled={isSaving || isSelected}
                    className="w-full"
                    size="lg"
                    variant={isSelected ? "secondary" : "default"}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Хадгалж байна...
                      </>
                    ) : isSelected ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Сонгогдсон
                      </>
                    ) : (
                      <>
                        <Star className="h-4 w-4 mr-2" />
                        Сонгох
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
