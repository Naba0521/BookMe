"use client";
import { WeAreClosed } from "./ifClosed";
import { AvailabilityTimes } from "./availabilityTimes";
import { IsFullyDay } from "./iFIsFully";
import { OrderType, TimePickerProps } from "../../../../(publicItems)/_OrderPageTypes/types";
function TimePicker({
    date,
    setDate,
    dayArrays,
    setSelectedTime,
    orders,
    availabilityTimes,
    selectedTime, isFully,
    isDayClosed,
    isSelectEmployee,
    setSelectedEmployee,
    setIsSelectEmployee,
    company, zurag,
    selectedEmployeeImf
}: TimePickerProps) {
    const isClosed = date ? isDayClosed(date) : false;
    const times = date ? availabilityTimes(date.getDay()) : [];
    const hour = date?.getHours();
    const minute = date?.getMinutes();
    const currentSlot = new Date(
        date?.getFullYear() ?? 0,
        date?.getMonth() ?? 0,
        date?.getDate(),
        hour,
        minute
    );
    const isPassed = currentSlot.getTime() < new Date().getTime()
    const nextAvailabilityDay = () => {
        if (date) {
            const days = dayArrays(date); // бүх өдөр
            const currentIndex = days.findIndex(
                (d) =>
                    d.getDate() === date.getDate() &&
                    d.getMonth() === date.getMonth() &&
                    d.getFullYear() === date.getFullYear()
            );
            for (let i = currentIndex + 1; i < days.length; i += 1) {
                const nextDay = days[i];
                if (!isDayClosed(nextDay)) {
                    setDate(nextDay);
                    console.log("Next available day:", nextDay);
                    break;
                }
            }
        }
    }
    if (isClosed) {
        return (
            <WeAreClosed nextAvailabilityDay={nextAvailabilityDay} isDayClosed={isDayClosed} date={date} setDate={setDate} dayArrays={dayArrays} />)
    }
    if (isFully || isPassed) {
        return (
            <IsFullyDay nextAvailabilityDay={nextAvailabilityDay} isSelectEmployee={isSelectEmployee} setIsSelectEmployee={setIsSelectEmployee} setSelectedEmployee={setSelectedEmployee} company={company} setSelectedTime={setSelectedTime} zurag={zurag} selectedEmployeeImf={selectedEmployeeImf} />
        )
    }
    return (
        <AvailabilityTimes
            date={date} setDate={setDate} selectedTime={selectedTime} times={times} setSelectedTime={setSelectedTime} isPassed={isPassed} orders={orders} />
    );
}

export default TimePicker;
