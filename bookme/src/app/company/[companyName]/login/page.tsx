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
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowBigLeft } from "lucide-react";

const formSchema = z.object({
  email: z.string().email({
    message: "Зөв имэйл хаяг оруулна уу.",
  }),
  password: z.string().min(3, {
    message: "Нууц үг оруулна уу.",
  }),
});

export default function Login() {
  const { signIn } = useAuth();
  const params = useParams();
  const router = useRouter();
  const companyName = params?.companyName as string;
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      await signIn(values.email, values.password);
      toast.success("Амжилттай нэвтэрлээ");
      router.push(`/company/${companyName}`);
    } catch (error) {
      toast.error("Нэвтрэхэд алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gradient-to-br from-indigo-900 via-blue-400 to-sky-300 text-white px-4">
      <div className="max-w-[1200px] w-full flex flex-col md:flex-row rounded-3xl bg-white/5 backdrop-blur-md shadow-2xl overflow-hidden border border-white/10">
        <div className="md:w-1/2 w-full p-10 flex flex-col gap-6 justify-center items-start text-white">
          <Link href={`/company/${companyName}/user-flow`}>
            <Button className="w-10 h-10 p-2 bg-white text-black hover:bg-black hover:text-white transition cursor-pointer">
              <ArrowBigLeft />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold mb-2">Тавтай морил</h1>
            <p className="text-sm text-white/80">
              Бүртгэлтэй хэрэглэгчээр нэвтэрнэ үү.
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full flex flex-col gap-6"
            >
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

              <Button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-md transition cursor-pointer"
              >
                {loading ? "Нэвтэрч байна..." : "Нэвтрэх"}
              </Button>
            </form>
          </Form>

          <div className="w-full flex justify-between text-sm mt-4">
            <Link href={`/company/${companyName}/signup`}>
              <span className="text-blue-700 hover:text-white underline cursor-pointer">
                Бүртгүүлэх
              </span>
            </Link>
            <Link href={`/company/${companyName}/forgotpassword`}>
              <span className="text-blue-700 hover:text-white underline cursor-pointer">
                Нууц үг сэргээх
              </span>
            </Link>
          </div>
        </div>
        <div className="md:w-1/2 w-full">
          <img
            src="https://res.cloudinary.com/dqd01lbfy/image/upload/v1751008273/pain_oxdu59.jpg"
            alt="Login Illustration"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
