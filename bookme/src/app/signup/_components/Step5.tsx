"use client";

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { FullSchemaType } from "./Schemas";
import { FormDataType } from "./Types";
// import { LocPickerCompany } from "./LocPicker"; // Commented out map picker

type Step5Props = {
  formData: FormDataType;
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
};

export const Step5 = ({ formData, setFormData }: Step5Props) => {
  // Commented out location state for map selection
  // const [location, setLocation] = useState<{
  //   lat: number;
  //   lng: number;
  //   address: string;
  // } | null>(null);

  const {
    setValue,
    trigger,
    formState: { errors },
  } = useFormContext<FullSchemaType>();

  // Commented out useEffect for map location handling
  // useEffect(() => {
  //   if (formData.address && formData.lat && formData.lng) {
  //     setLocation({
  //       lat: formData.lat,
  //       lng: formData.lng,
  //       address: formData.address,
  //     });
  //   }
  // }, [formData]);

  // Commented out map location selection handler
  // const handleLocationSelect = (loc: {
  //   lat: number;
  //   lng: number;
  //   address: string;
  // }) => {
  //   setLocation(loc);

  //   setValue("address", loc.address, { shouldValidate: true });
  //   setValue("city", "Улаанбаатар", { shouldValidate: true });
  //   setValue("lat", loc.lat);
  //   setValue("lng", loc.lng);

  //   trigger(["address", "city", "lat", "lng"]);

  //   setFormData((prev) => ({
  //     ...prev,
  //     address: loc.address,
  //     lat: loc.lat,
  //     lng: loc.lng,
  //     city: "Улаанбаатар",
  //   }));
  // };

  // New handler for manual address input
  const handleAddressChange = (field: "address" | "city", value: string) => {
    setValue(field, value, { shouldValidate: true });
    trigger([field]);

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="max-w-2xl p-6 mx-auto space-y-6 text-white rounded-lg">
      <h2 className="mb-2 text-xl font-bold">Байршлын мэдээлэл</h2>

      {/* Commented out map picker section */}
      {/* <div>
        <Label className="block mb-2 text-white">Хаяг сонгох *</Label>
        <div
          className={`bg-white/5 rounded-lg p-3 border ${
            errors.address ? "border-red-500" : "border-white/20"
          }`}
        >
          <LocPickerCompany
            onSelect={handleLocationSelect}
            defaultLocation={
              formData.lat && formData.lng
                ? {
                    lat: formData.lat,
                    lng: formData.lng,
                    address: formData.address,
                  }
                : undefined
            }
          />
        </div>

        {errors.address && !location && (
          <p className="mt-1 text-sm text-red-400">
            {errors.address.message || "Хаяг сонгох шаардлагатай"}
          </p>
        )}
      </div> */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="address" className="block mb-2 text-white">
            Хаяг <span className="text-red-500">*</span>
          </Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => handleAddressChange("address", e.target.value)}
            className="text-white bg-white/10 border-white/30 focus:border-white/50"
            placeholder="Хаягаа оруулна уу"
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-400">
              {errors.address.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="city" className="block mb-2 text-white">
            Хот <span className="text-red-500">*</span>
          </Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => handleAddressChange("city", e.target.value)}
            className="text-white bg-white/10 border-white/30 focus:border-white/50"
            placeholder="Хотын нэр оруулна уу"
          />
          {errors.city && (
            <p className="mt-1 text-sm text-red-400">{errors.city.message}</p>
          )}
        </div>
      </div>
    </div>
  );
};
