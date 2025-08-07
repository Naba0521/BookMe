"use client";
import { Button } from "@/components/ui/button";
import { ArrowBigLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function Home() {
  const params = useParams();
  const companyName = params?.companyName as string;

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gradient-to-br from-indigo-900 via-blue-400 to-sky-300 text-white px-4">
      <div className="max-w-[1200px] w-full h-fit flex flex-col md:flex-row rounded-3xl bg-white/5 backdrop-blur-md shadow-2xl overflow-hidden border border-white/10">
        <div className="md:w-1/2 w-full p-10 flex flex-col gap-6 justify-center items-start text-white">
          <Link href={`/company/${companyName}`}>
            <Button className="w-10 h-10 p-2 bg-white text-black hover:bg-black hover:text-white transition cursor-pointer">
              <ArrowBigLeft />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold mt-2">Бүртгүүлэх</h1>
          <Link href="/signup" className="w-full">
            <button className="w-full h-[150px] bg-white/10 border border-white/30 rounded-xl p-6 text-left transition hover:bg-white/20 hover:shadow-xl cursor-pointer">
              <p className="text-xl font-semibold">Компаниар бүртгүүлэх</p>
              <p className="text-sm text-white/70 mt-2">
                Байгууллагаас бүртгэл хийх бол энд дарна уу.
              </p>
            </button>
          </Link>
          <Link href={`/company/${companyName}/signup`} className="w-full">
            <button className="w-full h-[150px] bg-white/10 border border-white/30 rounded-xl p-6 text-left transition hover:bg-white/20 hover:shadow-xl cursor-pointer">
              <p className="text-xl font-semibold">Хэрэглэгчээр бүртгүүлэх</p>
              <p className="text-sm text-white/70 mt-2">
                Хувь хүн бүртгүүлэх бол энд дарна уу.
              </p>
            </button>
          </Link>
        </div>
        <div className="md:w-1/2 w-full flex justify-center items-center">
          <img
            src="https://res.cloudinary.com/dqd01lbfy/image/upload/v1751008273/pain_oxdu59.jpg"
            alt="Signup Illustration"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
