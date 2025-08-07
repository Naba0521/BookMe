"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormContext } from "react-hook-form";
import { Step1SchemaType } from "./Schemas";

export const Step1 = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<Step1SchemaType>();

  const inputClass = "bg-white/10 text-white border-white placeholder-white";

  return (
    <div className="space-y-6 text-white p-6 rounded-lg max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-2">Бүртгэлийн мэдээлэл</h2>

      <div>
        <Label htmlFor="email" className="mb-2">
          Имэйл *
        </Label>
        <Input
          {...register("email")}
          placeholder="ta@example.com"
          className={inputClass}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="password" className="mb-2">
          Нууц үг *
        </Label>
        <Input
          {...register("password")}
          type="password"
          placeholder="••••••••"
          className={inputClass}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="confirmPassword" className="mb-2">
          Нууц үг давтах *
        </Label>
        <Input
          {...register("confirmPassword")}
          type="password"
          placeholder="••••••••"
          className={inputClass}
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mt-1">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="companyName" className="mb-1">
          Компаний нэр *
        </Label>
        <p className="text-white text-[13px] mb-2">Латинаар бичнэ үү</p>
        <Input
          {...register("companyName")}
          placeholder="Компаний нэр"
          className={inputClass}
        />
        {errors.companyName && (
          <p className="text-red-500 text-sm mt-1">
            {errors.companyName.message}
          </p>
        )}
      </div>
    </div>
  );
};
