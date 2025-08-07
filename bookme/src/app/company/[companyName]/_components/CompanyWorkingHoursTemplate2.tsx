"use client";

import { motion } from "framer-motion";
import {
  Company,
  dayLabels,
  DaySchedule,
  WorkingHoursType,
} from "./CompanyTypes";
import { Clock } from "lucide-react";

export const CompanyWorkingHoursTemplate2 = ({
  company,
}: {
  company: Company;
}) => {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent mb-4">
            Ажлын Цаг
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Бидний нээлттэй цагууд
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
          {Object.entries(company.workingHours || {})
            .slice(0, 7)
            .map(([day, hours], index) => (
              <div
                key={index}
                className="group relative p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl hover:bg-white/15 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2"
              >
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative text-center space-y-3">
                  <h3 className="font-bold text-white text-lg">
                    {dayLabels[day] || day}
                  </h3>

                  {hours.closed ? (
                    <div className="space-y-2">
                      <div className="w-12 h-12 mx-auto bg-red-500/20 rounded-full flex items-center justify-center">
                        <Clock className="w-6 h-6 text-red-400" />
                      </div>
                      <p className="text-red-400 font-medium">Хаалттай</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="w-12 h-12 mx-auto bg-emerald-500/20 rounded-full flex items-center justify-center">
                        <Clock className="w-6 h-6 text-emerald-400" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-gray-300 text-sm">
                          <span className="text-emerald-400 font-semibold">
                            Нээх:
                          </span>{" "}
                          {hours.open}
                        </p>
                        <p className="text-gray-300 text-sm">
                          <span className="text-rose-400 font-semibold">
                            Хаах:
                          </span>{" "}
                          {hours.close}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};
