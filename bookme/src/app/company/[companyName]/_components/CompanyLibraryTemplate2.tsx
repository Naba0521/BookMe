"use client";

import { BlurFade } from "@/components/magicui/blur-fade";
import { Company } from "./CompanyTypes";

export const CompanyLibraryTemplate2 = ({ company }: { company: Company }) => {
  return (
    <section id="photos" className=" py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Бидний зураг
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Сүүлийн үеийн бүтээл болон манай орчин
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-6 max-w-7xl mx-auto">
        {(company.companyImages || []).slice(0, 6).map((imageUrl, idx) => (
          <BlurFade key={imageUrl} delay={0.25 + idx * 0.05} inView>
            <div className="overflow-hidden rounded-xl shadow-lg hover:scale-105 transition-transform">
              <img
                className="w-full h-[350px] object-cover"
                src={imageUrl}
                alt={`Image ${idx + 1}`}
              />
            </div>
          </BlurFade>
        ))}
      </div>
    </section>
  );
};
