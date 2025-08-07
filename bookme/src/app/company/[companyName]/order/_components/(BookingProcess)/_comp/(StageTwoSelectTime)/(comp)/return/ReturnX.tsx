"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ChevronDown } from "lucide-react";
import UpdateEmployee from "../../../(StageOneEmployeeSelect)/updateEmployeeDialog";
import { useState } from "react";
import TimePicker from "../timePickComponets/TimePicker";
import SelectDayOnCalendar from "../dayPickComp/DateByCalender";
import DatePicker from "../dayPickComp/DayPicker";
import { returnProps } from "../../../../(publicItems)/_OrderPageTypes/types";
export const ReturnX = ({ isSelectEmployee, setSelectedEmployee, isFully, zurag, orders, company, availabilityTimes,
     dayArrays, selectedTime, isDayClosed, date, setSelectedTime, setDate, setIsSelectEmployee, selectedEmployeeImf }: returnProps) => {
    const [open, setOpen] = useState<boolean>(false)
    return (
        <div className="w-full pr-4  flex flex-col  gap-6">
            <div className="flex w-full justify-between items-center ">
                <Dialog>
                    <DialogTrigger className="w-fit flex gap-3 border rounded-full items-center border-gray-300 p-1">
                        <Avatar>
                            <AvatarImage src={zurag} alt={`ajiltan ${isSelectEmployee}`} />
                            <AvatarFallback>LR</AvatarFallback>
                        </Avatar>
                        <div>{isSelectEmployee}</div>
                        <ChevronDown />
                    </DialogTrigger>
                    <UpdateEmployee
                        setSelectedEmployee={setSelectedEmployee} setSelectedTime={setSelectedTime}
                        setIsSelectEmployee={setIsSelectEmployee} selectedEmployeeImf={selectedEmployeeImf}
                        company={company} zurag={zurag} isSelectEmployee={isSelectEmployee} />
                </Dialog>
                <SelectDayOnCalendar date={date} setDate={setDate} open={open} setOpen={setOpen} />
            </div>
            <DatePicker date={date} isFully={isFully} setDate={setDate} dayArrays={dayArrays} orders={orders} company={company} isDayClosed={isDayClosed} availabilityTimes={availabilityTimes} />
            <TimePicker date={date} orders={orders} isFully={isFully} setDate={setDate} setSelectedTime={setSelectedTime}
                selectedTime={selectedTime} isDayClosed={isDayClosed} dayArrays={dayArrays}
                availabilityTimes={availabilityTimes} isSelectEmployee={isSelectEmployee}
                setSelectedEmployee={setSelectedEmployee}
                setIsSelectEmployee={setIsSelectEmployee}
                company={company} zurag={zurag}
                selectedEmployeeImf={selectedEmployeeImf} />
        </div >)

}