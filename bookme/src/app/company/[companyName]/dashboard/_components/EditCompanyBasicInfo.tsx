"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";
import { useCompanyAuth } from "@/app/_providers/CompanyAuthProvider";
import { useEffect, useState } from "react";
import { api } from "@/axios";
import { toast } from "sonner";
import { LoadingSvg } from "@/app/_components/assets/LoadingSvg";

export const EditCompanyBasicInfo = () => {
  const { company } = useCompanyAuth();
  const [loading, setLoading] = useState(false);

  const [updatedCompany, setUpdatedCompany] = useState({
    companyName: "",
    description: "",
    experience: "",
    totalEmployees: 0,
    totalBookings: 0,
  });

  useEffect(() => {
    if (company) {
      setUpdatedCompany({
        companyName: company.companyName || "",
        description: company.description || "",
        experience: company.experience || "",
        totalEmployees: company.employees.length,
        totalBookings: company.bookings.length,
      });
    }
  }, []);

  const handleChangeBasicInfo = async () => {
    setLoading(true);
    try {
      const updateData = await api.put(`/company/${company?._id}`, {
        companyName: updatedCompany.companyName,
        description: updatedCompany.description,
        experience: updatedCompany.experience,
      });
      toast.success("Ерөнхий мэдээлэл амжилттай солигдлоо.");
    } catch (error) {
      console.error("Компанийн мэдээлэл шинэчлэхэд алдаа гарлаа.", error);
      toast.error("Компанийн мэдээлэл шинэчлэхэд алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  if (!company) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Компаний мэдээлэл</CardTitle>
        <CardDescription>Компанийн мэдээллээ шинэчилнэ үү.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="company-name">{company?.companyName}</Label>
          <Input
            id="company-name"
            placeholder="Enter company name"
            defaultValue={`${company.companyName}`}
            onChange={(e) =>
              setUpdatedCompany((prev) => ({
                ...prev,
                companyName: e.target.value,
              }))
            }
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="company-description">Description</Label>
          <Textarea
            id="company-description"
            placeholder="Enter company description"
            defaultValue={`${company.description}`}
            rows={3}
            onChange={(e) =>
              setUpdatedCompany((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
          />
        </div>
        <div className="flex gap-5">
          <div className="grid gap-2 w-full">
            <Label htmlFor="experience">Ажлын туршлага (жилээр)</Label>
            <Input
              id="experience"
              type="number"
              placeholder="Enter years"
              defaultValue={`${company.experience}`}
              onChange={(e) =>
                setUpdatedCompany((prev) => ({
                  ...prev,
                  experience: e.target.value,
                }))
              }
            />
          </div>
          <div className="w-full h-fit flex justify-between gap-3">
            <div className="grid gap-2 w-full">
              <Label htmlFor="client-number">Нийт ажилтан</Label>
              <Input
                disabled
                id="booking-number"
                type="number"
                placeholder="Enter client count"
                defaultValue={`${company.employees.length}`}
              />
            </div>
          </div>
        </div>
      </CardContent>
      <div className="flex justify-end mr-5">
        <Button
          className="bg-[#007FFF] hover:bg-[#007FFF]/90"
          onClick={handleChangeBasicInfo}
        >
          <Save className="mr-2 h-4 w-4" />
          {loading ? <LoadingSvg /> : "Хадгалах"}
        </Button>
      </div>
    </Card>
  );
};
