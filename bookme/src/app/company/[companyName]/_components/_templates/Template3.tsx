"use client";
import React, { useState, useEffect } from "react";
import { Company } from "../CompanyTypes";
import { CompanyLocation } from "../CompanyLocation";
import { CompanyFooter } from "../CompanyFooter";
import { GlobalStyles } from "../GlobalStyles";
import Image from "next/image";
import { Heart, Mail, MapPin } from "lucide-react";
import { Template3WorkingHours } from "../Template3WorkingHours";
import { CompanyNavBarTemplate3 } from "../CompanyNavBarTemplate3";
import Link from "next/link";

interface MinimalTemplateProps {
  data: Company;
  isPreview?: boolean;
}

export const Template3: React.FC<MinimalTemplateProps> = ({
  data,
  isPreview = false,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [companyLocation, setCompanyLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    if (!isPreview) {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 50);
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [isPreview]);

  useEffect(() => {
    if (data?.lat && data?.lng) {
      setCompanyLocation({ lat: data.lat, lng: data.lng });
    } else if (data?.address) {
      setCompanyLocation({ lat: 47.9185, lng: 106.9176 });
    }
  }, [data]);

  const BookButton = ({ className = "" }: { className?: string }) => (
    <Link href={`${data.companyName}/order`}>
      <button
        className={`w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:shadow-lg shadow-blue-500/20 text-center font-semibold relative overflow-hidden group ${className}`}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          <Heart className="w-5 h-5" fill="currentColor" />
          Цаг захиалах
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </button>
    </Link>
  );

  return (
    <div
      className={`min-h-screen bg-white relative overflow-x-hidden ${
        isPreview ? "pointer-events-none" : ""
      }`}
    >
      {!isPreview && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)
              `,
              backgroundSize: "40px 40px",
            }}
          ></div>
          <div className="absolute top-20 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200/50 to-transparent"></div>
        </div>
      )}

      <CompanyNavBarTemplate3
        company={data}
        isScrolled={isScrolled}
        isMenuOpen={isMenuOpen}
        toggleMenu={() => setIsMenuOpen(!isMenuOpen)}
      />

      {data?.backGroundImage && (
        <div className="relative h-[500px] w-[80%] m-auto mt-16">
          <Image
            src={data.backGroundImage}
            alt="Company Cover"
            layout="fill"
            objectFit="cover"
            className="object-cover object-center rounded-2xl"
            priority
          />
        </div>
      )}

      <div className="lg:hidden px-4 sm:px-6 mt-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-4">
            {data.companyName}
          </h1>

          <p className="text-gray-600 leading-relaxed mb-6">
            company.description
          </p>

          <div className="space-y-3 mb-6">
            {data.email && (
              <div className="flex items-center gap-3 text-gray-700">
                <Mail className="w-5 h-5 text-blue-500" />
                <a
                  href={`mailto:${data.email}`}
                  className="hover:text-blue-600 transition-colors"
                >
                  {data.email}
                </a>
              </div>
            )}
            {data.address && (
              <div className="flex items-start gap-3 text-gray-700">
                <MapPin className="w-5 h-5 text-blue-500 mt-0.5" />
                <span>{data.address}</span>
              </div>
            )}
          </div>

          <BookButton />

          <div className="grid grid-cols-2 gap-4 text-center pt-6 border-t border-gray-100 mt-6">
            {[
              { number: data.clientNumber, label: "Хэрэглэгч" },
              { number: data.experience, label: "Жил" },
            ].map((stat) => (
              <div key={stat.label} className="p-2">
                <div className="text-xl font-bold text-gray-900">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 sm:px-6 lg:px-8 py-12 max-w-7xl mx-auto -mt-18 z-20">
        <div className="lg:col-span-2 space-y-10 z-20">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
            <Template3WorkingHours company={data} />
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
            <CompanyLocation company={data} companyLocation={companyLocation} />
          </div>
        </div>

        <div className="hidden lg:block sticky top-6 h-fit space-y-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
            {data.companyName}
          </h1>

          <p className="text-lg text-gray-600 leading-relaxed">
            {data.description}
          </p>

          <div className="space-y-3 pt-2">
            {data.email && (
              <div className="flex items-center gap-3 text-gray-700">
                <Mail className="w-5 h-5 text-blue-500" />
                <a
                  href={`mailto:${data.email}`}
                  className="hover:text-blue-600 transition-colors"
                >
                  {data.email}
                </a>
              </div>
            )}
            {data.address && (
              <div className="flex items-start gap-3 text-gray-700">
                <MapPin className="w-5 h-5 text-blue-500 mt-0.5" />
                <span>{data.address}</span>
              </div>
            )}
          </div>

          <div className="hidden lg:block">
            <BookButton className="mt-4" />
          </div>

          <div className="grid grid-cols-3 gap-4 text-center pt-6 border-t border-gray-100 mt-6">
            {[
              { number: data.clientNumber, label: "Хэрэглэгч" },
              { number: data.experience, label: "Жил" },
            ].map((stat) => (
              <div key={stat.label} className="p-2">
                <div className="text-2xl font-bold text-gray-900">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="relative bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16">
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CompanyFooter companyName={data.companyName} />
        </div>
      </footer>

      <GlobalStyles />
    </div>
  );
};
