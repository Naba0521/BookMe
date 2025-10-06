"use client";

import { useState, useEffect } from "react";
import { Users, Calendar, Clock } from "lucide-react";
import { Company, Employee, Booking } from "../../_components/CompanyTypes";
import { BookingCalendar } from "./Calendar";

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
    <div className="w-full min-h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="flex flex-col w-full space-y-4">
        {/* Main Calendar - Now the primary focus */}
        <div className="w-full">
          <BookingCalendar
            company={company}
            selectedEmployee={selectedEmployee}
            bookings={displayBookings}
            onEmployeeSelect={handleEmployeeSelect}
            onShowAll={showAllBookings}
            activeStaff={activeStaff}
            pendingOrders={pendingOrders}
            completedToday={completedToday}
          />
        </div>
      </div>
    </div>
  );
}
