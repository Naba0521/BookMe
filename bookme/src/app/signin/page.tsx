"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useCompanyAuth } from "../_providers/CompanyAuthProvider";
import Image from "next/image";
import Particles from "../_components/Particles";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const ClientOnlyStars = dynamic(() => import("../signup/_components/Stars"), {
  ssr: false,
});

const step1Schema = z.object({
  email: z.string().email("Зөв имэйл хаяг оруулна уу"),
  password: z.string().min(8, "Нууц үг дор хаяж 8 тэмдэгт байх ёстой"),
});

type Step1SchemaType = z.infer<typeof step1Schema>;

export default function SignIn() {
  const { signIn } = useCompanyAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Step1SchemaType>({
    resolver: zodResolver(step1Schema),
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: Step1SchemaType) => {
    setLoading(true);
    try {
      await signIn(data.email, data.password);
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Нэвтрэхэд алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-15"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute top-3/4 right-1/3 w-80 h-80 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-15"
          animate={{
            x: [0, -80, 0],
            y: [0, 30, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <div className="absolute bottom-0 left-0 w-[1400px] h-[900px] overflow-hidden z-0">
          <motion.div
            className="absolute -bottom-64 -left-64 w-[1400px] h-[900px]"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 60,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Image
              width={800}
              height={800}
              src="https://res.cloudinary.com/dpbmpprw5/image/upload/q_auto,f_auto/v1750157865/earth_Large_rwbjag.png"
              alt="Earth"
              priority
              className="object-contain opacity-80 pointer-events-none w-full h-full"
              style={{
                filter:
                  "drop-shadow(0 0 120px rgba(59, 130, 246, 0.5)) drop-shadow(0 0 60px rgba(139, 92, 246, 0.3))",
              }}
              quality={80}
              unoptimized={false}
            />
          </motion.div>
        </div>

        <Particles
          className="absolute inset-0 z-1"
          particleColors={[
            "#ffffff",
            "#ffffff",
            "#ffffff",
            "#ffffff",
            "#ffffff",
            "#e0e7ff",
            "#f3f4f6",
          ]}
          particleCount={400}
          particleSpread={120}
          cameraDistance={200}
          particleBaseSize={1.5}
          sizeRandomness={1.2}
          speed={0.015}
        />

        <ClientOnlyStars />
      </div>

      <div className="relative z-20 flex items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-md mx-auto bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
            boxShadow:
              "0 25px 50px -12px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
          }}
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="text-white space-y-6"
          >
            <h2 className="text-2xl font-bold text-center">Нэвтрэх</h2>

            <div>
              <Label htmlFor="email">Имэйл *</Label>
              <Input
                {...register("email")}
                placeholder="ta@example.com"
                className="bg-white/10 text-white border-white placeholder-white mt-1"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="password">Нууц үг *</Label>
              <Input
                {...register("password")}
                type="password"
                placeholder="••••••••"
                className="bg-white/10 text-white border-white placeholder-white mt-1"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#007FFF] hover:bg-[#339CFF] active:bg-[#005FCC] transition duration-200 py-2 rounded-lg font-semibold"
            >
              {loading ? "Нэвтэрч байна..." : "Нэвтрэх"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
