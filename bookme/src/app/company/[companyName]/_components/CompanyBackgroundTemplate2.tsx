"use client";

import { Calendar, ChevronDown, Heart, Sparkles } from "lucide-react";
import { Company } from "./CompanyTypes";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export const CompanyBackgroundTemplate2 = ({
  companyName,
  company,
}: {
  companyName: string;
  company: Company;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    setIsVisible(true);

    if (company.companyImages && company.companyImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) =>
          prev === company.companyImages.length - 1 ? 0 : prev + 1
        );
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [company.companyImages]);

  return (
    <section className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0">
        {company.backGroundImage ? (
          <div className="relative w-full h-full">
            {company.backGroundImage && (
              <Image
                src={company.backGroundImage}
                alt={`${companyName} background`}
                fill
                sizes="100vw"
                className="object-cover object-center"
                priority
                quality={85}
              />
            )}
          </div>
        ) : (
          <div className="w-full h-full bg-gray-900" />
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/60"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center">
        <div className="max-w-9xl mx-auto px-6 sm:px-8 lg:px-12 w-full ">
          <div className="grid lg:grid-cols-2 gap-20 items-center mb-30">
            <div className="space-y-8 text-center lg:text-left">
              <div
                className={`inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 transition-all duration-700 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                <Sparkles className="w-5 h-5 text-yellow-400" />
                <span className="text-white font-semibold tracking-wider uppercase text-sm">
                  онлайн цаг захиалга
                </span>
                <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-grey-500 rounded-full animate-pulse"></div>
              </div>

              <div className="space-y-4">
                <h1
                  className={`text-4xl md:text-5xl lg:text-6xl font-bold leading-tight transition-all duration-1000 delay-200 ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-12"
                  }`}
                >
                  <span className="block text-white">{companyName}</span>
                  <span className="block text-3xl md:text-4xl lg:text-5xl bg-gradient-to-r from-blue-400 via-white-500 to-black-500 bg-clip-text text-transparent mt-2">
                    компанийн хуудас
                  </span>
                </h1>
              </div>

              <p
                className={`text-xs md:text-xl text-gray-200 leading-relaxed max-w-2xl transition-all duration-1000 delay-400 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                Өндөр зэрэглэлийн мэргэжлийн үйлчилгээ,
                <span className="text-transparent bg-gradient-to-r from-blue-400 to-blue-400 bg-clip-text font-semibold">
                  таны цагийг хэмнэх ухаалаг бизнес
                </span>
              </p>

              <div
                className={`flex flex-col sm:flex-row gap-4 sm:gap-6 pt-4 transition-all duration-1000 delay-600 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                <Link href={`${companyName}/order`}>
                  <button className="group relative px-4 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg sm:rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02] sm:hover:scale-105 hover:shadow-md sm:hover:shadow-lg hover:shadow-blue-500/20 w-full sm:w-auto cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                    <div className="relative z-10 flex items-center justify-center gap-2 text-white font-medium sm:font-bold text-sm sm:text-base">
                      <Heart className="w-4 h-4 sm:w-5 sm:h-5 group-hover:animate-pulse" />
                      Цаг захиалах
                    </div>
                  </button>
                </Link>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div
                className={`relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl transform transition-all duration-1000 delay-1000 ${
                  isVisible
                    ? "opacity-100 translate-x-0 rotate-0"
                    : "opacity-0 translate-x-12 rotate-6"
                }`}
              >
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <Calendar className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        Онлайн захиалга
                      </h3>
                      <p className="text-gray-300">24/7 боломжтой</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/10 rounded-xl text-center">
                      <div className="text-2xl font-bold text-white">
                        {company.workingHours.monday.open}
                      </div>
                      <div className="text-gray-300 text-sm">Нээлт</div>
                    </div>
                    <div className="p-4 bg-white/10 rounded-xl text-center">
                      <div className="text-2xl font-bold text-white">
                        {company.workingHours.monday.close}
                      </div>
                      <div className="text-gray-300 text-sm">Хаалт</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-1000 delay-1600 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="flex flex-col items-center gap-2 animate-bounce">
          <span className="text-white/70 text-sm font-medium">
            Доошоо скролл хийх
          </span>
          <ChevronDown className="w-6 h-6 text-white/70" />
        </div>
      </div>
    </section>
  );
};
