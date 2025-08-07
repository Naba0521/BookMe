"use client";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ManSVG } from "./assets/ManSVG";
import { FormDataType } from "./EmployeeAddSection";
import { useEffect, useState } from "react";
import { api } from "@/axios";
import { toast } from "sonner";
import { useSettings } from "../_providers/CompanySettingsProvider";
import { useCompanyAuth } from "@/app/_providers/CompanyAuthProvider";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useParams } from "next/navigation";
import { LoadingSvg } from "@/app/_components/assets/LoadingSvg";

const employeeSchema = z.object({
  companyName: z.string(),
  profileImage: z.string().nonempty("Ажилтны зураг оруулна уу."),
  employeeName: z.string().nonempty("Ажилтны нэрийг оруулна уу."),
  description: z.string().nonempty("Ажилтны таницуулгаа оруулна уу."),
  duration: z.string().nonempty("Үйлчилгээний хугацаа сонгоно уу."),
  startTime: z.string().nonempty("Ажлын цаг сонгоно уу."),
  endTime: z.string().nonempty("Ажлын цаг сонгоно уу."),
  lunchTimeStart: z.string().nonempty("Цайны цагаа сонгоно уу."),
  lunchTimeEnd: z.string().nonempty("Цайны цагаа сонгоно уу."),
  availability: z.boolean(),
});

export const EmployeeForm = ({
  employeeData,
  setEmployeeData,
  setIsOpen,
}: FormDataType) => {
  const param = useParams<{ companyName: string }>();
  const companyNameParam = param.companyName;
  const { company, getCompany } = useCompanyAuth();
  const { employeeImage, setEmployeeImage, handleInputEmployeeImage } =
    useSettings();
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const form = useForm<z.infer<typeof employeeSchema>>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      companyName: companyNameParam,
      employeeName: employeeData.employeeName,
      profileImage: employeeImage ?? "",
      description: employeeData.description,
      duration: employeeData.duration,
      startTime: employeeData.startTime,
      endTime: employeeData.endTime,
      lunchTimeStart: employeeData.lunchTimeStart,
      lunchTimeEnd: employeeData.lunchTimeEnd,
      availability: employeeData.availability,
    },
  });

  const handleCreateEmployee = async (
    values: z.infer<typeof employeeSchema>
  ) => {
    setLoading(true);
    try {
      await api.post(`/${company?.companyName}/employee`, values);

      toast.success("Ажилтан амжилттай нэмэгдлээ");
      await getCompany();
    } catch (error) {
      toast.error("Ажилтан үүсгэхэд алдаа гарлаа");
      console.error("Ажилтан үүсгэхэд алдаа гарлаа", error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof employeeSchema>) => {
    await handleCreateEmployee(values);
    form.reset();
    setIsOpen(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="profileImage"
          render={() => (
            <FormItem className="w-full">
              <div className="w-full flex justify-center">
                <div className="flex flex-col justify-center items-center gap-2 p-3">
                  <div className="relative flex justify-center">
                    <div className="w-[100px] h-[100px] rounded-full bg-gray-100 flex justify-center items-center overflow-hidden">
                      {!employeeImage ? (
                        <div>
                          {loadingProfile === false ? (
                            <ManSVG />
                          ) : (
                            <LoadingSvg />
                          )}
                        </div>
                      ) : (
                        <img
                          src={employeeImage}
                          alt="Employee"
                          className="w-[100px] h-[100px]"
                        />
                      )}
                    </div>
                    {employeeImage && (
                      <div className="absolute -top-1 -right-1">
                        <Button
                          type="button"
                          className="text-white rounded-full w-[5px] cursor-pointer"
                          onClick={() => setEmployeeImage(null)}
                        >
                          X
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="relative flex">
                    <Button
                      type="button"
                      className="rounded-full px-3"
                      variant="outline"
                    >
                      Зураг оруулах
                    </Button>
                    <FormControl className="absolute w-full h-full">
                      <Input
                        type="file"
                        className="opacity-0 w-full h-full cursor-pointer"
                        onChange={async (e) => {
                          setLoadingProfile(true);
                          await handleInputEmployeeImage(e, form);

                          if (employeeImage) {
                            setEmployeeData((prevData) => ({
                              ...prevData,
                              profileImage: employeeImage,
                            }));

                            form.setValue("profileImage", employeeImage);
                          }
                          setLoadingProfile(false);
                        }}
                      />
                    </FormControl>
                  </div>
                </div>
              </div>
              <div className="w-full flex justify-center">
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <div className="flex gap-3">
          <FormField
            control={form.control}
            name="employeeName"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Ажилтны нэр</FormLabel>
                <FormControl>
                  <Input placeholder="Ажилтны нэр оруулна уу." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Компани</FormLabel>
                <FormControl>
                  <Input disabled {...field} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ажилтны дэлгэрэнгүй мэдээлэл</FormLabel>
              <FormControl>
                <Input placeholder="Мэдээлэл" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between gap-3">
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Ажил эхлэх</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Ажил дуусах</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-between gap-3">
          <FormField
            control={form.control}
            name="lunchTimeStart"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Цайны цаг эхлэх</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lunchTimeEnd"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Цайны цаг дуусах</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-between gap-3">
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Нэг удаагийн үйлчилгээний хугацаа сонгох</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl className="w-full">
                    <SelectTrigger>
                      <SelectValue placeholder="Сонгох" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="30">30 минут</SelectItem>
                    <SelectItem value="60">60 минут</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          disabled={loading === true}
          type="submit"
          className="w-full bg-[#007FFF] hover:bg-[#007FFF]/90 cursor-pointer"
        >
          {!loading ? " Нэмэх" : <LoadingSvg />}
        </Button>
      </form>
    </Form>
  );
};
