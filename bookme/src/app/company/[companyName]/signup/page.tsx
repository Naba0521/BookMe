"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { useAuth } from "@/app/_providers/UserAuthProvider";
import { toast } from "sonner";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowBigLeft } from "lucide-react";

const formSchema = z
  .object({
    username: z
      .string()
      .min(2, { message: "Хамгийн багадаа 2 үсэг байх ёстой" }),
    email: z.string().email({ message: "Зөв имэйл хаяг оруулна уу" }),
    password: z.string().min(3, { message: "Нууц үг заавал оруулна" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Нууц үг таарахгүй байна",
    path: ["confirmPassword"],
  });

export default function Register() {
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const companyName = params?.companyName as string;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { username, email, password } = values;
    setLoading(true);
    try {
      await signUp(email, password, username);
      toast.success("Амжилттай бүртгэгдлээ!");
      router.push(`/company/${companyName}/login`);
    } catch (error) {
      toast.error("Бүртгүүлэхэд алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gradient-to-br from-indigo-900 via-blue-400 to-sky-300 text-white px-4">
      <div className="max-w-[1200px] w-full flex flex-col md:flex-row rounded-3xl bg-white/5 backdrop-blur-md shadow-2xl overflow-hidden border border-white/10">
        <div className="md:w-1/2 w-full p-10 flex flex-col gap-6 justify-center items-start text-white">
          <Link href={`/company/${companyName}/user-flow-signup`}>
            <Button className="w-10 h-10 p-2 bg-white text-black hover:bg-black hover:text-white transition cursor-pointer">
              <ArrowBigLeft />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Бүртгүүлэх</h1>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full flex flex-col gap-6"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Хэрэглэгчийн нэр</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Жишээ: batbayar23"
                        className="border border-gray-300 text-black placeholder:text-gray-400"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email хаяг</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="you@example.com"
                        className="border border-gray-300 text-black placeholder:text-gray-400"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Нууц үг</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="border border-gray-300 text-black placeholder:text-gray-400"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Нууц үг давтах</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="border border-gray-300 text-black placeholder:text-gray-400"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-md transition cursor-pointer"
                disabled={loading}
              >
                {loading ? "Бүртгэж байна..." : "Бүртгүүлэх"}
              </Button>
            </form>
          </Form>
          <p className="text-sm mt-2">
            Аль хэдийн бүртгэлтэй юу?{" "}
            <Link href={`/company/${companyName}/login`}>
              <span className="underline text-blue-700 hover:text-white cursor-pointer">
                Нэвтрэх
              </span>
            </Link>
          </p>
        </div>
        <div className="md:w-1/2 w-full">
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
