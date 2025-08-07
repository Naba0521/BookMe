"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useAuth } from "@/app/_providers/UserAuthProvider";
import { useCompanyAuth } from "@/app/_providers/CompanyAuthProvider";
import { Company } from "./CompanyTypes";

type CompanyNavBarProps = {
  company: Company;
  isScrolled: boolean;
  isMenuOpen: boolean;
  toggleMenu: () => void;
};

export const CompanyNavBarTemplate2 = ({
  company,
  isScrolled,
  isMenuOpen,
  toggleMenu,
}: CompanyNavBarProps) => {
  const { user, signOut } = useAuth();
  const { company: loggedInCompany, signOutCompany } = useCompanyAuth();

  const navItems = [
    { label: "Нүүр", href: "#home" },
    { label: "Бидний тухай", href: "#about" },
    { label: "Байршил", href: "#location" },
    { label: "Холбоо барих", href: "#contact" },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-700 ease-in-out ${
        isScrolled
          ? "bg-black/90 backdrop-blur-xl shadow-2xl border-b border-white/10"
          : "bg-black/70 backdrop-blur-md shadow-lg border-b border-white/5"
      }`}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-20 w-32 h-32 bg-gradient-to-br from-rose-400/10 to-purple-600/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-0 right-20 w-40 h-40 bg-gradient-to-br from-blue-400/10 to-cyan-600/10 rounded-full blur-xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="flex justify-between items-center h-20">
          <motion.div
            className="flex-shrink-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-black-400 via-blue-500 to-cyan-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition-all duration-500"></div>
              <div className="relative size-13 rounded-full overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm">
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
          </motion.div>

          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  className="relative group text-gray-300 hover:text-white transition-all duration-300 px-4 py-2 rounded-lg hover:bg-white/5"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="relative z-10 font-medium">
                    {item.label}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-rose-500/20 to-blue-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                </motion.a>
              ))}
            </div>
          </div>

          <div className="hidden md:block">
            {loggedInCompany && (
              <motion.div
                className="flex gap-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Link href={`/company/${company?.companyName}/dashboard`}>
                  <button className="relative group px-6 py-3 cursor-pointer rounded-xl bg-gradient-to-r from-grey-500 to-blue-600 text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-rose-500/25 hover:scale-105">
                    <span className="relative z-10 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Хяналтын самбар
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </Link>
                <button
                  className="relative group px-6 py-3 rounded-xl cursor-pointer border border-white/20 text-white font-medium transition-all duration-300 hover:bg-white/5 hover:scale-105"
                  onClick={signOutCompany}
                >
                  <span className="relative z-10">Гарах</span>
                </button>
              </motion.div>
            )}

            {!loggedInCompany && !user && (
              <motion.div
                className="flex gap-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Link href={`/company/${company?.companyName}/user-flow`}>
                  <button className="relative group px-6 py-3 cursor-pointer rounded-xl border border-white/20 text-white font-medium transition-all duration-300 hover:bg-white/5 hover:scale-105">
                    <span className="relative z-10">Нэвтрэх</span>
                  </button>
                </Link>
                <Link
                  href={`/company/${company?.companyName}/user-flow-signup`}
                >
                  <button className="relative group px-6 py-3 cursor-pointer rounded-xl bg-gradient-to-r from-grey-500 to-blue-600 text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-rose-500/25 hover:scale-105">
                    <span className="relative z-10 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Бүртгүүлэх
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-grey-600 to-blue-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </Link>
              </motion.div>
            )}

            {!loggedInCompany && user && (
              <motion.div
                className="flex gap-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Link href={`/company/${company.companyName}/userprofile`}>
                  <button className="relative group px-6 py-3 cursor-pointer rounded-xl border border-white/20 text-white font-medium transition-all duration-300 hover:bg-white/5 hover:scale-105">
                    <span className="relative z-10">Хэрэглэгчийн мэдээлэл</span>
                  </button>
                </Link>
                <button
                  className="relative group px-6 py-3 cursor-pointer rounded-xl bg-gradient-to-r from-grey-500 to-blue-600 text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-rose-500/25 hover:scale-105"
                  onClick={signOut}
                >
                  <span className="relative z-10">Гарах</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-grey-600 to-blue-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </motion.div>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="relative z-50 p-2 cursor-pointer text-gray-300 hover:text-white transition-all duration-300 rounded-lg hover:bg-white/5"
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
          className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-500 ${
            isMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={toggleMenu}
        ></div>

        <div
          className={`absolute top-0 right-0 w-80 h-full bg-black/90 backdrop-blur-xl shadow-2xl border-l border-white/10 transform transition-all duration-500 ease-in-out ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <button
            onClick={toggleMenu}
            className="absolute top-6 cursor-pointer right-6 text-gray-700 hover:text-pink-500 transition-colors duration-300 p-2"
            aria-label="Close menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <div className="p-6 pt-24 bg-black rounded-b-lg">
            <div className="space-y-4">
              {navItems.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={toggleMenu}
                  className={`block px-6 py-4 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-300 transform hover:scale-105 hover:translate-x-2 border border-white/10 ${
                    isMenuOpen ? "animate-slideInRight" : ""
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                    {item.label}
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-8 space-y-4">
              {loggedInCompany ? (
                <>
                  <Link
                    href={`/company/${company?.companyName}/dashboard`}
                    onClick={toggleMenu}
                    className={`block w-full text-center px-6 py-4 bg-gradient-to-r from-grey-500 to-blue-600 text-white font-medium rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-rose-500/25 ${
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
                    className={`block w-full cursor-pointer text-center px-6 py-4 border border-white/20 text-white font-medium rounded-xl transition-all duration-300 ${
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
                    className={`block w-full text-center px-6 py-4 border border-white/20 text-white font-medium rounded-xl transition-all duration-300 ${
                      isMenuOpen ? "animate-slideInRight" : ""
                    }`}
                    style={{ animationDelay: "400ms" }}
                  >
                    Нэвтрэх
                  </Link>
                  <Link
                    href={`/company/${company?.companyName}/user-flow`}
                    onClick={toggleMenu}
                    className={`block w-full text-center px-6 py-4 bg-gradient-to-r from-grey-500 to-blue-600 text-white font-medium rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-rose-500/25 ${
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
                    className={`block w-full text-center px-6 py-4 border border-white/20 text-white font-medium rounded-xl transition-all duration-300 ${
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
                    className={`block w-full cursor-pointer text-center px-6 py-4 bg-gradient-to-r from-grey-500 to-blue-600 text-white font-medium rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-rose-500/25 ${
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
