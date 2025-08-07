"use client";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/app/_providers/UserAuthProvider";
import { History, LogOutIcon, SquareUserRound, Menu } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/axios";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
  const { user, signOut } = useAuth();
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  const params = useParams();
  const companyName = params?.companyName as string;

  useEffect(() => {
    if (!companyName) return;
    const fetchCompany = async () => {
      try {
        const res = await api.get(`/company/name/${companyName}`);
        const logo = res.data.company?.companyLogo;
        if (logo) setCompanyLogo(logo);
      } catch (err) {
        console.error("Failed to fetch company:", err);
      }
    };
    fetchCompany();
  }, [companyName]);

  return (
    <nav className="w-full bg-white/60 backdrop-blur-md border-b border-gray-200 shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left - Logo */}
          <div className="flex items-center space-x-3">
            <Link href={`/company/${companyName}`}>
              {companyLogo ? (
                <img
                  src={companyLogo}
                  alt="Company Logo"
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <span className="text-xl font-bold text-blue-700">LOGO</span>
              )}
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href={`/company/${companyName}`}>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-5 py-2 transition-all cursor-pointer">
                Буцах
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-5 py-2 flex items-center gap-2 transition-all cursor-pointer">
                  <Menu size={18} />
                  Цэс
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-56 mt-2 rounded-lg border border-gray-200 shadow-lg bg-white text-gray-800">
                <DropdownMenuLabel className="font-semibold text-gray-600 px-4 py-2">
                  Хэрэглэгчийн хуудас
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <Link href={`/company/${companyName}/userprofile`}>
                  <DropdownMenuItem className="cursor-pointer gap-2 hover:bg-gray-100">
                    <SquareUserRound size={18} />
                    Нүүр хуудас
                  </DropdownMenuItem>
                </Link>

                <Link href={`/company/${companyName}/appointments`}>
                  <DropdownMenuItem className="cursor-pointer gap-2 hover:bg-gray-100">
                    <History size={18} />
                    Захиалгын түүх
                  </DropdownMenuItem>
                </Link>

                <DropdownMenuItem
                  onClick={signOut}
                  className="cursor-pointer gap-2 hover:bg-red-100 text-red-600"
                >
                  <LogOutIcon size={18} />
                  Гарах
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};
