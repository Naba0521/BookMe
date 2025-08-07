"use client";

import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { FullSchemaType } from "./Schemas";

type Step3Props = {
  dayLabels: Record<string, string>;
};

export const Step3 = ({ dayLabels }: Step3Props) => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<FullSchemaType>();

  const openingHours = watch("openingHours");
  const lunchBreak = watch("lunchBreak");

  const days = Object.keys(openingHours) as Array<keyof typeof openingHours>;

  return (
    <div className="space-y-6 text-white p-6 rounded-lg max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Ажлын цаг</h2>

      <div className="space-y-3">
        {days.map((day) => (
          <div
            key={day}
            className="flex flex-wrap sm:flex-nowrap items-center gap-3"
          >
            <div className="w-24 capitalize font-medium">{dayLabels[day]}</div>

            <Input
              type="time"
              {...register(`openingHours.${day}.open`)}
              disabled={openingHours[day]?.closed}
              className="w-28 bg-white/10 text-white border-white"
            />

            <span className="text-white">→</span>

            <Input
              type="time"
              {...register(`openingHours.${day}.close`)}
              disabled={openingHours[day]?.closed}
              className="w-28 bg-white/10 text-white border-white"
            />
            <label className="flex items-center gap-2 ml-2">
              <input
                type="checkbox"
                {...register(`openingHours.${day}.closed`)}
              />
              Амарна
            </label>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold mt-8">Цайны цаг</h2>
      <div className="flex items-center gap-3">
        <span className="w-24">Эхлэх</span>
        <Input
          type="time"
          {...register("lunchBreak.start")}
          className="w-28 bg-white/10 text-white border-white"
        />

        <span className="text-white">→</span>

        <Input
          type="time"
          {...register("lunchBreak.end")}
          className="w-28 bg-white/10 text-white border-white"
        />
      </div>
    </div>
  );
};
