"use client"

import { use, useEffect, useState } from "react"
import { api } from "@/axios"
import { ReturnX } from "./(comp)/return/ReturnX"
import { employeeType, OrderType, TimingProps } from "../../(publicItems)/_OrderPageTypes/types"

function StageTwoTimePicking({
    isSelectEmployee, setSelectedEmployee, zurag, company, date, selectedTime, setSelectedTime, setDate, setIsSelectEmployee, selectedEmployeeImf
}: TimingProps) {
    const [orders, setOrders] = useState<OrderType[] | undefined>(undefined)
    const [startDay, SetStartDay] = useState<Boolean>(true)
    const getEmployee = company?.employees.find((employee: employeeType) => employee._id === selectedEmployeeImf);
    const getTime = (hour: number) => hour * 60;
    const dayArrays = () => {
        const days: Date[] = [];
        let current = new Date();
        const end = new Date();
        end.setMonth(end.getMonth() + 3);
        const dayKeyMap = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
        while (current <= end) {
            const dayIndex = current.getDay();
            const key = dayKeyMap[dayIndex];
            const dayInfo = company.workingHours[key];
            days.push(new Date(current));
            current.setDate(current.getDate() + 1);
        }
        return days;
    };
    const start = getEmployee ? parseInt(getEmployee.startTime) : 0;
    const duration = getEmployee ? parseInt(getEmployee.duration.toString()) : 0;
    const end = getEmployee ? parseInt(getEmployee.endTime) : 0;
    const lunchTime = getEmployee ? parseInt(getEmployee.lunchTimeStart) : 0; console.log(lunchTime);
    const Name = getEmployee?.employeeName; console.log(Name);

    const LunchTimeEnd = getEmployee ? parseInt(getEmployee.lunchTimeEnd) : 0;;

    const availabilityTimes = () => {
        const times = [];
        for (let i = getTime(start); i < getTime(end); i += duration) {
            if (!(i >= getTime(lunchTime) && i <= getTime(LunchTimeEnd))) {
                times.push(i);
            }
        }
        return times;
    };
    useEffect(() => {
        getEmployee
        selectedEmployeeImf
    }, [isSelectEmployee, company?.employees])
    const getOrderByemployee = async () => {
        if (!selectedEmployeeImf) return;
        try {
            const response = await api.get(`/order/employee/${selectedEmployeeImf}`);
            setOrders(response.data.bookings)
            console.log("Orders by employee:", orders);
        } catch (error: any) {
            console.error("Error fetching orders by employee:", error);
        }
    }
    useEffect(() => { setDate(date) }, [date])
    useEffect(() => { getOrderByemployee() }, [selectedEmployeeImf])
    useEffect(() => { setDate(new Date()) }, [isSelectEmployee])
    const isDayClosed = (day: Date) => {
        const dayName = day.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
        const workingDay = company.workingHours[dayName];
        return workingDay?.closed == true;
    };
    const allSelectedTimes = orders
        ? orders.map((order: OrderType) => new Date(order.selectedTime))
        : [];
    const isFully = (availabilityTimes().every((time) => allSelectedTimes.some((selectedTime) =>
        selectedTime.getTime() === new Date(date?.getFullYear() ?? 0, date?.getMonth()
            ?? 0, date?.getDate() ?? 0, Math.floor(time / 60), time % 60).getTime())))
    return (
        <ReturnX
            isFully={isFully}
            orders={orders} dayArrays={dayArrays} availabilityTimes={availabilityTimes}
            isSelectEmployee={isSelectEmployee} setSelectedEmployee={setSelectedEmployee} zurag={zurag}
            company={company} date={date} selectedTime={selectedTime} setSelectedTime={setSelectedTime} setDate={setDate}
            setIsSelectEmployee={setIsSelectEmployee} selectedEmployeeImf={selectedEmployeeImf} isDayClosed={isDayClosed} />
    )
}
export default StageTwoTimePicking