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
import { EmployeeCardColorfulList } from "../CompanyEmployeeCard";
import { useCompanyAuth } from "@/app/_providers/CompanyAuthProvider";
import Link from "next/link";

interface MinimalTemplateProps {
  data: Company;
  isPreview?: boolean;
}

export const Template3: React.FC<MinimalTemplateProps> = ({
  data,
  isPreview = false,
}) => {
  const { company: loggedInCompany } = useCompanyAuth();
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
        <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-blue-600 to-blue-700 group-hover:opacity-100"></div>
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
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
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
          <div className="absolute left-0 right-0 h-px top-20 bg-gradient-to-r from-transparent via-gray-200/50 to-transparent"></div>
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

      <div className="px-4 mt-6 lg:hidden sm:px-6">
        <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl">
          <h1 className="mb-4 text-2xl font-bold tracking-tight text-gray-900">
            {data.companyName}
          </h1>

          <p className="mb-6 leading-relaxed text-gray-600">
            company.description
          </p>

          <div className="mb-6 space-y-3">
            {data.email && (
              <div className="flex items-center gap-3 text-gray-700">
                <Mail className="w-5 h-5 text-blue-500" />
                <a
                  href={`mailto:${data.email}`}
                  className="transition-colors hover:text-blue-600"
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

          <div className="grid grid-cols-2 gap-4 pt-6 mt-6 text-center border-t border-gray-100">
            {[
              { number: data.clientNumber, label: "Хэрэглэгч" },
              { number: data.experience, label: "Жил" },
            ].map((stat) => (
              <div key={stat.label} className="p-2">
                <div className="text-xl font-bold text-gray-900">
                  {stat.number}
                </div>
                <div className="mt-1 text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="z-20 grid grid-cols-1 gap-8 px-4 py-12 mx-auto lg:grid-cols-3 sm:px-6 lg:px-8 max-w-7xl -mt-18">
        <div className="z-20 space-y-10 lg:col-span-2">
          <div className="overflow-hidden transition-shadow duration-300 bg-white border border-gray-100 shadow-sm rounded-2xl hover:shadow-md">
            <Template3WorkingHours company={data} />
          </div>

          {data.employees && data.employees.length > 0 ? (
            <div className="overflow-hidden transition-shadow duration-300 bg-white border border-gray-100 shadow-sm rounded-2xl hover:shadow-md">
              <EmployeeCardColorfulList company={data} />
            </div>
          ) : // Only show the warning if company is logged in (not for regular users)
          loggedInCompany && loggedInCompany._id === data._id ? (
            <div className="overflow-hidden transition-shadow duration-300 bg-white border border-gray-100 shadow-sm rounded-2xl hover:shadow-md">
              <div className="px-4 py-16">
                <div className="max-w-4xl mx-auto text-center">
                  <div className="p-8 bg-white border border-gray-100 shadow-lg rounded-2xl">
                    <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-blue-100 rounded-full">
                      <svg
                        className="w-8 h-8 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="mb-4 text-2xl font-bold text-gray-900">
                      Ажилтнууд нэмэх шаардлагатай
                    </h3>
                    <p className="max-w-md mx-auto mb-6 text-gray-600">
                      Танай компанид ажилтнууд нэмэгдээгүй байна. Хяналтын
                      самбар руу орж ажилтнуудаа нэмээрэй.
                    </p>
                    <div className="flex flex-col justify-center gap-4 sm:flex-row">
                      <a
                        href={`/company/${data.companyName}/dashboard`}
                        className="inline-flex items-center px-6 py-3 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                      >
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        Хяналтын самбар
                      </a>
                      <button
                        onClick={() => window.location.reload()}
                        className="inline-flex items-center px-6 py-3 font-medium text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
                      >
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                        Дахин шалгах
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          <div className="overflow-hidden transition-shadow duration-300 bg-white border border-gray-100 shadow-sm rounded-2xl hover:shadow-md">
            <CompanyLocation company={data} companyLocation={companyLocation} />
          </div>
        </div>

        <div className="sticky hidden p-6 space-y-6 bg-white border border-gray-100 shadow-sm lg:block top-6 h-fit rounded-2xl lg:p-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 lg:text-4xl">
            {data.companyName}
          </h1>

          <p className="text-lg leading-relaxed text-gray-600">
            {data.description}
          </p>

          <div className="pt-2 space-y-3">
            {data.email && (
              <div className="flex items-center gap-3 text-gray-700">
                <Mail className="w-5 h-5 text-blue-500" />
                <a
                  href={`mailto:${data.email}`}
                  className="transition-colors hover:text-blue-600"
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

          <div className="grid grid-cols-3 gap-4 pt-6 mt-6 text-center border-t border-gray-100">
            {[
              { number: data.clientNumber, label: "Хэрэглэгч" },
              { number: data.experience, label: "Жил" },
            ].map((stat) => (
              <div key={stat.label} className="p-2">
                <div className="text-2xl font-bold text-gray-900">
                  {stat.number}
                </div>
                <div className="mt-1 text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="relative py-16 text-white bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
        <div className="relative z-10 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <CompanyFooter companyName={data.companyName} />
        </div>
      </footer>

      <GlobalStyles />
    </div>
  );
};
