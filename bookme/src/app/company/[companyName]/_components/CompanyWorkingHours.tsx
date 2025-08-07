"use client";

import { motion } from "framer-motion";
import {
  Company,
  dayLabels,
  DaySchedule,
  WorkingHoursType,
} from "./CompanyTypes";

export const CompanyWorkingHours = ({ company }: { company: Company }) => {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ажлын цаг
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Бидний нээлттэй цагууд
          </p>
        </div>

        <div className="w-full max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {company.workingHours &&
            (
              Object.entries(company.workingHours) as [
                keyof WorkingHoursType,
                DaySchedule
              ][]
            )
              .slice(0, 7)
              .map(([day, hours], index) => (
                <motion.div
                  key={day}
                  className="text-center p-4 bg-white rounded-lg shadow-md"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <p className="font-bold text-gray-700 mb-2">
                    {dayLabels[day] || day}
                  </p>
                  {hours.closed ? (
                    <p className="text-red-500 font-medium">Хаалттай</p>
                  ) : (
                    <div className="space-y-1">
                      <p className="text-gray-600">
                        Нээх: {hours.open || "N/A"}
                      </p>
                      <p className="text-gray-600">
                        Хаах: {hours.close || "N/A"}
                      </p>
                    </div>
                  )}
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  );
};
