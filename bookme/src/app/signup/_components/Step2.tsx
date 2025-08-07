"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@radix-ui/react-label";
import React from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useFormContext } from "react-hook-form";
import { FullSchemaType } from "./Schemas";

export const Step2 = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<FullSchemaType>();

  return (
    <div className="space-y-6 text-white p-6 rounded-lg max-w-2xl mx-auto max-h-[500px] overflow-auto">
      <h2 className="text-xl font-bold mb-2">Компаний мэдээлэл</h2>

      <div>
        <Label htmlFor="description" className="block mb-2 text-white">
          Тайлбар
        </Label>

        <TextareaAutosize
          {...register("description")}
          id="description"
          minRows={3}
          className="w-full bg-white/10 text-white border-white placeholder-white/70 focus:border-white/50 focus:ring-white/20 placeholder-text-white rounded-md p-2"
        />
        {errors.description && (
          <p className="text-red-400 text-sm mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="phone" className="block mb-2 text-white">
          Утас *
        </Label>
        <Input
          {...register("phone")}
          id="phone"
          type="tel"
          className="bg-white/10 text-white border-white/30 placeholder-white/70 focus:border-white/50 focus:ring-white/20 placeholder-text-white"
          placeholder="9911 2233"
        />
        {errors.phone && (
          <p className="text-red-400 text-sm mt-1">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="experience" className="block mb-2 text-white">
          Тогвортой ажилласан жил
        </Label>
        <Input
          {...register("experience")}
          id="experience"
          className="bg-white/10 text-white border-white/30 placeholder-white/70 focus:border-white/50 focus:ring-white/20 placeholder-text-white"
          placeholder="10"
        />
        {errors.experience && (
          <p className="text-red-400 text-sm mt-1">
            {errors.experience.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="clientNumber" className="block mb-2 text-white">
          Нийт үйлчлүүлэгчдийн тоо
        </Label>
        <Input
          {...register("clientNumber")}
          id="clientNumber"
          type="number"
          className="bg-white/10 text-white border-white/30 placeholder-white/70 focus:border-white/50 focus:ring-white/20 placeholder-text-white"
          placeholder="100"
        />
        {errors.clientNumber && (
          <p className="text-red-400 text-sm mt-1">
            {errors.clientNumber.message}
          </p>
        )}
      </div>
    </div>
  );
};
