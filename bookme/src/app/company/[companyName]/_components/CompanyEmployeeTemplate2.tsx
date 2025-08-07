import React from "react";
import { Star, Calendar, Award, Heart, Sparkles, Clock } from "lucide-react";
import { Company, Employee } from "./CompanyTypes";
import Link from "next/link";

const gradientBackgrounds = ["from-blue-400 via-cyan-500 to-teal-600"];

const cardColors = [
  {
    primary: "from-blue-500 to-cyan-600",
    secondary: "from-blue-100 to-cyan-100",
    accent: "pink",
  },
  {
    primary: "from-blue-500 to-cyan-600",
    secondary: "from-blue-100 to-cyan-100",
    accent: "blue",
  },
  {
    primary: "from-blue-500 to-cyan-600",
    secondary: "from-blue-100 to-cyan-100",
    accent: "green",
  },
  {
    primary: "from-blue-500 to-cyan-600",
    secondary: "from-blue-100 to-cyan-100",
    accent: "purple",
  },
];
const EmployeeCard = ({
  employee,
  index,
  company,
}: {
  employee: Employee;
  index: number;
  company: Company;
}) => {
  const colorScheme = cardColors[index % 4];
  const bgGradient = gradientBackgrounds[index % 4];

  return (
    <div className="group relative w-[300px] mx-auto">
      <div
        className={`absolute -inset-1 bg-gradient-to-r ${colorScheme.primary} rounded-3xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200`}
      />
      <div className="relative bg-white rounded-3xl overflow-hidden shadow-xl transform transition-all duration-500 hover:scale-105 hover:-translate-y-2">
        <div className="relative overflow-hidden">
          <img
            className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-110"
            src={
              employee.profileImage ||
              "https://images.unsplash.com/photo-1494790108755-2616c9c9b7d2"
            }
            alt={employee.employeeName}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-400 fill-current" />
            <span className="text-xs font-bold text-gray-800">4.9</span>
          </div>
          <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm rounded-full px-2 py-0.5">
            <span className="text-[10px] font-semibold text-white">5+ жил</span>
          </div>
        </div>

        <div className="p-3 space-y-2">
          <div className="flex items-center justify-center gap-1">
            <Sparkles className={`w-4 h-4 text-${colorScheme.accent}-500`} />
            <h3
              className={`text-lg font-bold bg-gradient-to-r ${colorScheme.primary} bg-clip-text text-transparent truncate`}
            >
              {employee.employeeName}
            </h3>
            <Sparkles className={`w-4 h-4 text-${colorScheme.accent}-500`} />
          </div>

          <p className="text-gray-600 text-center text-sm leading-snug line-clamp-2">
            {employee.description}
          </p>
          <div className="flex justify-center gap-3">
            <div className="text-center">
              <div
                className={`w-8 h-8 rounded-full bg-gradient-to-r ${colorScheme.secondary} flex items-center justify-center mx-auto mb-0.5`}
              >
                <Heart className={`w-4 h-4 text-${colorScheme.accent}-600`} />
              </div>
              <span className="text-[10px] text-gray-500 block">
                200+ үйлчлэгч
              </span>
            </div>
            <div className="text-center">
              <div
                className={`w-8 h-8 rounded-full bg-gradient-to-r ${colorScheme.secondary} flex items-center justify-center mx-auto mb-0.5`}
              >
                <Award className={`w-4 h-4 text-${colorScheme.accent}-600`} />
              </div>
              <span className="text-[10px] text-gray-500 block">Мастер</span>
            </div>
            <div className="text-center">
              <div
                className={`w-8 h-8 rounded-full bg-gradient-to-r ${colorScheme.secondary} flex items-center justify-center mx-auto mb-0.5`}
              >
                <Clock className={`w-4 h-4 text-${colorScheme.accent}-600`} />
              </div>
              <span className="text-[10px] text-gray-500 block">Боломжтой</span>
            </div>
          </div>
          <Link href={`/company/${company.companyName}/order`}>
            <button
              className={`w-full py-2 rounded-xl bg-gradient-to-r ${colorScheme.primary} text-white font-semibold text-sm shadow-md hover:shadow-lg transition duration-300 cursor-pointer`}
            >
              <div className="flex items-center justify-center gap-1">
                <Calendar className="w-4 h-4" />
                Захиалах
              </div>
            </button>
          </Link>
        </div>

        <div className="absolute top-0 left-0 w-16 h-16 opacity-10">
          <div
            className={`w-full h-full rounded-full bg-gradient-to-br ${bgGradient}`}
          />
        </div>
        <div className="absolute bottom-0 right-0 w-14 h-14 opacity-10">
          <div
            className={`w-full h-full rounded-full bg-gradient-to-br ${bgGradient}`}
          />
        </div>
      </div>
    </div>
  );
};

export const CompanyEmployeeTemplate2 = ({ company }: { company: Company }) => {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="text-center mt-16">
        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent mb-4">
          Манай Баг
        </h2>
        <p className="text-gray-600 max-w-xs sm:max-w-2xl mx-auto sm:text-base lg:text-lg sm:leading-normal">
          Мэргэжлийн багийнхан таны хэрэгцээг хангахад бэлэн
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-15 px-4 py-12 max-w-7xl mx-auto">
        {company.employees?.map((employee, index) => (
          <EmployeeCard
            key={employee._id}
            employee={employee}
            index={index}
            company={company}
          />
        ))}
      </div>
    </div>
  );
};
