"use client";
import { Building2, HouseIcon } from "lucide-react";
import Image from "next/image";
import { AdminHome } from "./components/Adminhome";
import { AdminCompany } from "./components/Admincompany";
import { useState } from "react";

const Loader = () => (
  <div className="flex justify-center items-center h-full w-full">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
  </div>
);

export default function Home() {
  const [select, setSelect] = useState<"home" | "companies">("home");
  const [loading, setLoading] = useState(false);

  const handleSelect = (value: "home" | "companies") => {
    setLoading(true);
    setTimeout(() => {
      setSelect(value);
      setLoading(false);
    }, 300);
  };
  return (
    <div className="w-screen h-screen bg-[#e1e1e1] p-5 flex justify-center  gap-10 ">
      <div className=" w-[200px]  bg-white rounded-2xl shadow-2xl  flex flex-col gap-[70px] justify-between ">
        <div className="flex flex-col gap-[10px] items-center w-full mt-5">
          <Image
            src="/default-logo.jpg"
            alt="Company Logo"
            width={40}
            height={40}
          />
          <p className="font-bold text-[22px]">
            <span className="text-blue-400">Book</span>me
          </p>
          <div className="flex flex-col gap-5 w-full  p-5">
            <button
              onClick={() => handleSelect("home")}
              className={`relative flex group w-[160px] h-10 px-6 py-2 rounded-[8px] cursor-pointer hover:text-white ${
                select === "home" ? "text-white" : "text-black"
              }`}
            >
              <span
                className={`absolute inset-0 bg-gradient-to-r from-[#77b8fa] to-blue-500 transform ${
                  select === "home"
                    ? "scale-x-100"
                    : "scale-x-0 group-hover:scale-x-100"
                } transition-transform duration-300 origin-left rounded-[8px]`}
              />
              <span className="relative z-10 flex gap-3 text-black ">
                <HouseIcon />
                Home
              </span>
            </button>
            <button
              onClick={() => handleSelect("companies")}
              className={`relative flex group w-[160px] h-10 px-6 py-2 rounded-[8px] cursor-pointer hover:text-white ${
                select === "companies" ? "text-white" : "text-black"
              }`}
            >
              <span
                className={`absolute inset-0 bg-gradient-to-r from-[#77b8fa] to-blue-500 transform ${
                  select === "companies"
                    ? "scale-x-100"
                    : "scale-x-0 group-hover:scale-x-100"
                } transition-transform duration-300 origin-left rounded-[8px]`}
              />
              <span className="relative z-10 flex gap-3 text-black ">
                <Building2 />
                Companies
              </span>
            </button>
          </div>
        </div>

        <div className="w-full h-[200px]  border border-t-gray-200 rounded-[8px]"></div>
      </div>
      <div className="flex-1">
        {loading ? (
          <Loader />
        ) : select === "home" ? (
          <AdminHome />
        ) : (
          <AdminCompany />
        )}
      </div>
    </div>
  );
}
