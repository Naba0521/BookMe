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
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
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
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cmVjdCB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIGZpbGw9IiMwMDAwMDAiLz48cGF0aCBkPSJNMCAwTDYwIDBNNjAgMEwwIDYwIiBzdHJva2U9IiMxMTExMTEiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] opacity-10"></div>
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gray-800 rounded-full blur-[100px] opacity-5"></div>
          <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-gray-800 rounded-full blur-[100px] opacity-5"></div>
        </div>
      )}
      {isPreview && (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
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

      <main className="relative z-10 space-y-8 pb-20 pt-4">
        <AboutCompanyTemplate2 company={data} />

        <CompanyWorkingHoursTemplate2 company={data} />

        {hasEmployees && <CompanyEmployeeTemplate2 company={data} />}

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
