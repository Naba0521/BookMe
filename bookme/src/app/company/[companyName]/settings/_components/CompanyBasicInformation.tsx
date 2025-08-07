"use client";

import { LoadingSvg } from "@/app/_components/assets/LoadingSvg";
import { useCompanyAuth } from "@/app/_providers/CompanyAuthProvider";
import { api } from "@/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const CompanyBasicInformation = () => {
  const { company } = useCompanyAuth();
  const [loading, setLoading] = useState(false);

  const [updatedCompany, setUpdatedCompany] = useState({
    companyName: "",
    email: "",
    phoneNumber: "",
    description: "",
    address: "",
  });

  useEffect(() => {
    if (company) {
      setUpdatedCompany({
        companyName: company.companyName || "",
        email: company.email || "",
        phoneNumber: company.phoneNumber || "",
        address: company.address || "",
        description: company.description || "",
      });
    }
  }, [company]);

  const handleChangeData = async () => {
    setLoading(true);
    try {
      const updateData = await api.put(`/company/${company?._id}`, {
        companyName: updatedCompany.companyName,
        email: updatedCompany.email,
        phoneNumber: updatedCompany.phoneNumber,
        address: updatedCompany.address,
        description: updatedCompany.description,
      });
      toast.success("Мэдээлэл амжилттай солигдлоо.");
    } catch (error) {
      console.error("Компанийн мэдээлэл шинэчлэхэд алдаа гарлаа.", error);
      toast.error("Компанийн мэдээлэл шинэчлэхэд алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  if (!company) return null;

  return (
    <div className="bg-white w-full rounded-2xl p-4 flex flex-col gap-4">
      <div>
        <div className="text-[20px] font-bold">Basic information</div>
        <div className="text-[14px] font-normal text-[#aaa]">
          Update your business details.
        </div>
      </div>
      <div className="flex gap-5">
        <div className="flex flex-col gap-2 w-full">
          <p className="text-[17px] font-semibold">Компанийн нэр</p>
          <Input
            defaultValue={updatedCompany.companyName}
            onChange={(e) =>
              setUpdatedCompany((prev) => ({
                ...prev,
                companyName: e.target.value,
              }))
            }
          />
        </div>
        <div className="flex flex-col gap-2 w-full">
          <p className="text-[17px] font-semibold">Цахим хаяг</p>
          <Input
            value={updatedCompany.email}
            onChange={(e) =>
              setUpdatedCompany((prev) => ({
                ...prev,
                email: e.target.value,
              }))
            }
          />
        </div>
      </div>
      <div className="flex gap-5">
        <div className="flex flex-col gap-2 w-full">
          <p className="text-[17px] font-semibold">Холбоо барих дугаар</p>
          <Input
            defaultValue={updatedCompany.phoneNumber}
            onChange={(e) =>
              setUpdatedCompany((prev) => ({
                ...prev,
                phoneNumber: e.target.value,
              }))
            }
          />
        </div>
        <div className="flex flex-col gap-2 w-full">
          <p className="text-[17px] font-semibold">Хаяг</p>
          <Input
            value={updatedCompany.address}
            onChange={(e) =>
              setUpdatedCompany((prev) => ({
                ...prev,
                address: e.target.value,
              }))
            }
          />
        </div>
      </div>
      <div className="flex flex-col gap-2 w-full">
        <p className="text-[17px] font-semibold">Танилцуулга</p>
        <Textarea
          value={updatedCompany.description}
          onChange={(e) =>
            setUpdatedCompany((prev) => ({
              ...prev,
              description: e.target.value,
            }))
          }
        />
      </div>
      <div className="w-full flex justify-end">
        {loading === false ? (
          <Button onClick={handleChangeData}>Хадгалах</Button>
        ) : (
          <LoadingSvg />
        )}
      </div>
    </div>
  );
};
