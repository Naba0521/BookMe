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
          <div className="absolute top-20 left-10 w-32 h-32 bg-pink-200/30 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-purple-200/30 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-40 left-20 w-40 h-40 bg-rose-200/30 rounded-full blur-xl animate-pulse delay-2000"></div>
          <div className="absolute bottom-20 right-10 w-28 h-28 bg-pink-300/30 rounded-full blur-xl animate-pulse delay-3000"></div>
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

      {data.employees && data.employees.length > 0 && (
        <EmployeeCardColorfulList company={data} />
      )}

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
