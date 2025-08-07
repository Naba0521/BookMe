"use client"

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
    setSelectEmployee, setDate,
    company, isStage, setIsStage, Stages, isChecked }: OrderImformationType) {
    const router = useRouter()
    const [buttonVariant, setButtonVariant] = useState<"outline" | "default" | "link" | "destructive" | "secondary" | "ghost" | null | undefined>("outline");
    const { user } = useAuth()
    const i = company?.employees.find((employee) => employee._id === selectedEmployeeImf);
    const addOrder = async () => {
        api.post("/order", {
            company: company?._id,
            user: user?._id,
            employee: selectedEmployeeImf,
            selectedTime: selectedTime?.toLocaleDateString("mn-MN", {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                weekday: 'short',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
            }),

        }).then((response) => {
            // console.log("Order added successfully", response.data);
            toast.success("Амжилттай захиалагдлаа")
            router.push(`/company/${company?.companyName}/appointments`)
        }).catch((error: any) => {
            if (error.response?.status === 409) {
                toast.error("Захиалгын цаг давхацлаа. Та дахин оролдно уу.")
                setIsStage(Stages[1])
                setSelectedTime(null)
            }
            console.error(error);
        })
    }
    useEffect(() => {
        if (isSelectEmployee !== i?.employeeName) {
            setButtonVariant("outline");
        }
        if (!selectedTime) {
            setButtonVariant("outline");
        }
        if (!isChecked) {
            setButtonVariant("outline");
        }
        else {
            setButtonVariant("default");
        }
    }, [isChecked, selectedTime, isSelectEmployee, i?.employeeName]);
    return (
        <div className="flex border absolute top-56 border-gray-300 p-6 flex-col rounded-xl w-100 min-h-130 justify-between ">
            <div className="w-full flex flex-col gap-4">
                <div className="flex gap-4">
                    <div className="w-24 h-24 rounded border hover:border-blue-700 transition flex justify-center items-center p-3 ">
                        <img
                            src={company?.companyLogo}
                            onClick={() => window.open(`https://team-naba.vercel.app//company/${company?.companyName}`, '_blank')}
                            className="w-full h-full object-cover rounded "
                        />
                    </div>
                    <div className="flex-1 flex flex-col gap-2">
                        <div className="text-2xl font-bold">{company?.companyName}</div>
                        <div className="text-10 text-gray-300">{company?.address}</div>
                    </div>
                </div>
                {isSelectEmployee &&
                    <div className="flex w-full justify-between ">
                        <div className="text-sm  text-gray-400 font-bold">Үйлчилгээний ажилтан: </div>
                        {isStage == Stages[1]
                            ? <Dialog>
                                <DialogTrigger className="w-fit flex gap-3  rounded-full items-centerp-1">
                                    <div className="text-sky-600">{isSelectEmployee}</div>
                                </DialogTrigger>
                                <UpdateEmployee
                                    selectedEmployeeImf={selectedEmployeeImf} setSelectedTime={setSelectedTime}
                                    setSelectedEmployee={setSelectEmployee} setIsSelectEmployee={setIsSelectEmployee}
                                    zurag={i?.profileImage || ""} company={company}
                                    isSelectEmployee={isSelectEmployee} />
                            </Dialog>
                            : <div className=" flex flex-col ">{isSelectEmployee}</div>}
                    </div>
                }
                {selectedTime !== null ?
                    (<div className="flex flex-col gap-4">
                        <div className="flex gap-3 ">
                            {selectedTime ? (
                                <>
                                    <Calendar className="text-gray-400" />
                                    {selectedTime?.toDateString().split(" ")[0]} {selectedTime?.toDateString().split(" ")[2]} {selectedTime?.toDateString().split(" ")[1]}
                                </>
                            ) : ""}
                        </div>
                        <div className="flex gap-3 ">
                            {selectedTime ? (
                                <>
                                    <Clock className="text-gray-400" />
                                    {selectedTime?.toTimeString().split(" ")[0].slice(0, 2)}:{selectedTime?.toTimeString().split(" ")[0].slice(3, 5)}
                                    <p className="text-gray-500">({i?.duration} минут)</p>
                                </>
                            ) : ""}
                        </div>
                    </div>) : undefined
                }
            </div>
            {/* Removed invalid useEffect call */}
            < Button variant={buttonVariant}
                onClick={() => {
                    HandleNextStage()
                    if (isStage == Stages[2] && isChecked) {
                        addOrder()
                        setIsSelectEmployee("")
                        setSelectEmployee("")
                        setDate(null)
                        setSelectedTime(null)
                        setIsStage(Stages[0])
                    }
                }}> {isStage == Stages[0] && (<>Огноо сонгох <ChevronRight /></>)}
                {isStage == Stages[1] && (<>Үргэлжлүүлэх <ChevronRight /></>)}
                {isStage == Stages[2] && (<>Захиалах <ChevronRight /></>)}</Button >
        </div >
    )
}
export default OrderImformation