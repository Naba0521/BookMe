"use client";

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { FullSchemaType } from "./Schemas";
import { FormDataType } from "./Types";
import { LocPickerCompany } from "./LocPicker";

type Step5Props = {
  formData: FormDataType;
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
};

export const Step5 = ({ formData, setFormData }: Step5Props) => {
  const [location, setLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);

  const {
    setValue,
    trigger, 
    formState: { errors },
  } = useFormContext<FullSchemaType>();

  useEffect(() => {
    if (formData.address && formData.lat && formData.lng) {
      setLocation({
        lat: formData.lat,
        lng: formData.lng,
        address: formData.address,
      });
    }
  }, [formData]);

  const handleLocationSelect = (loc: {
    lat: number;
    lng: number;
    address: string;
  }) => {
    setLocation(loc);

    setValue("address", loc.address, { shouldValidate: true });
    setValue("city", "Улаанбаатар", { shouldValidate: true });
    setValue("lat", loc.lat);
    setValue("lng", loc.lng);

    trigger(["address", "city", "lat", "lng"]);

    setFormData((prev) => ({
      ...prev,
      address: loc.address,
      lat: loc.lat,
      lng: loc.lng,
      city: "Улаанбаатар",
    }));
  };

  const handleChangeLocation = () => {
    setLocation(null);
    setValue("address", "", { shouldValidate: true });
    setValue("city", "", { shouldValidate: true });
    setValue("lat", undefined);
    setValue("lng", undefined);
    
    setFormData((prev) => ({
      ...prev,
      address: "",
      lat: undefined,
      lng: undefined,
      city: "",
    }));
  };

  return (
    <div className="max-w-2xl p-6 mx-auto space-y-6 text-white rounded-lg">
      <h2 className="mb-2 text-xl font-bold">Байршлын мэдээлэл</h2>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className="block text-white">Хаяг сонгох <span className="text-red-500 text-[24px]">*</span></Label>
          {location && (
            <button
              type="button"
              onClick={handleChangeLocation}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
            >
              <span>📍</span>
              Хаяг солих
            </button>
          )}
        </div>

        <div
          className={`bg-white/5 rounded-lg p-3 border transition-colors duration-200 ${
            errors.address ? "border-red-500" : "border-white/20"
          } ${location ? "ring-2 ring-blue-500/30" : ""}`}
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

        {location && (
          <div className="mt-2 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
            <p className="text-sm text-green-400 font-medium">✅ Хаяг сонгогдлоо</p>
            <p className="text-xs text-green-300 mt-1">{location.address}</p>
          </div>
        )}

        {/* {errors.address && !location && (
          <p className="mt-1 text-sm text-red-400">
            {errors.address.message || "Хаяг сонгох шаардлагатай"}
          </p>
        )} */}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="address" className="block mb-2 text-white">
            Хаяг
          </Label>
          <Input
            id="address"
            value={formData.address}
            readOnly
            className="text-white cursor-default bg-white/10 border-white/30 focus:border-white/50"
            placeholder="Хаяг сонгосны дараа харагдана"
          />
          {/* {errors.address && (
            <p className="mt-1 text-sm text-red-400">
              {errors.address.message}
            </p>
          )} */}
        </div>

        <div>
          <Label htmlFor="city" className="block mb-2 text-white">
            Хот
          </Label>
          <Input
            id="city"
            value={formData.city}
            readOnly
            className="text-white cursor-default bg-white/10 border-white/30 focus:border-white/50"
            placeholder="Автоматаар бөглөгдөнө"
          />
          {/* {errors.city && (
            <p className="mt-1 text-sm text-red-400">{errors.city.message}</p>
          )} */}
        </div>
      </div>
    </div>
  );
};
