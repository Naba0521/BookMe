"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import UpdateEmployee from "../../../(StageOneEmployeeSelect)/updateEmployeeDialog"
import { isFullDayProps } from "../../../../(publicItems)/_OrderPageTypes/types"

export const IsFullyDay = ({ isSelectEmployee, nextAvailabilityDay, zurag, setIsSelectEmployee,
    setSelectedEmployee, setSelectedTime, company, selectedEmployeeImf }: isFullDayProps) => {

    return (
        <div className="flex flex-col w-full aspect-7/4 rounded-2xl border gap-4 justify-center items-center border-gray-500">
            <div className=" w-20 h-20">
                <img src="/fullyclndr.png" />
            </div>
            <div className=""> Таны сонгосон ажилтны өнөөдрийн боломжит цагууд захиалагдсан байна.

            </div><p>  Та сонгосон өдөр эсвэл ажилтанг сольж цагаа захиална уу?</p>
            <div className="flex  gap-10">
                <Dialog>
                    <DialogTrigger className="w-fit flex gap-3 border rounded-xl items-center  border-gray-300 p-2">
                        Ажилтанг солих
                    </DialogTrigger>
                    <UpdateEmployee
                        setSelectedEmployee={setSelectedEmployee} setSelectedTime={setSelectedTime}
                        setIsSelectEmployee={setIsSelectEmployee} selectedEmployeeImf={selectedEmployeeImf}
                        company={company} zurag={zurag} isSelectEmployee={isSelectEmployee} />
                </Dialog>
                <Button onClick={() => { nextAvailabilityDay() }}>Дараагийн боломжит өдөр</Button>
            </div>
        </div>
    )
}