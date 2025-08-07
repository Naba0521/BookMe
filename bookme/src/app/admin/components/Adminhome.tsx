"use client";
import { Company } from "@/app/company/[companyName]/_components/CompanyTypes";
import { api } from "@/axios";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type User = {
  _id: string;
  name: string;
  email: string;
};
export const AdminHome = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const today = new Date().toLocaleDateString("mn-MN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setCurrentDate(today);
  }, []);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await api.get("/user");
        // console.log("Users data:", response.data);
        setUsers(response.data.users);
      } catch (error) {
        console.error(error);
      }
    };
    getUsers();
  }, []);

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

  const filteredCompanies = companies.filter((company) =>
    company.companyName.toLowerCase().startsWith(search.toLowerCase())
  );
  return (
    <div className="flex flex-col gap-5">
      <p className="font-semibold text-[22px]">{currentDate}</p>
      <div className="flex gap-5">
        <div className="bg-white w-[150px] h-[100px] rounded-[8px] p-4">
          <p className="font-semibold">Компани</p>
          <p className="text-blue-500 font-bold text-[32px]">
            {companies.length}
          </p>
        </div>
        <div className="bg-white w-[150px] h-[100px] rounded-[8px] p-4">
          <p className="font-semibold">Хэрэглэгч</p>
          <p className="text-blue-500 font-bold text-[32px]">{users.length}</p>
        </div>
        <div className="bg-white w-[150px] h-[100px] rounded-[8px] p-4">
          <p className="font-semibold">Админ</p>
          <p className="text-blue-500 font-bold text-[32px]">5</p>
        </div>
      </div>
      <div className="bg-white w-fit h-screen rounded-[8px] p-5 overflow-scroll flex flex-col gap-5 items-center">
        <div className="hidden md:block">
          <div className="w-[500px] h-10 flex items-center gap-2 px-3 border border-gray-300 rounded-lg shadow-sm bg-white focus-within:ring-2 focus-within:ring-blue-400 transition">
            <Search className="text-gray-500 w-4 h-4" />
            <input
              placeholder="Компаний нэрээр хайна уу"
              className="flex-1 border-none outline-none text-sm placeholder-gray-400 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
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
            <div className="flex justify-end">
              <Link href={`/company/${company.companyName}`}>
                <Button className="relative bg-[#77b8fa] group w-[77px] h-10 px-6 py-2 rounded-full overflow-hidden text-white cursor-pointer">
                  <span className="absolute inset-0 bg-gradient-to-r from-[#77b8fa] to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full" />
                  <span className="relative z-10">Зочлох</span>
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
