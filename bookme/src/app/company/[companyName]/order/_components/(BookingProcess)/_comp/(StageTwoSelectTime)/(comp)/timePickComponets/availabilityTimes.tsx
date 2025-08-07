"use client"

import { availabilityProps, OrderType } from "../../../../(publicItems)/_OrderPageTypes/types";

export function AvailabilityTimes({ times, date, setDate, setSelectedTime, selectedTime, isPassed, orders }: availabilityProps) {
    return (
        <div className="flex w-full flex-col gap-10 ">
            <div className="flex w-full gap-10 justify-end">
                <div className="flex justify-center items-center gap-2 "><div className=" rounded-full border p-2 border-gray-300"><div className="w-5  bg-gray-300 rounded-full h-5"></div></div><p>захиалгатай</p></div>
                <div className="flex justify-center items-center gap-2 "><div className=" rounded-full border p-2 border-blue-200/50"><div className="w-5  bg-blue-200/50 rounded-full h-5"></div></div><p>сул цаг</p></div>
                <div className="flex justify-center items-center gap-2 "><div className=" rounded-full border p-2 border-blue-500"><div className="w-5  bg-blue-500 rounded-full h-5"></div></div><p>таны сонгосон</p></div>
            </div>
            <div className="grid grid-cols-6 gap-5 items-center justify-center">
                {times.map((time) => {
                    const hour = Math.floor(Number(time) / 60);
                    const minute = (Number(time)) % 60;
                    const formattedTime = `${hour.toString().padStart(2, "0")}:${minute
                        .toString()
                        .padStart(2, "0")}`;
                    const currentSlot = new Date(
                        date?.getFullYear() ?? 1970,
                        date?.getMonth() ?? 0,
                        date?.getDate(),
                        hour,
                        minute
                    );
                    const allSelectedTimes = orders
                        ? orders.map((order: OrderType) => order.status == "confirmed" && new Date(order.selectedTime))
                        : []

                    const isBooked =
                        allSelectedTimes.some(
                            (selectedTime) => selectedTime instanceof Date && selectedTime.getTime() === currentSlot.getTime()
                        )
                    const isSelected =
                        selectedTime &&
                        selectedTime.getTime() === currentSlot.getTime();

                    const className = isBooked || isPassed
                        ? "bg-gray-300 flex w-full rounded-xl items-center p-4  text-gray-500 cursor-not-allowed hover:border-gray-700 pointer-events-none"
                        : isSelected
                            ? "bg-blue-500 flex w-full  rounded-xl items-center justify-center p-4 cursor-pointer text-white"
                            : "bg-blue-200/50  flex w-full rounded-xl items-center justify-center p-4 hover:border hover:border-blue-700 cursor-pointer";
                    return (
                        <span
                            key={time.toString()}
                            className={className}
                            onClick={() => {
                                if (!isBooked) {
                                    setDate(currentSlot);
                                    setSelectedTime(currentSlot);
                                }
                            }}
                        >
                            {formattedTime}
                        </span>
                    );
                })}
            </div>
        </div >
    )
}