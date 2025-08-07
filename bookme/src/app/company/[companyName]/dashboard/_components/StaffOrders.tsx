"use client";

import { useState, useEffect } from "react";
import { Users, Calendar, Clock, ArrowLeft } from "lucide-react";
import { Company, Employee, Booking } from "../../_components/CompanyTypes";
import { Button } from "@/components/ui/button";
import { StaffOrdersList } from "./StaffOrderList";
import { BookingCalendar } from "./Calendar";
import { StatsCard } from "./StatsCard";

export function StaffOrdersPage({ company }: { company: Company }) {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [selectedBookings, setSelectedBookings] = useState<Booking[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const getEmployeeBookings = (employeeId: string): Booking[] => {
    if (!company.bookings) return [];
    return company.bookings.filter(
      (booking) => booking.employee && booking.employee._id === employeeId
    );
  };

  const handleEmployeeSelect = (employee: Employee) => {
    setSelectedEmployee(employee);
    const bookings = getEmployeeBookings(employee._id);
    setSelectedBookings(bookings);
  };

  const showAllBookings = () => {
    setSelectedEmployee(null);
    setSelectedBookings(company.bookings || []);
  };

  const displayBookings = selectedEmployee
    ? selectedBookings
    : company.bookings || [];

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedEmployee]);

  const activeStaff =
    company.employees?.filter((emp) => emp.availability)?.length || 0;
  const pendingOrders = displayBookings.filter(
    (booking) => booking.status === "pending"
  ).length;
  const completedToday = displayBookings.filter((booking) => {
    if (!booking.selectedTime) return false;
    const selectedDate = new Date(booking.selectedTime);
    if (isNaN(selectedDate.getTime())) return false;
    const today = new Date().toISOString().split("T")[0];
    const bookingDate = selectedDate.toISOString().split("T")[0];
    return bookingDate === today && booking.status === "completed";
  }).length;

  return (
    <div className="w-full min-h-full bg-gray-50 space-y-4 sm:space-y-6">
      <div className="w-full flex flex-col space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Ажилчдын цаг захиалга
              </h1>
              <p className="text-gray-600 mt-1">
                {selectedEmployee
                  ? `${selectedEmployee.employeeName}-ийн захиалгууд`
                  : "Бүх ажилтнуудын цаг захиалга"}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard
            title="Идэвхтэй ажилтан"
            value={activeStaff}
            description="Одоо ажиллаж байгаа"
            icon={<Users className="w-5 h-5 text-blue-600" />}
            color="blue"
          />
          <StatsCard
            title="Хүлээгдэж буй захиалга"
            value={pendingOrders}
            description="Гүйцэтгэх ёстой"
            icon={<Calendar className="w-5 h-5 text-yellow-600" />}
            color="yellow"
          />
          <StatsCard
            title="Өнөөдөр дууссан"
            value={completedToday}
            description="Гүйцэтгэсэн захиалга"
            icon={<Clock className="w-5 h-5 text-green-600" />}
            color="green"
          />
        </div>

        {/* Staff List */}
        <div className="w-full">
          <StaffOrdersList
            company={company}
            selectedEmployee={selectedEmployee}
            onEmployeeSelect={handleEmployeeSelect}
            getEmployeeBookings={getEmployeeBookings}
          />
        </div>

        {/* Calendar */}
        {selectedEmployee && (
          <div className="w-full">
            <BookingCalendar
              company={company}
              selectedEmployee={selectedEmployee}
              bookings={displayBookings}
            />
          </div>
        )}
      </div>
    </div>
  );
}