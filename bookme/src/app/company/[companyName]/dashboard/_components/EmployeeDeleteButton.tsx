"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { LoadingSvg } from "@/app/_components/assets/LoadingSvg";
import { useCompanyAuth } from "@/app/_providers/CompanyAuthProvider";
import { api } from "@/axios";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  employeeId: string;
  employeeName: string;
  employeeProfilePicture: string | undefined;
}

export const EmployeeDeleteButton = ({
  employeeId,
  employeeName,
  employeeProfilePicture,
}: Props) => {
  const { getCompany } = useCompanyAuth();
  const [loading, setLoading] = useState(false);

  const handleDeleteEmployee = async () => {
    try {
      setLoading(true);
      const req = await api.delete(`/employee/${employeeId}`);
      console.log(req);

      toast.success(`${employeeName} ажилтныг амжилттай устгалаа.`);
      await getCompany();
    } catch (error) {
      console.error(`${employeeName} ажилтныг устгахад алдаа гарлаа.`);
      toast.error(`${employeeName} ажилтныг устгахад алдаа гарлаа.`);
    }
  };

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline">Ажилтан устгах</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="w-full flex flex-col items-center">
              <div className="flex gap-1">
                Ажилтан <span className="text-red-500">{employeeName}</span>
                -г устгах гэж байна.
              </div>
              <div>Итгэлтэй байна уу?</div>
            </DialogTitle>
          </DialogHeader>
          <div className="flex justify-center">
            <img
              src={employeeProfilePicture}
              className="w-[300px] h-[250px] rounded-2xl"
            />
          </div>
          <DialogFooter>
            <div className="w-full flex justify-center gap-5">
              <DialogClose asChild>
                <Button variant="outline">Үгүй</Button>
              </DialogClose>

              <Button
                className="text-gray-700 cursor-pointer"
                variant={"outline"}
                onClick={handleDeleteEmployee}
              >
                {!loading ? "Тийм" : <LoadingSvg />}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};
