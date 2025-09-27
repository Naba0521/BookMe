"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/axios";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const emailSchema = z.object({
  email: z.string().email("Email хаяг буруу байна"),
});

const codeSchema = z.object({
  code: z.string().length(4, "4 оронтой код оруулна уу."),
});

const passwordSchema = z.object({
  newPassword: z
    .string()
    .min(4, "Шинэ нууц үг хамгийн багадаа 4 тэмдэгт байх ёстой."),
});

type Step = "email" | "code" | "resetPassword";

export default function UserForgotPassword() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const router = useRouter();

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const codeForm = useForm<z.infer<typeof codeSchema>>({
    resolver: zodResolver(codeSchema),
    defaultValues: { code: "" },
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { newPassword: "" },
  });

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (cooldown > 0) {
      interval = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1 && interval) clearInterval(interval);
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [cooldown]);

  const handleSendEmail = async (values: z.infer<typeof emailSchema>) => {
    try {
      await api.post("/authuser/forgot-password", values);
      toast.success("4 оронтой код илгээгдлээ.");
      setEmail(values.email);
      setStep("code");
      setCooldown(60);
    } catch (error) {
      console.error(error);
      toast.error("Email илгээхэд алдаа гарлаа.");
    }
  };

  const handleVerifyCode = async (values: z.infer<typeof codeSchema>) => {
    try {
      await api.post("/authuser/verify-code", {
        email,
        code: values.code,
      });
      toast.success("Код амжилттай баталгаажлаа.");
      setStep("resetPassword");
    } catch (error) {
      console.error(error);
      toast.error("Код буруу эсвэл хугацаа дууссан байна.");
    }
  };

  const handleResetPassword = async (
    values: z.infer<typeof passwordSchema>
  ) => {
    try {
      await api.post("/authuser/reset-password", {
        email,
        newPassword: values.newPassword,
      });
      toast.success("Нууц үг амжилттай шинэчлэгдлээ.");
      router.push("/signin");
      emailForm.reset();
      codeForm.reset();
      passwordForm.reset();
    } catch (error) {
      console.error(error);
      toast.error("Нууц үг шинэчлэхэд алдаа гарлаа.");
    }
  };

  async function resendCode() {
    if (cooldown > 0) return;
    try {
      await api.post("/authuser/forgot-password", { email });
      toast.success("Код дахин илгээгдлээ.");
      setCooldown(60);
    } catch (error) {
      toast.error("Код дахин илгээхэд алдаа гарлаа.");
    }
  }

  return (
    <div className="flex items-center justify-center w-screen h-screen text-white bg-gradient-to-br from-indigo-900 via-blue-400 to-sky-200">
      <div className="w-[1440px] h-fit flex rounded-[23px] justify-center items-center shadow-xl">
        <div className="w-[50%] h-full flex justify-center items-center">
          <div className="w-[404px] flex flex-col gap-[10px]">
            <p className="text-[32px] font-medium mb-4">
              Нууц үгээ мартсан уу?
            </p>

            {step === "email" && (
              <Form {...emailForm}>
                <form
                  onSubmit={emailForm.handleSubmit(handleSendEmail)}
                  className="flex flex-col gap-6"
                >
                  <FormField
                    control={emailForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email хаяг</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="email@example.com"
                            className="placeholder:text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="bg-blue-600 cursor-pointer">
                    Илгээх
                  </Button>
                </form>
              </Form>
            )}

            {step === "code" && (
              <Form {...codeForm}>
                <form
                  onSubmit={codeForm.handleSubmit(handleVerifyCode)}
                  className="flex flex-col gap-6"
                >
                  <FormField
                    control={codeForm.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>4 оронтой код</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="1234"
                            className="placeholder:text-white"
                            maxLength={4}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="bg-blue-600 cursor-pointer">
                    Баталгаажуулах
                  </Button>
                  <div className="text-center">
                    <p className="mb-2 text-sm text-gray-300">
                      Код хүлээн авсангүй?
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resendCode}
                      disabled={cooldown > 0}
                      className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white"
                    >
                      {cooldown > 0
                        ? `${cooldown}с дахин илгээх`
                        : "Дахин илгээх"}
                    </Button>
                  </div>
                </form>
              </Form>
            )}

            {step === "resetPassword" && (
              <Form {...passwordForm}>
                <form
                  onSubmit={passwordForm.handleSubmit(handleResetPassword)}
                  className="flex flex-col gap-6"
                >
                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Шинэ нууц үг</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="Шинэ нууц үг оруулна уу"
                            className="placeholder:text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="bg-blue-600 cursor-pointer">
                    Нууц үг шинэчлэх
                  </Button>
                </form>
              </Form>
            )}

            <div className="flex justify-center w-full mt-4 text-sm">
              <Link href="/signin">
                <span className="text-blue-700 underline cursor-pointer hover:text-white">
                  Нэвтрэх хуудас руу буцах
                </span>
              </Link>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <img
            src="https://res.cloudinary.com/dqd01lbfy/image/upload/v1751008273/pain_oxdu59.jpg"
            alt="Forgot Password Illustration"
            className="object-cover w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}
