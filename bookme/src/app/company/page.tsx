"use client";
import { api } from "@/axios";
import { useEffect, useRef, useState } from "react";
import { Company } from "./[companyName]/_components/CompanyTypes";
import Image from "next/image";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [search, setSearch] = useState("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const params = useParams();

  useEffect(() => {
    const getCompanies = async () => {
      try {
        const response = await api.get("/company");
        setCompanies(response.data.companies);
      } catch (error) {
        console.error(error);
      }
    };
    getCompanies();
  }, []);

  useEffect(() => {
    if (companies.length === 0) return;
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % companies.length);
    }, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [companies]);

  const filteredCompanies = companies.filter((company) =>
    company.companyName.toLowerCase().startsWith(search.toLowerCase())
  );
  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x < -100) {
      setCurrentIndex((prev) =>
        prev === filteredCompanies.length - 1 ? 0 : prev + 1
      );
    } else if (info.offset.x > 100) {
      setCurrentIndex((prev) =>
        prev === 0 ? filteredCompanies.length - 1 : prev - 1
      );
    }
  };

  return (
    <div className="w-screen h-screen bg-[#f9f9f9] flex flex-col items-center">
      <nav className=" top-0 w-full bg-white/80 backdrop-blur-md z-50 shadow-sm relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <div className="relative w-32 h-10 rounded-full">
                <Image
                  src="/default-logo.jpg"
                  alt="Company Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <div className="hidden md:block">
              <div className="w-[280px] h-10 flex items-center gap-2 px-3 border border-gray-300 rounded-lg shadow-sm bg-white focus-within:ring-2 focus-within:ring-blue-400 transition">
                <Search className="text-gray-500 w-4 h-4" />
                <input
                  placeholder="Компаний нэрээр хайна уу"
                  className="flex-1 border-none outline-none text-sm placeholder-gray-400 w-full"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </nav>
      <div className="w-[534px] h-fit flex flex-col gap-6 mt-[50px]">
        <div className="w-full h-[128px]  px-[30px] justify-center flex flex-col items-center">
          <Image
            src="/default-logo.jpg"
            alt="Company Logo"
            width={40}
            height={40}
          />
          <div className="flex flex-col justify-center items-center">
            <p className="font-semibold text-[20px]">
              Bookme системид бүртгэлтэй компаниуд
            </p>
            <p className="text-gray-500 text-[12px]">
              Өөрийн сонирхсон компани дээр дарж цагаа захиална уу.
            </p>
          </div>
        </div>
        <div className="relative w-full h-[520px] flex items-center justify-center mt-10">
          {filteredCompanies.map((company, i) => {
            const total = filteredCompanies.length;
            const offset = (i - currentIndex + total) % total;
            let xOffset = 0;
            let scale = 1;
            let opacity = 1;
            let zIndex = 10;

            if (offset === 1) {
              xOffset = 100;
              scale = 0.93;
              zIndex = 9;
            } else if (offset === total - 1) {
              xOffset = -100;
              scale = 0.93;
              zIndex = 9;
            } else if (offset === 2) {
              xOffset = 160;
              scale = 0.88;
              opacity = 0.6;
              zIndex = 8;
            } else if (offset === total - 2) {
              xOffset = -160;
              scale = 0.88;
              opacity = 0.6;
              zIndex = 8;
            } else if (offset === 0) {
              xOffset = 0;
              scale = 1;
              zIndex = 10;
            } else {
              opacity = 0;
              zIndex = 1;
            }
            const isCenter = offset === 0;
            return (
              <motion.div
                key={company._id}
                className="absolute w-[380px] min-h-[380px] bg-white rounded-3xl shadow-xl border border-gray-100 p-6 flex flex-col justify-between transition-all duration-300"
                style={{
                  transform: `translateX(${xOffset}px) scale(${scale})`,
                  zIndex,
                  opacity,
                }}
                drag={isCenter ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={isCenter ? handleDragEnd : undefined}
                whileTap={isCenter ? { scale: 1.02 } : undefined}
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full overflow-hidden border border-gray-300 shadow">
                    <img
                      src={company.companyLogo}
                      alt="Logo"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <h2 className="text-[22px] font-semibold text-gray-800">
                    {company.companyName}
                  </h2>
                </div>
                <div className="text-sm text-gray-600 mt-4 flex-1">
                  <p className="mb-4 ">{company.description}</p>
                  <div className="text-xs space-y-1 text-gray-500 mt-3">
                    <p>
                      <span className="font-semibold text-gray-700">
                        📍 Хаяг:
                      </span>{" "}
                      {company.address}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-700">
                        📧 Email:
                      </span>{" "}
                      {company.email}
                    </p>
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <Link href={`/company/${company.companyName}`}>
                    <Button className="bg-gradient-to-r from-[#77b8fa] to-[#4e98e8] text-white rounded-full px-6 py-2 hover:shadow-lg transition-all cursor-pointer">
                      Зочлох
                    </Button>
                  </Link>
                </div>
              </motion.div>
            );
          })}
          <div className="absolute bottom-8 flex gap-6 z-50">
            <Button
              className="cursor-pointer"
              variant="outline"
              onClick={() =>
                setCurrentIndex((prev) =>
                  prev === 0 ? filteredCompanies.length - 1 : prev - 1
                )
              }
            >
              ← Өмнөх
            </Button>
            <Button
              className="cursor-pointer"
              variant="outline"
              onClick={() =>
                setCurrentIndex((prev) => (prev + 1) % filteredCompanies.length)
              }
            >
              Дараах →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
