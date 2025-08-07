"use client";
import { Instagram, Facebook, Twitter, Heart } from "lucide-react";

type CompanyFooterProps = {
  companyName: string;
};

export const CompanyFooterTemplate2 = ({ companyName }: CompanyFooterProps) => {
  return (
    <section
      className="w-full relative py-12 sm:py-16 md:py-20 overflow-hidden"
      id="contact"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center space-y-6 sm:space-y-8">
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-200 via-blue-800 to-cyan-400 bg-clip-text text-transparent leading-tight">
              {companyName}
            </h2>
            <div className="w-16 sm:w-20 md:w-24 h-1 bg-gradient-to-r from-blue-400 to-blue-800 mx-auto rounded-full"></div>
          </div>

          <p className="text-gray-400 text-base sm:text-xs md:text-xl max-w-xl sm:max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
            Олон хэрэглэгчээр сайшаагдсан, найдвартай үйлчилгээ
          </p>

          <div className="flex justify-center items-center space-x-4 sm:space-x-6 md:space-x-8">
            {[
              {
                Icon: Instagram,
                color: "from-pink-500 to-rose-500",
                hover: "hover:from-pink-400 hover:to-rose-400",
                label: "Instagram",
              },
              {
                Icon: Facebook,
                color: "from-blue-500 to-blue-600",
                hover: "hover:from-blue-400 hover:to-blue-500",
                label: "Facebook",
              },
              {
                Icon: Twitter,
                color: "from-cyan-500 to-blue-500",
                hover: "hover:from-cyan-400 hover:to-blue-400",
                label: "Twitter",
              },
            ].map(({ Icon, color, hover, label }, index) => (
              <div
                key={index}
                className={`group relative p-3 sm:p-4 bg-gradient-to-r ${color} rounded-xl sm:rounded-2xl shadow-lg ${hover} transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 sm:hover:-translate-y-2 cursor-pointer touch-manipulation`}
                role="button"
                tabIndex={0}
                aria-label={label}
              >
                <Icon className="text-white w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                <div className="absolute inset-0 bg-white/20 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>

          <div className="pt-6 sm:pt-8 border-t border-gray-700">
            <p className="text-gray-500 text-xs sm:text-sm px-4 sm:px-0">
              © 2024 {companyName}. Бүх эрх хуулиар хамгаалагдсан.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
