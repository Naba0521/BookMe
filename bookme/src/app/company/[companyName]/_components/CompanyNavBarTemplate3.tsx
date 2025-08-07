"use client";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/app/_providers/UserAuthProvider";
import { useCompanyAuth } from "@/app/_providers/CompanyAuthProvider";
import { Company } from "./CompanyTypes";

type CompanyNavBarProps = {
  company: Company;
  isScrolled: boolean;
  isMenuOpen: boolean;
  toggleMenu: () => void;
};

export const CompanyNavBarTemplate3 = ({
  company,
  isScrolled,
  isMenuOpen,
  toggleMenu,
}: CompanyNavBarProps) => {
  const { user, signOut } = useAuth();
  const { company: loggedInCompany, signOutCompany } = useCompanyAuth();

  const navItems = [
    { label: "Нүүр", href: "#home" },
    { label: "Байршил", href: "#location" },
    { label: "Холбоо барих", href: "#contact" },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out ${
        isScrolled
          ? "bg-white/95 backdrop-blur-xl shadow-lg transform scale-85 rounded-xl"
          : "bg-white/80 backdrop-blur-md shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href={`/company/${company.companyName}`}>
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 via-blue-500 to-cyan-500 blur opacity-20 group-hover:opacity-40 transition-all duration-500 rounded-full"></div>
                <div className="relative size-13 rounded-full overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm shadow-xl">
                  {company?.companyLogo && company.companyLogo.trim() !== "" ? (
                    <Image
                      src={company.companyLogo}
                      alt="Company Logo"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <Image
                      src="/Images/default-logo.jpg"
                      alt="Default Logo"
                      fill
                      className="object-contain p-2"
                    />
                  )}
                </div>
              </div>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8g">
              {navItems.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-gray-700 hover:text-pink-500 transition-all duration-300 relative group px-3 py-2 hover:scale-105"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {item.label}
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden md:block">
            {loggedInCompany && (
              <div className="flex gap-[10px]">
                <Link href={`/company/${company?.companyName}/dashboard`}>
                  <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 cursor-pointer rounded-full hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-pink-500/25 relative overflow-hidden group">
                    <span className="relative z-10">Хяналтын самбар</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  </button>
                </Link>
                <button
                  className="border-[2px]  text-black cursor-pointer px-6 py-2 rounded-full hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-pink-500/25 relative overflow-hidden group"
                  onClick={signOutCompany}
                >
                  <span className="relative z-10">Гарах</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </button>
              </div>
            )}
            {!loggedInCompany && !user && (
              <div className="flex gap-[10px]">
                <Link href={`/company/${company?.companyName}/user-flow`}>
                  <button className="border-[2px] text-black cursor-pointer px-6 py-2 rounded-full hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-pink-500/25 relative overflow-hidden group">
                    <span className="relative z-10">Нэвтрэх</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  </button>
                </Link>
                <Link
                  href={`/company/${company?.companyName}/user-flow-signup`}
                >
                  <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white cursor-pointer px-6 py-2 rounded-full hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-pink-500/25 relative overflow-hidden group">
                    <span className="relative z-10">Бүртгүүлэх</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  </button>
                </Link>
              </div>
            )}
            {!loggedInCompany && user && (
              <div className="flex gap-[10px]">
                <Link href={`/company/${company.companyName}/userprofile`}>
                  <button className="border-[2px] text-black px-6 py-2 cursor-pointer rounded-full hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-pink-500/25 relative overflow-hidden group">
                    <span className="relative z-10">Хэрэглэгчийн мэдээлэл</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  </button>
                </Link>
                <button
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white cursor-pointer px-6 py-2 rounded-full hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-pink-500/25 relative overflow-hidden group"
                  onClick={signOut}
                >
                  <span className="relative z-10">Гарах</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </button>
              </div>
            )}
          </div>
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-pink-500 transition-all cursor-pointer duration-300 relative z-50"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span
                  className={`w-5 h-0.5 bg-current transform transition-all duration-300 ${
                    isMenuOpen ? "rotate-45 translate-y-0.5" : "-translate-y-1"
                  }`}
                ></span>
                <span
                  className={`w-5 h-0.5 bg-current transform transition-all duration-300 ${
                    isMenuOpen ? "opacity-0" : "opacity-100"
                  }`}
                ></span>
                <span
                  className={`w-5 h-0.5 bg-current transform transition-all duration-300 ${
                    isMenuOpen ? "-rotate-45 -translate-y-0.5" : "translate-y-1"
                  }`}
                ></span>
              </div>
            </button>
          </div>
        </div>
      </div>
      <div
        className={`md:hidden fixed inset-0 z-40 transition-all duration-500 ease-in-out ${
          isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-500 ${
            isMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={toggleMenu}
        ></div>

        <div
          className={`absolute top-0 right-0 w-80 h-full bg-white/95 backdrop-blur-xl shadow-2xl transform transition-all duration-500 ease-in-out ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-6 pt-20  bg-white rounded-b-lg">
            <div className="space-y-4">
              {navItems.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={toggleMenu}
                  className={`block px-4 py-3 text-gray-700 hover:text-pink-500 hover:bg-pink-50 rounded-xl transition-all duration-300 transform hover:scale-105 hover:translate-x-2 ${
                    isMenuOpen ? "animate-slideInRight" : ""
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="mt-6 space-y-4">
              {loggedInCompany ? (
                <>
                  <Link
                    href={`/company/${company?.companyName}/dashboard`}
                    onClick={toggleMenu}
                    className={`block w-full text-center bg-gradient-to-r from-pink-500 to-purple-600 text-white cursor-pointer px-6 py-3 rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 ${
                      isMenuOpen ? "animate-slideInRight" : ""
                    }`}
                    style={{ animationDelay: "400ms" }}
                  >
                    Хяналтын самбар
                  </Link>
                  <button
                    onClick={() => {
                      signOutCompany();
                      toggleMenu();
                    }}
                    className={`block w-full text-center border-[2px] text-black cursor-pointer px-6 py-3 rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 ${
                      isMenuOpen ? "animate-slideInRight" : ""
                    }`}
                    style={{ animationDelay: "500ms" }}
                  >
                    Гарах
                  </button>
                </>
              ) : !user ? (
                <>
                  <Link
                    href={`/company/${company?.companyName}/user-flow`}
                    onClick={toggleMenu}
                    className={`block w-full text-center border-[2px] text-black cursor-pointer px-6 py-3 rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 ${
                      isMenuOpen ? "animate-slideInRight" : ""
                    }`}
                    style={{ animationDelay: "400ms" }}
                  >
                    Нэвтрэх
                  </Link>
                  <Link
                    href={`/company/${company?.companyName}/user-flow-signup`}
                    onClick={toggleMenu}
                    className={`block w-full text-center bg-gradient-to-r from-pink-500 to-purple-600 text-white cursor-pointer px-6 py-3 rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 ${
                      isMenuOpen ? "animate-slideInRight" : ""
                    }`}
                    style={{ animationDelay: "500ms" }}
                  >
                    Бүртгүүлэх
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href={`/company/${company.companyName}/userprofile`}
                    onClick={toggleMenu}
                    className={`block w-full text-center border-[2px] text-black cursor-pointer px-6 py-3 rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 ${
                      isMenuOpen ? "animate-slideInRight" : ""
                    }`}
                    style={{ animationDelay: "400ms" }}
                  >
                    Хэрэглэгчийн мэдээлэл
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      toggleMenu();
                    }}
                    className={`block w-full text-center bg-gradient-to-r from-pink-500 to-purple-600 text-white cursor-pointer px-6 py-3 rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 ${
                      isMenuOpen ? "animate-slideInRight" : ""
                    }`}
                    style={{ animationDelay: "500ms" }}
                  >
                    Гарах
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
