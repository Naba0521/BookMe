"use client";

import { api } from "@/axios";
import { Button } from "@/components/ui/button";
import { Dialog } from "@radix-ui/react-dialog";
import { DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/app/_providers/UserAuthProvider";
import { Calendar, ChevronRight, Clock } from "lucide-react";
import { OrderImformationType } from "./_OrderPageTypes/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import UpdateEmployee from "../_comp/(StageOneEmployeeSelect)/updateEmployeeDialog";
import { useEffect, useState } from "react";

function OrderImformation({
  HandleNextStage,
  setIsSelectEmployee,
  isSelectEmployee,
  selectedTime,
  setSelectedTime,
  selectedEmployeeImf,
  setSelectEmployee,
  setDate,
  company,
  isStage,
  setIsStage,
  Stages,
  isChecked,
}: OrderImformationType) {
  const router = useRouter();
  const [buttonVariant, setButtonVariant] = useState<
    | "outline"
    | "default"
    | "link"
    | "destructive"
    | "secondary"
    | "ghost"
    | null
    | undefined
  >("outline");
  const { user } = useAuth();
  const i = company?.employees.find(
    (employee) => employee._id === selectedEmployeeImf
  );
  const addOrder = async () => {
    api
      .post("/order", {
        company: company?._id,
        user: user?._id,
        employee: selectedEmployeeImf,
        selectedTime: selectedTime?.toLocaleDateString("mn-MN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          weekday: "short",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      })
      .then((response) => {
        // console.log("Order added successfully", response.data);
        toast.success("Амжилттай захиалагдлаа");
        router.push(`/company/${company?.companyName}/appointments`);
      })
      .catch((error: unknown) => {
        if (
          error &&
          typeof error === "object" &&
          "response" in error &&
          error.response &&
          typeof error.response === "object" &&
          "status" in error.response &&
          error.response.status === 409
        ) {
          toast.error("Захиалгын цаг давхацлаа. Та дахин оролдно уу.");
          setIsStage(Stages[1]);
          setSelectedTime(null);
        }
        console.error(error);
      });
  };
  useEffect(() => {
    if (isSelectEmployee !== i?.employeeName) {
      setButtonVariant("outline");
    }
    if (!selectedTime) {
      setButtonVariant("outline");
    }
    if (!isChecked) {
      setButtonVariant("outline");
    } else {
      setButtonVariant("default");
    }
  }, [isChecked, selectedTime, isSelectEmployee, i?.employeeName]);
  return (
    <div className="absolute flex flex-col justify-between p-6 border border-gray-300 top-56 rounded-xl w-100 min-h-130 ">
      <div className="flex flex-col w-full gap-4">
        <div className="flex gap-4">
          <div className="flex items-center justify-center w-24 h-24 p-3 transition border rounded hover:border-blue-700 ">
            <img
              src={company?.companyLogo}
              onClick={() =>
                window.open(
                  `https://team-naba.vercel.app//company/${company?.companyName}`,
                  "_blank"
                )
              }
              className="object-cover w-full h-full rounded "
            />
          </div>
          <div className="flex flex-col flex-1 gap-2">
            <div className="text-2xl font-bold">{company?.companyName}</div>
            <div className="text-gray-300 text-10">{company?.address}</div>
          </div>
        </div>
        {isSelectEmployee && (
          <div className="flex justify-between w-full ">
            <div className="text-sm font-bold text-gray-400">
              Үйлчилгээний ажилтан:{" "}
            </div>
            {isStage == Stages[1] ? (
              <Dialog>
                <DialogTrigger className="flex gap-3 rounded-full w-fit items-centerp-1">
                  <div className="text-sky-600">{isSelectEmployee}</div>
                </DialogTrigger>
                <UpdateEmployee
                  selectedEmployeeImf={selectedEmployeeImf}
                  setSelectedTime={setSelectedTime}
                  setSelectedEmployee={setSelectEmployee}
                  setIsSelectEmployee={setIsSelectEmployee}
                  zurag={i?.profileImage || ""}
                  company={company}
                  isSelectEmployee={isSelectEmployee}
                />
              </Dialog>
            ) : (
              <div className="flex flex-col ">{isSelectEmployee}</div>
            )}
          </div>
        )}
        {selectedTime !== null ? (
          <div className="flex flex-col gap-4">
            <div className="flex gap-3 ">
              {selectedTime ? (
                <>
                  <Calendar className="text-gray-400" />
                  {selectedTime?.toDateString().split(" ")[0]}{" "}
                  {selectedTime?.toDateString().split(" ")[2]}{" "}
                  {selectedTime?.toDateString().split(" ")[1]}
                </>
              ) : (
                ""
              )}
            </div>
            <div className="flex gap-3 ">
              {selectedTime ? (
                <>
                  <Clock className="text-gray-400" />
                  {selectedTime?.toTimeString().split(" ")[0].slice(0, 2)}:
                  {selectedTime?.toTimeString().split(" ")[0].slice(3, 5)}
                  <p className="text-gray-500">({i?.duration} минут)</p>
                </>
              ) : (
                ""
              )}
            </div>
          </div>
        ) : undefined}
      </div>
      {/* Removed invalid useEffect call */}
      <Button
        variant={buttonVariant}
        onClick={() => {
          HandleNextStage();
          if (isStage == Stages[2] && isChecked) {
            addOrder();
            setIsSelectEmployee("");
            setSelectEmployee("");
            setDate(null);
            setSelectedTime(null);
            setIsStage(Stages[0]);
          }
        }}
      >
        {" "}
        {isStage == Stages[0] && (
          <>
            Огноо сонгох <ChevronRight />
          </>
        )}
        {isStage == Stages[1] && (
          <>
            Үргэлжлүүлэх <ChevronRight />
          </>
        )}
        {isStage == Stages[2] && (
          <>
            Захиалах <ChevronRight />
          </>
        )}
      </Button>
    </div>
  );
}
export default OrderImformation;
