"use client"

import { ChevronRight } from "lucide-react";
import StagaOneSelectEmployee from "./_comp/(StageOneEmployeeSelect)/SelectEmployee";
import StageTwoTimePicking from "./_comp/(StageTwoSelectTime)/SelectTime";
import ConfirmBooking from "./_comp/(StageThree)/Confirm";
import OrderNavBar from "./(publicItems)/header";
import OrderImformation from "./(publicItems)/orderImformation";
import { useState } from "react";
import { BookingPageProps, CompanyType, employeeType } from "./(publicItems)/_OrderPageTypes/types";

export const BookingPage = ({ isStage, setSelectedTime, setIsStage, setIsSelectEmployee,
    isSelectEmployee, setSelectedEmployeeImf, selectedEmployeeImf, companyData, selectedTime,

    HandleNextStage, date, setDate }: BookingPageProps) => {
    const [isChecked, setIsChecked] = useState(false);
    const Stages = ["Ажилтан", "Огноо", "Баталгаажуулалт"]
    const title = () => {
        if (isStage === Stages[2]) { return `${isStage} хийх`; }
        if (isStage == Stages[1] || isStage === Stages[0]) { return `${isStage} сонгох`; }
        if (isStage == Stages[3]) { return isStage; }
        return ""; // Default fallback to ensure a string is always returned

    }
    return (
        <div className="w-full flex flex-col h-fit jusify-center overflow-hidden items-center bg-white">
            <div className="w-[1440px] relative h-[120vh] flex justify-center">
                <OrderNavBar
                    companyData={companyData}
                    isStage={typeof isStage === "string" ? isStage : ""}
                    setSelectedTime={setSelectedTime}
                    setIsStage={setIsStage}
                    title={title()}
                    Stages={Stages}
                />
                <div className="flex-3 relative flex flex-col p-16 gap-8">
                    <div className="flex flex-col gap-5">
                        <div className="gap-2 w-full flex items-center">
                            {Stages.slice(0, 3).map((item, index) => (
                                <div
                                    onClick={() => {
                                        if (isStage !== "" && Stages.indexOf(isStage) > index) {
                                            setSelectedTime(null);
                                            setIsStage(item);
                                            setIsChecked(false)
                                        }
                                    }}
                                    className={
                                        item == isStage
                                            ? "font-bold h-fit flex gap-1 text-xl bg-gray-300 p-2 rounded-xl items-center"
                                            : "flex text-xl gap-1 font-normal items-center"
                                    }
                                    key={index}
                                >
                                    <p>{item}</p>
                                    <ChevronRight size={18} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {isStage == Stages[0] && (
                        <StagaOneSelectEmployee
                            isSelectEmployee={isSelectEmployee}
                            setIsSelectEmployee={setIsSelectEmployee}
                            selectedEmployeeImf={selectedEmployeeImf}
                            company={companyData as CompanyType}
                            setSelectedEmployeeImf={setSelectedEmployeeImf}
                        />
                    )}
                    {isStage == Stages[1] && (
                        <div className="w-full">
                            <StageTwoTimePicking
                                setSelectedEmployee={setSelectedEmployeeImf}
                                setIsSelectEmployee={setIsSelectEmployee}
                                zurag={
                                    companyData?.employees?.find(
                                        (employee: employeeType) => employee._id === selectedEmployeeImf
                                    )?.profileImage || ""
                                }
                                date={date}
                                setDate={setDate}
                                setSelectedTime={setSelectedTime}
                                selectedTime={selectedTime}
                                selectedEmployeeImf={selectedEmployeeImf}
                                company={companyData as CompanyType}
                                isSelectEmployee={isSelectEmployee}
                            />
                        </div>
                    )}
                    {isStage == Stages[2] && <ConfirmBooking isChecked={isChecked} setIsChecked={setIsChecked} />}
                </div>
                <div className="flex flex-2 w-full relative justify-start items-center">
                    <OrderImformation
                        isChecked={isChecked}
                        setIsStage={setIsStage}
                        HandleNextStage={HandleNextStage}
                        setIsSelectEmployee={setIsSelectEmployee}
                        setSelectEmployee={(employee: string) => setSelectedEmployeeImf(employee)}
                        setDate={setDate}
                        selectedTime={selectedTime}
                        setSelectedTime={setSelectedTime}
                        isSelectEmployee={isSelectEmployee}
                        date={date}
                        selectedEmployeeImf={selectedEmployeeImf}
                        company={companyData}
                        isStage={isStage}
                        Stages={Stages}
                    />
                </div>
            </div>
        </div>
    )
}