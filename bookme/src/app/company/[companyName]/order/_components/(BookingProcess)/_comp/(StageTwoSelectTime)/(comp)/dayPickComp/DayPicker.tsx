"use client"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { DayPickerProps } from "../../../../(publicItems)/_OrderPageTypes/types";


export default function WeekScroller({ date, setDate, dayArrays, isFully, company, orders, availabilityTimes, isDayClosed }: DayPickerProps
) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const dayRefs = useRef<(HTMLDivElement | null)[]>([]);

    const scrollByWeek = (direction: string) => {
        if (!scrollContainerRef.current || dayRefs.current.length === 0) return;

        const scrollAmount = (dayRefs.current[0]?.offsetWidth ?? 0) * 7;
        scrollContainerRef.current.scrollBy({
            left: direction === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth",

        });
    };

    useEffect(() => {
        const selectedIndex = dayArrays().findIndex(
            (d) =>
                date !== null && d.getDate() === date.getDate() &&
                d.getMonth() === date.getMonth() &&
                d.getFullYear() === date.getFullYear()
        );

        if (selectedIndex !== -1 && dayRefs.current[selectedIndex]) {
            dayRefs.current[selectedIndex].scrollIntoView({
                behavior: "smooth",
                inline: "start",
                block: "nearest",
            });
        }
    }, [date]);
    return (
        <div className="flex flex-col gap-8">
            <div className="w-full border mt-2"></div>
            <div className="flex w-full justify-between h-fit">
                <div className="font-bold">
                    {date !== null
                        ? `${date.toLocaleString("mn-MN", { month: "numeric" })} сар ${date.getFullYear()}`
                        : `${new Date().toLocaleString("mn-MN", { year: "numeric", month: "numeric" })} сар`}
                </div>
                <div className="flex gap-3 items-center">
                    <ChevronLeftIcon
                        onClick={() => scrollByWeek("left")}
                        aria-label="Previous Week"
                        className="cursor-pointer"
                        size={18}
                    />
                    <ChevronRightIcon
                        onClick={() => scrollByWeek("right")}
                        aria-label="Next Week"
                        className="cursor-pointer"
                        size={18}
                    />
                </div>
            </div>
            <div
                ref={scrollContainerRef}
                className="flex w-[790px] h-fit relative overflow-x-scroll scroll-smooth scrollbar-hide"
            >
                {dayArrays().map((day, index) => {
                    const isSelected =
                        date &&
                        date.getDate() === day.getDate() &&
                        date.getMonth() === day.getMonth() &&
                        date.getFullYear() === day.getFullYear();
                    const isClosed = isDayClosed(day);
                    return (
                        <div
                            key={day.toString()}
                            ref={(el) => {
                                dayRefs.current[index] = el;
                            }}
                            onClick={() => {
                                const selectedIndex = dayArrays().findIndex(
                                    (d) =>
                                        d.getDate() === day.getDate() &&
                                        d.getMonth() === day.getMonth() &&
                                        d.getFullYear() === day.getFullYear()
                                );
                                if (selectedIndex !== -1 && dayRefs.current[selectedIndex]) {
                                    dayRefs.current[selectedIndex].scrollIntoView({
                                        behavior: "smooth",
                                        inline: "start",
                                        block: "nearest",
                                    });
                                }
                                setDate(day)
                            }}
                            className="px-2 flex flex-col w-fit justify-center items-center gap-2 py-1"
                        >
                            <div
                                className={
                                    isSelected && (isClosed || isFully)
                                        ? "rounded-full w-24 h-24 flex justify-center items-center font-bold line-through text-2xl bg-indigo-300 text-white"
                                        : isSelected && (!isFully)
                                            ? "rounded-full w-24 h-24 flex justify-center items-center font-bold text-2xl bg-indigo-700 text-white"
                                            : isClosed
                                                ? "flex justify-center items-center rounded-full text-2xl w-24 h-24 font-bold border line-through pointer-none text-gray-300 border-gray-300"
                                                : "flex justify-center items-center rounded-full text-2xl w-24 h-24 font-bold border text-gray-700 border-gray-700 bg-gray-100"
                                }
                            >
                                {day.toLocaleDateString("mn-MN", { day: "numeric" })}
                            </div>
                            <div className="text-sm">
                                {day.toLocaleDateString("mn-MN", { weekday: "short" })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div >
    );
}
