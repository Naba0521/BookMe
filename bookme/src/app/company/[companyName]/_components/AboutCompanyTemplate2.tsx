" use client ";
import { motion } from "framer-motion";
import { Company } from "./CompanyTypes";
import { MapPin, Phone, Sparkles, Star } from "lucide-react";

export const AboutCompanyTemplate2 = ({ company }: { company: Company }) => {
  return (
    <section className="relative py-24 overflow-hidden" id="about">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-rose-400/20 to-purple-600/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-cyan-600/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-br from-emerald-400/20 to-teal-600/20 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-rose-400 via-purple-500 to-cyan-500 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-all duration-700 animate-pulse"></div>
            <div className="relative overflow-hidden rounded-3xl shadow-2xl transform transition-all duration-700 hover:scale-105 hover:rotate-1">
              <img
                src={company.aboutUsImage}
                alt="Company Image"
                className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-500/10 to-purple-500/10 rounded-full border border-rose-200/30">
                <Sparkles className="w-4 h-4 text-rose-500" />
                <span className="text-rose-600 font-semibold tracking-wider uppercase text-sm">
                  Бидний тухай
                </span>
                <Sparkles className="w-4 h-4 text-rose-500" />
              </div>

              <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-200 via-white to-gray-300 bg-clip-text text-transparent leading-tight">
                {company.companyName}
              </h2>
            </div>

            <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
              <p className="text-xl">{company.description}</p>
              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                <MapPin className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                <span>{company.address}</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                <Phone className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>{company.phoneNumber}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
