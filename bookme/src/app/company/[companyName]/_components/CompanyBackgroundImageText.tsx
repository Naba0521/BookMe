"use client";

import { Heart, Sparkles } from "lucide-react";
import { Company } from "./CompanyTypes";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export const CompanyBackgroundImageText = ({
  companyName,
  company,
}: {
  companyName: string;
  company: Company;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
  function splitCamelCase(str: string): string {
    return str.replace(/([a-z])([A-Z])/g, "$1 $2");
  }

  return (
    <section className="relative h-[800px] flex flex-col items-center justify-center overflow-hidden">
      <Image
        src={company.backGroundImage}
        alt={`${companyName} background`}
        fill
        sizes="100vw"
        className="object-cover object-center"
        priority
        quality={85}
      />

      <div className="absolute inset-0 bg-black/30 z-10" />

      <div className="relative z-20 min-h-screen flex items-center w-full">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 text-center lg:text-left">
              <motion.div
                initial="hidden"
                animate={isVisible ? "visible" : "hidden"}
                variants={fadeInUp}
                transition={{ duration: 0.7 }}
                className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20"
              >
                <Sparkles className="w-5 h-5 text-yellow-400" />
                <span className="text-white font-semibold tracking-wider uppercase text-sm">
                  онлайн цаг захиалга
                </span>
                <div className="w-2 h-2 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full animate-pulse" />
              </motion.div>

              <motion.div
                initial="hidden"
                animate={isVisible ? "visible" : "hidden"}
                variants={fadeInUp}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-4"
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="block text-white ">
                    {splitCamelCase(companyName)}
                  </span>
                  <span className="block text-2xl md:text-3xl lg:text-4xl bg-gradient-to-r from-rose-400 via-pink-500 to-purple-500 bg-clip-text text-transparent mt-2">
                    компанийн хуудас
                  </span>
                </h1>
              </motion.div>

              <motion.p
                initial="hidden"
                animate={isVisible ? "visible" : "hidden"}
                variants={fadeInUp}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xs md:text-xl text-gray-200 leading-relaxed"
              >
                Өндөр зэрэглэлийн мэргэжлийн үйлчилгээ,
                <span className="text-transparent bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text font-semibold">
                  таны цагийг хэмнэх ухаалаг бизнес
                </span>
              </motion.p>

              <motion.div
                initial="hidden"
                animate={isVisible ? "visible" : "hidden"}
                variants={fadeInUp}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-4"
              >
                <Link href={`${companyName}/order`}>
                  <button className="group relative px-5 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-rose-500 to-pink-600 rounded-xl sm:rounded-2xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02] sm:hover:scale-105 hover:shadow-lg sm:hover:shadow-2xl hover:shadow-rose-500/25 w-auto cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-rose-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                    <div className="relative z-10 flex items-center justify-center gap-2 sm:gap-3 text-white font-semibold sm:font-bold text-sm sm:text-lg">
                      <Heart className="w-5 h-5 sm:w-6 sm:h-6 group-hover:animate-pulse" />
                      Цаг захиалах
                    </div>
                  </button>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
