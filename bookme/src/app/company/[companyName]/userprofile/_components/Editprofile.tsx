"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { useAuth } from "@/app/_providers/UserAuthProvider";
import { api } from "@/axios";
import { toast } from "sonner";
import { useEffect } from "react";
const formSchema = z.object({
  username: z.string().min(2, {
    message: "Хэрэглэгчийн нэр 2-оос их байх ёстой",
  }),
  email: z.string().email({
    message: "Email хаяг алдаатай байна.",
  }),
  phoneNumber: z.string().min(8, {
    message: "Утасны дугаар алдаатай байна.",
  }),
});
export const Editprofile = () => {
  const { user } = useAuth();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
    },
  });

  useEffect(() => {
    form.reset({
      username: user?.username || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
    });
  }, [user]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await api.patch(`/patch/${user?._id}`, {
        username: values.username,
        email: values.email,
        phoneNumber: values.phoneNumber,
      });
      if (response.data.success) {
        toast("Хэрэглэгчийн мэдээлэл амжилттай шинэчлэгдлээ.");
        form.reset();
      } else {
        toast("Хэрэглэгчийн мэдээлэл шинэчилхэд алдаа гарлаа.");
      }
    } catch (error) {
      console.error("Bank card update failed:", error);
    }
  }
  return (
    <>
      <Dialog>
        <DialogTrigger className="text-[#77b8fa] underline cursor-pointer">
          Засах
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Хэрэглэгчийн мэдээлэл засах</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Хэрэглэгчийн нэр</FormLabel>
                    <FormControl>
                      <Input placeholder={user?.username} {...field} />
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
                      <Input placeholder={user?.email} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Утасны дугаар</FormLabel>
                    <FormControl>
                      <Input placeholder={user?.phoneNumber} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="cursor-pointer">
                Submit
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};
