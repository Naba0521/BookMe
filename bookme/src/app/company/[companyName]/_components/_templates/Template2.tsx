"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Company } from "../CompanyTypes";
import { CompanyNavBar } from "../CompanyNavBar";
import { GlobalStyles } from "../GlobalStyles";
import { AboutCompanyTemplate2 } from "../AboutCompanyTemplate2";
import { CompanyWorkingHoursTemplate2 } from "../CompanyWorkingHoursTemplate2";
import { CompanyEmployeeTemplate2 } from "../CompanyEmployeeTemplate2";
import { CompanyLocationTemplate2 } from "../CompanyLocationTemplate2";
import { CompanyLibraryTemplate2 } from "../CompanyLibraryTemplate2";
import { CompanyFooterTemplate2 } from "../CompanyFooterTemplate2";
import { CompanyBackgroundTemplate2 } from "../CompanyBackgroundTemplate2";
import { CompanyNavBarTemplate2 } from "../CompanyNavBarTemplate2";
import { useCompanyAuth } from "@/app/_providers/CompanyAuthProvider";

interface ClassicTemplateProps {
  data: Company;
  companyName: string;
  isPreview?: boolean;
}

export const Template2: React.FC<ClassicTemplateProps> = ({
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

  const hasEmployees = useMemo(
    () => data.employees && data.employees.length > 0,
    [data.employees]
  );
  const hasImages = useMemo(
    () => data.companyImages && data.companyImages.length > 0,
    [data.companyImages]
  );

  // Scroll handler with debounce
  useEffect(() => {
    if (isPreview) return;

    let timeoutId: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsScrolled(window.scrollY > 50);
      }, 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isPreview]);

  // Intersection observer for cards
  useEffect(() => {
    if (isPreview) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(
              entry.target.getAttribute("data-index") || "0",
              10
            );
            setVisibleCards((prev) =>
              prev.includes(index) ? prev : [...prev, index]
            );
          }
        });
      },
      { threshold: 0.1 }
    );

    const cards = document.querySelectorAll("[data-index]");
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, [isPreview]);

  // Location effect
  useEffect(() => {
    if (!data) return;

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
  }, [data]);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const renderDecorativeElements = !isPreview && (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cmVjdCB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIGZpbGw9IiMwMDAwMDAiLz48cGF0aCBkPSJNMCAwTDYwIDBNNjAgMEwwIDYwIiBzdHJva2U9IiMxMTExMTEiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] opacity-10"></div>

      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gray-800 rounded-full blur-[100px] opacity-5"></div>
      <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-gray-800 rounded-full blur-[100px] opacity-5"></div>
    </div>
  );

  return (
    <section
      className={`min-h-screen relative overflow-x-hidden${
        isPreview ? " pointer-events-none" : ""
      }`}
      id="home"
    >
      <div
        className={`${
          isPreview
            ? "absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900"
            : "fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900"
        }`}
      ></div>

      {!isPreview && (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cmVjdCB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIGZpbGw9IiMwMDAwMDAiLz48cGF0aCBkPSJNMCAwTDYwIDBNNjAgMEwwIDYwIiBzdHJva2U9IiMxMTExMTEiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] opacity-10"></div>
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gray-800 rounded-full blur-[100px] opacity-5"></div>
          <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-gray-800 rounded-full blur-[100px] opacity-5"></div>
        </div>
      )}
      {isPreview && (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cmVjdCB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIGZpbGw9IiMwMDAwMDAiLz48cGF0aCBkPSJNMCAwTDYwIDBNNjAgMEwwIDYwIiBzdHJva2U9IiMxMTExMTEiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] opacity-10"></div>
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gray-800 rounded-full blur-[50px] opacity-5"></div>
          <div className="absolute bottom-1/3 right-1/4 w-36 h-36 bg-gray-800 rounded-full blur-[50px] opacity-5"></div>
        </div>
      )}

      {renderDecorativeElements}

      <CompanyNavBarTemplate2
        company={data}
        isScrolled={isScrolled}
        isMenuOpen={isMenuOpen}
        toggleMenu={toggleMenu}
      />

      <CompanyBackgroundTemplate2 companyName={companyName} company={data} />

      <main className="relative z-10 pt-4 pb-20 space-y-8">
        <AboutCompanyTemplate2 company={data} />

        <CompanyWorkingHoursTemplate2 company={data} />

        {hasEmployees ? (
          <CompanyEmployeeTemplate2 company={data} />
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
                  Танай компанид ажилтнууд нэмэгдээгүй байна. Хяналтын самбар
                  руу орж ажилтнуудаа нэмээрэй.
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

        <CompanyLocationTemplate2
          company={data}
          companyLocation={companyLocation}
        />

        <CompanyLibraryTemplate2 company={data} />
      </main>

      <CompanyFooterTemplate2 companyName={companyName} />

      <GlobalStyles />
    </section>
  );
};
