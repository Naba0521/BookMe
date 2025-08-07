"use client";
import Link from "next/link";
import { HomeAddress } from "./_components/Homeaddress";
import { useAuth } from "@/app/_providers/UserAuthProvider";
import { Button } from "@/components/ui/button";
import { Editprofile } from "./_components/Editprofile";
import { Navbar } from "./_components/Navbar";
import { useParams } from "next/navigation";

export default function Home() {
  const { user } = useAuth();
  const params = useParams();
  const companyName = params?.companyName as string;

  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col items-center">
      <Navbar />

      <main className="max-w-[1440px] w-full flex flex-col items-center px-6 mt-20">
        <h1 className="text-[32px] font-bold mb-10 text-gray-800">
          Хэрэглэгчийн мэдээлэл
        </h1>

        <div className="flex flex-col lg:flex-row gap-8 w-full max-w-5xl">
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex flex-col gap-6">
            <div className="flex justify-between items-start">
              <h2 className="text-[22px] font-semibold text-gray-700">
                Хувийн мэдээлэл
              </h2>
              <Editprofile />
            </div>

            <div className="text-center">
              <p className="text-[24px] font-bold text-gray-900">
                {user?.username}
              </p>
            </div>

            <div className="flex flex-col gap-4 text-[14px] text-gray-600">
              <div>
                <p className="font-medium text-gray-700">Email</p>
                <p>{user?.email ?? "Email хаяг олдсонгүй"}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Утасны дугаар</p>
                <p>{user?.phoneNumber ?? "Утасны дугаар олдсонгүй"}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Гэрийн хаяг</p>
                <p>{user?.address ?? "Гэрийн хаяг олдсонгүй"}</p>
              </div>
            </div>

            <Link
              href={`/company/${companyName}/appointments`}
              className="mt-auto"
            >
              <Button className="relative w-full bg-[#77b8fa] hover:bg-blue-500 text-white font-medium py-2 rounded-md transition-all duration-300 cursor-pointer">
                Захиалгын түүх харах
              </Button>
            </Link>
          </div>
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex flex-col gap-6">
            <h2 className="text-[22px] font-semibold text-gray-700">
              Миний хаяг
            </h2>
            <HomeAddress />
          </div>
        </div>
      </main>
    </div>
  );
}
