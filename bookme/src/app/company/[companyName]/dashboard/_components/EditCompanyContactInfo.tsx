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
import { Save } from "lucide-react";
import { useCompanyAuth } from "@/app/_providers/CompanyAuthProvider";
import { useEffect, useState } from "react";
import { api } from "@/axios";
import { toast } from "sonner";
import { LoadingSvg } from "@/app/_components/assets/LoadingSvg";
export const EditCompanyContactInfo = () => {
  const { company } = useCompanyAuth();
  const [loading, setLoading] = useState(false);

  const [updatedCompany, setUpdatedCompany] = useState({
    email: "",
    phoneNumber: "",
    address: "",
  });

  useEffect(() => {
    if (company) {
      setUpdatedCompany({
        email: company.email || "",
        phoneNumber: company.phoneNumber || "",
        address: company.address || "",
      });
    }
  }, [company]);

  const handleChangeContactInfo = async () => {
    setLoading(true);
    try {
      await api.put(`/company/${company?._id}`, {
        email: updatedCompany.email,
        phoneNumber: updatedCompany.phoneNumber,
        address: updatedCompany.address,
      });
      toast.success("Мэдээлэл амжилттай солигдлоо.");
    } catch (error) {
      console.error("Компанийн мэдээлэл шинэчлэхэд алдаа гарлаа.", error);
      toast.error("Компанийн мэдээлэл шинэчлэхэд алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Холбоо барих мэдээлэл</CardTitle>
        <CardDescription>Холбоо барих мэдээлэл засварлана уу.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email хаяг</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter email"
            defaultValue={`${updatedCompany.email}`}
            onChange={(e) =>
              setUpdatedCompany((prev) => ({
                ...prev,
                email: e.target.value,
              }))
            }
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="phone">Утасны дугаар</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="Enter phone number"
            defaultValue={`${updatedCompany.phoneNumber}`}
            onChange={(e) =>
              setUpdatedCompany((prev) => ({
                ...prev,
                phoneNumber: e.target.value,
              }))
            }
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="address">Хаяг</Label>
          <Input
            id="address"
            placeholder="Enter address"
            defaultValue={`${updatedCompany.address}`}
            onChange={(e) =>
              setUpdatedCompany((prev) => ({
                ...prev,
                address: e.target.value,
              }))
            }
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="website">Website</Label>
          <Input
            disabled
            id="website"
            type="url"
            placeholder="Enter website URL"
            defaultValue={`https://book-me-seven-sigma.vercel.app/company/${company?.companyName}`}
          />
        </div>
      </CardContent>
      <div className="flex justify-end mr-5">
        <Button
          className="bg-[#007FFF] hover:bg-[#007FFF]/90"
          onClick={handleChangeContactInfo}
        >
          <Save className="w-4 h-4 mr-2" />
          {loading ? <LoadingSvg /> : "Хадгалах"}
        </Button>
      </div>
    </Card>
  );
};
