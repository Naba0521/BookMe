"use client"

import { Button } from "@/components/ui/button";
import { IfClosedProps } from "../../../../(publicItems)/_OrderPageTypes/types";

export const WeAreClosed = ({ date, setDate, dayArrays, isDayClosed, nextAvailabilityDay }: IfClosedProps) => {
    return (
        <div className="flex w-full flex-col  border border-gray-300  gap-10 rounded-2xl aspect-7/4 justify-center items-center">
            <div className="w-[60%]  text-wrap justify-center text-black font-bold ">
                Өнөөдөр манай амралтын өдөр тул та бусад боломжит өдрүүдээс сонгож, цагаа захиална уу? 😇
            </div>
            <div>
                <Button
                    variant={"default"}
                    className="border border-gray-400"
                    onClick={() => nextAvailabilityDay()}
                >
                    Дараагийн боломжит өдөр
                </Button>
            </div>


        </div>
    )
}