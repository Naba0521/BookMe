"use client";

import { motion } from "framer-motion";
import {
  Company,
  dayLabels,
  DaySchedule,
  WorkingHoursType,
} from "./CompanyTypes";

export const Template3WorkingHours = ({ company }: { company: Company }) => {
  return (
    <>
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Ажлын цаг
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Бидний нээлттэй цагууд
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="overflow-x-auto"
          >
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  {company.workingHours &&
                    (
                      Object.entries(company.workingHours) as [
                        keyof WorkingHoursType,
                        DaySchedule
                      ][]
                    )
                      .slice(0, 7)
                      .map(([day]) => (
                        <th
                          key={day}
                          className="py-3 px-4 text-sm font-medium text-gray-700 text-center border-b"
                        >
                          {dayLabels[day] || day}
                        </th>
                      ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {company.workingHours &&
                    (
                      Object.entries(company.workingHours) as [
                        keyof WorkingHoursType,
                        DaySchedule
                      ][]
                    )
                      .slice(0, 7)
                      .map(([day, hours]) => (
                        <td
                          key={day}
                          className="py-4 px-4 text-center border-b"
                        >
                          {hours.closed ? (
                            <span className="text-red-500 font-medium">
                              Хаалттай
                            </span>
                          ) : (
                            <div className="flex flex-col space-y-1">
                              <span className="text-gray-700">
                                {hours.open || "N/A"}
                              </span>
                              <span className="text-gray-400 text-xs">-</span>
                              <span className="text-gray-700">
                                {hours.close || "N/A"}
                              </span>
                            </div>
                          )}
                        </td>
                      ))}
                </tr>
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>
    </>
  );
};
