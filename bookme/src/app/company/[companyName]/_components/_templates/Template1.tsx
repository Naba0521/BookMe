"use client";
import React, { useState, useEffect } from "react";
import { Company } from "../CompanyTypes";
import { CompanyNavBar } from "../CompanyNavBar";
import { CompanyBackgroundImageText } from "../CompanyBackgroundImageText";
import { AboutCompany } from "../AboutCompany";
import { CompanyWorkingHours } from "../CompanyWorkingHours";
import { EmployeeCardColorfulList } from "../CompanyEmployeeCard";
import { CompanyLocation } from "../CompanyLocation";
import { CompanyLibrary } from "../CompanyLibrary";
import { CompanyFooter } from "../CompanyFooter";
import { GlobalStyles } from "../GlobalStyles";
import { useCompanyAuth } from "@/app/_providers/CompanyAuthProvider";

interface ModernTemplateProps {
  data: Company;
  companyName: string;
  isPreview?: boolean;
}

export const Template1: React.FC<ModernTemplateProps> = ({
  data,
  companyName,
  isPreview = false,
}) => {
  const { company: loggedInCompany } = useCompanyAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
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
    if (!isPreview) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const index = parseInt(
                entry.target.getAttribute("data-index") || "0"
              );
              setVisibleCards((prev) => [...prev, index]);
            }
          });
        },
        { threshold: 0.1 }
      );

      const cards = document.querySelectorAll("[data-index]");
      cards.forEach((card) => observer.observe(card));

      return () => observer.disconnect();
    }
  }, [isPreview]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    if (data) {
      if (data.lat && data.lng) {
        setCompanyLocation({
          lat: data.lat,
          lng: data.lng,
        });
      } else if (data.address) {
        setCompanyLocation({
          lat: 47.9185,
          lng: 106.9176,
        });
      }
    }
  }, [data]);

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 relative overflow-x-hidden ${
        isPreview ? "pointer-events-none" : ""
      }`}
    >
      {!isPreview && (
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute w-32 h-32 rounded-full top-20 left-10 bg-pink-200/30 blur-xl animate-pulse"></div>
          <div className="absolute w-24 h-24 delay-1000 rounded-full top-40 right-20 bg-purple-200/30 blur-xl animate-pulse"></div>
          <div className="absolute w-40 h-40 rounded-full bottom-40 left-20 bg-rose-200/30 blur-xl animate-pulse delay-2000"></div>
          <div className="absolute rounded-full bottom-20 right-10 w-28 h-28 bg-pink-300/30 blur-xl animate-pulse delay-3000"></div>
        </div>
      )}

      <CompanyNavBar
        company={data}
        isScrolled={isScrolled}
        isMenuOpen={isMenuOpen}
        toggleMenu={toggleMenu}
      />

      <CompanyBackgroundImageText companyName={companyName} company={data} />

      <AboutCompany company={data} />

      {data.workingHours && <CompanyWorkingHours company={data} />}

      {data.employees && data.employees.length > 0 ? (
        <EmployeeCardColorfulList company={data} />
      ) : // Only show the warning if company is logged in (not for regular users)
      loggedInCompany && loggedInCompany._id === data._id ? (
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
                Танай компанид ажилтнууд нэмэгдээгүй байна. Хяналтын самбар руу
                орж ажилтнуудаа нэмээрэй.
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <a
                  href={`/company/${companyName}/dashboard`}
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
      ) : null}

      <CompanyLocation company={data} companyLocation={companyLocation} />

      {data.companyImages && data.companyImages.length > 0 && (
        <CompanyLibrary company={data} />
      )}

      <footer className="bg-gray-900 text-white py-12 h-[450px]">
        <CompanyFooter companyName={companyName} />
      </footer>

      <GlobalStyles />
    </div>
  );
};
