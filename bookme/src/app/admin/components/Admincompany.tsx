"use client";
import { Company } from "@/app/company/[companyName]/_components/CompanyTypes";
import { api } from "@/axios";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export const AdminCompany = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [search, setSearch] = useState("");
  const [isActiveFilter, setIsActiveFilter] = useState<boolean | null>(null);
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

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch = company.companyName
      .toLowerCase()
      .startsWith(search.toLowerCase());

    const matchesActiveFilter =
      isActiveFilter === null
        ? true
        : company.isActive === (isActiveFilter ? "true" : "false");

    return matchesSearch && matchesActiveFilter;
  });

  return (
    <div className=" w-full  bg-white rounded-2xl shadow-2xl  flex flex-col gap-[70px] justify-between ">
      <div className="bg-white w-fit h-screen rounded-[8px] p-5 overflow-scroll flex flex-col gap-5 items-center">
        <div className=" flex flex-col items-center justify-center">
          <div className="w-[500px] h-10 flex justify-center items-center gap-2 px-3 border border-gray-300 rounded-lg shadow-sm bg-white focus-within:ring-2 focus-within:ring-blue-400 transition">
            <Search className="text-gray-500 w-4 h-4" />
            <input
              placeholder="Компаний нэрээр хайна уу"
              className="flex-1 border-none outline-none text-sm placeholder-gray-400 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex mt-5 gap-5">
            <Button
              className={`cursor-pointer ${
                isActiveFilter === true
                  ? "bg-green-700 text-white"
                  : "bg-green-500 text-black hover:text-white"
              }`}
              onClick={() => setIsActiveFilter(true)}
            >
              Идэвхтэй компаниуд
            </Button>
            <Button
              className={`cursor-pointer ${
                isActiveFilter === false
                  ? "bg-red-700 text-white"
                  : "bg-red-500 text-white"
              }`}
              onClick={() => setIsActiveFilter(false)}
            >
              Идэвхгүй компаниуд
            </Button>
            <Button
              className={`cursor-pointer ${
                isActiveFilter === null
                  ? "bg-gray-700 text-white"
                  : "bg-gray-300 text-black"
              }`}
              onClick={() => setIsActiveFilter(null)}
            >
              Бүгдийг харуулах
            </Button>
          </div>
        </div>
        {filteredCompanies.map((company) => (
          <div
            key={company._id}
            className="border border-gray-300 p-4 rounded-md shadow bg-white w-full flex flex-col gap-5"
          >
            <div className="flex items-center gap-2">
              <img
                src={company.companyLogo}
                className="h-[40px] w-[40px] "
              ></img>
              <h2 className="text-[24px] font-semibold">
                {company.companyName}
              </h2>
            </div>
            <div>
              <p className="text-[14px] text-gray-700">{company.description}</p>
              <p className="text-[12px] text-gray-500 mt-2">
                <span className="font-semibold">Хаяг:</span>
                {company.address}
              </p>
              <p className="text-[12px] text-gray-500 mt-2">
                <span className="font-semibold"> Email хаяг:</span>
                {company.email}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
