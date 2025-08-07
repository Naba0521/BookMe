"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Stepper, { Step } from "@/blocks/Components/Stepper/Stepper";
import { Step6 } from "./_components/Step6";
import { Step3 } from "./_components/Step3";
import { Step1 } from "./_components/Step1";
import axios from "axios";
import { FormDataType } from "./_components/Types";
import { useCompanyAuth } from "../_providers/CompanyAuthProvider";
import { toast } from "sonner";
import { Step5 } from "./_components/Step5";
import { Step2 } from "./_components/Step2";
import { Step4 } from "./_components/Step4";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { fullSchema, FullSchemaType } from "./_components/Schemas";
import Image from "next/image";
import Particles from "../_components/Particles";
import dynamic from "next/dynamic";
const ClientOnlyStars = dynamic(() => import("../signup/_components/Stars"), {
  ssr: false,
});

const UPLOAD_PRESET = "bookMe";
const CLOUD_NAME = "dazhij9zy";

export default function CompanySetupPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [companyImagePreview, setCompanyImagePreview] = useState<string[]>([]);
  const [companyImages, setCompanyImages] = useState<File[]>([]);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signUp } = useCompanyAuth();

  const formData: FormDataType = {
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    description: "",
    address: "",
    city: "",
    phone: "",
    website: "",
    logo: "",
    openingHours: {
      monday: { open: "09:00", close: "18:00", closed: false },
      tuesday: { open: "09:00", close: "18:00", closed: false },
      wednesday: { open: "09:00", close: "18:00", closed: false },
      thursday: { open: "09:00", close: "18:00", closed: false },
      friday: { open: "09:00", close: "18:00", closed: false },
      saturday: { open: "10:00", close: "16:00", closed: false },
      sunday: { open: "10:00", close: "16:00", closed: true },
    },
    lunchBreak: {
      start: "12:00",
      end: "13:00",
    },
    aboutUsImage: "",
    backGroundImage: "",
    experience: "",
    clientNumber: "",
  };

  const methods = useForm<FullSchemaType>({
    resolver: zodResolver(fullSchema),
    mode: "onChange",
    defaultValues: formData,
  });

  useEffect(() => {
    return () => {
      companyImagePreview.forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
      if (logoPreview.startsWith("blob:")) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [companyImagePreview, logoPreview]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setCompanyImages((prev) => [...prev, ...files]);
      const previews = files.map((file) => URL.createObjectURL(file));
      setCompanyImagePreview((prev) => [...prev, ...previews]);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (logoPreview.startsWith("blob:")) {
        URL.revokeObjectURL(logoPreview);
      }

      setLogoFile(file);
      const preview = URL.createObjectURL(file);
      setLogoPreview(preview);
      methods.setValue("logo", preview);
    }
  };

  function capitalizeWords(input: string): string {
    return input
      .trim()
      .replace(/\s+/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join("");
  }

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        formData,
        {
          timeout: 30000,
        }
      );
      return response.data.secure_url;
    } catch (error) {
      console.error("Cloudinary upload failed:", error);
      throw new Error("Image upload failed");
    }
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      const values = methods.getValues();

      let logoUrl = "";
      if (logoFile) {
        logoUrl = await uploadToCloudinary(logoFile);
      }
      const imageUrls = await Promise.all(
        companyImages.map((file) => uploadToCloudinary(file))
      );

      const apiData = {
        email: values.email,
        password: values.password,
        companyName: capitalizeWords(values.companyName),
        address: values.address,
        city: values.city,
        lat: values.lat,
        lng: values.lng,
        companyLogo: logoUrl,
        phoneNumber: values.phone,
        description: values.description ?? "",
        companyImages: imageUrls,
        employees: [],
        bookings: [],
        workingHours: values.openingHours,
        lunchBreak: values.lunchBreak,
        aboutUsImage: values.aboutUsImage,
        backGroundImage: values.backGroundImage,
        clientNumber: values.clientNumber,
        experience: values.experience,
      };

      console.log("Илгээж буй өгөгдөл:", apiData);

      const response = await signUp(apiData);
      if (response) {
        toast.success("Таны компани амжилттай бүртгэгдлээ!");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeCompanyImage = (index: number) => {
    const urlToRevoke = companyImagePreview[index];
    if (urlToRevoke?.startsWith("blob:")) {
      URL.revokeObjectURL(urlToRevoke);
    }

    setCompanyImagePreview((prev) => prev.filter((_, i) => i !== index));
    setCompanyImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeLogo = () => {
    if (logoPreview.startsWith("blob:")) {
      URL.revokeObjectURL(logoPreview);
    }

    setLogoFile(null);
    setLogoPreview("");
    methods.setValue("logo", "");
  };

  const dayLabels: Record<string, string> = {
    monday: "Даваа",
    tuesday: "Мягмар",
    wednesday: "Лхагва",
    thursday: "Пүрэв",
    friday: "Баасан",
    saturday: "Бямба",
    sunday: "Ням",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Enhanced Background with Earth and Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated gradient orbs */}
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

        {/* Earth in bottom-left corner - Large and behind form */}
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

        {/* Global Particles - More white particles */}
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
          className="w-full max-w-4xl"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
              Компани бүртгэх
            </h1>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
              Таны бизнесийг цахим орчинд нэвтрүүлж, илүү олон үйлчлүүлэгчдэд
              хүрэх боломжийг олгоно
            </p>

            {/* Progress indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex items-center justify-center space-x-4 text-slate-400 mt-6"
            >
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
              <span className="text-sm font-medium">
                Алхам {currentStep} / 6
              </span>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            </motion.div>
          </motion.div>

          {/* Form Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl px-6 py-8 w-full max-w-[720px] mx-auto"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
              boxShadow:
                "0 25px 50px -12px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
            }}
          >
            <FormProvider {...methods}>
              <Stepper
                initialStep={1}
                onStepChange={(step) => {
                  setCurrentStep(step);
                }}
                onFinalStepCompleted={handleFinalSubmit}
                backButtonText="Буцах"
                nextButtonText={isSubmitting ? "Илгээж байна..." : "Дараах"}
                disabled={isSubmitting}
              >
                <Step>
                  <Step1 />
                </Step>
                <Step>
                  <Step2 />
                </Step>
                <Step>
                  <Step3 dayLabels={dayLabels} />
                </Step>
                <Step>
                  <div className="max-h-[70vh] overflow-auto px-2">
                    <Step4
                      formData={{
                        ...methods.getValues(),
                        description: methods.getValues().description ?? "",
                        backGroundImage:
                          methods.getValues().backGroundImage ?? "",
                        aboutUsImage: methods.getValues().aboutUsImage ?? "",
                      }}
                      setFormData={() => {}}
                      handleImageChange={handleImageChange}
                      companyImagePreview={companyImagePreview}
                      removeCompanyImage={removeCompanyImage}
                      handleLogoChange={handleLogoChange}
                      logoPreview={logoPreview}
                      removeLogo={removeLogo}
                    />
                  </div>
                </Step>
                <Step>
                  <Step5
                    formData={methods.getValues()}
                    setFormData={() => {}}
                  />
                </Step>
                <Step>
                  <Step6
                    formData={methods.getValues()}
                    setFormData={() => {}}
                    dayLabels={dayLabels}
                    companyImagePreview={companyImagePreview}
                    logoPreview={logoPreview}
                  />
                </Step>
              </Stepper>
            </FormProvider>
          </motion.div>
        </motion.div>
      </div>

      {/* Loading Overlay */}
      {isSubmitting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/20 backdrop-blur-md p-8 rounded-2xl shadow-2xl text-center flex flex-col items-center gap-6 border border-white/30"
          >
            <div className="relative">
              <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
              <div
                className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-pink-600 rounded-full animate-spin"
                style={{ animationDelay: "0.15s" }}
              />
            </div>
            <div className="text-white">
              <h3 className="text-xl font-semibold mb-2">Илгээж байна...</h3>
              <p className="text-slate-300">
                Компаний мэдээлэл боловсруулж байна
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
