"use client";

import { Clock, Star, Plus, X, CalendarDays } from "lucide-react";
import { Company, Employee } from "../../_components/CompanyTypes";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { api } from "@/axios";
import { toast } from "sonner";

interface EmployeesTabProps {
  company: Company;
}

interface NewBooking {
  user: string;
  selectedTime: string;
  status: string;
}

export const EmployeesTab = ({ company }: EmployeesTabProps) => {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [showNewBookingForm, setShowNewBookingForm] = useState(false);
  const [newBooking, setNewBooking] = useState<NewBooking>({
    user: "",
    selectedTime: "",
    status: "pending",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const bookingsForSelected = company.bookings?.filter(
    (b) => b.employee._id === selectedEmployee?._id
  );

  const getCurrentMonth = () => {
    const now = new Date();
    return now.getMonth();
  };

  const getCurrentYear = () => {
    const now = new Date();
    return now.getFullYear();
  };

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const getMonthName = (month: number) => {
    const months = [
      "Нэгдүгээр сар",
      "Хоёрдугаар сар",
      "Гуравдугаар сар",
      "Дөрөвдүгээр сар",
      "Тавдугаар сар",
      "Зургадугаар сар",
      "Долдугаар сар",
      "Наймдугаар сар",
      "Есдүгээр сар",
      "Аравдугаар сар",
      "Арван нэгдүгээр сар",
      "Арван хоёрдугаар сар",
    ];
    return months[month];
  };

  const getBookingsForDate = (date: number) => {
    const currentDate = new Date(getCurrentYear(), getCurrentMonth(), date);
    const dateString = currentDate.toISOString().split("T")[0];

    return (
      bookingsForSelected?.filter((booking) => {
        const bookingDate = new Date(booking.selectedTime)
          .toISOString()
          .split("T")[0];
        return bookingDate === dateString;
      }) || []
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500 text-white";
      case "pending":
        return "bg-yellow-500 text-white";
      case "cancelled":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const handleCreateBooking = async () => {
    if (!selectedEmployee || !newBooking.user || !newBooking.selectedTime) {
      toast.error("Бүх талбарыг бөглөнө үү");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post("/booking/create", {
        company: company._id,
        user: newBooking.user,
        status: newBooking.status,
        employee: selectedEmployee._id,
        selectedTime: newBooking.selectedTime,
      });

      if (response.status === 201) {
        toast.success("Захиалга амжилттай үүсгэгдлээ");
        setShowNewBookingForm(false);
        setNewBooking({
          user: "",
          selectedTime: "",
          status: "pending",
        });
        window.location.reload();
      }
    } catch (error) {
      console.error("Захиалга үүсгэхэд алдаа гарлаа:", error);
      toast.error("Захиалга үүсгэхэд алдаа гарлаа");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCalendar = () => {
    const month = getCurrentMonth();
    const year = getCurrentYear();
    const daysInMonth = getDaysInMonth(month, year);
    const firstDay = getFirstDayOfMonth(month, year);

    const days = [];
    const weekDays = ["Ня", "Да", "Мя", "Лх", "Пү", "Ба", "Бя"];

    const weekHeaders = weekDays.map((day) => (
      <div
        key={day}
        className="p-2 text-center font-semibold text-gray-600 text-sm"
      >
        {day}
      </div>
    ));

    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="p-2 h-24 border border-gray-100"
        ></div>
      );
    }

    for (let date = 1; date <= daysInMonth; date++) {
      const dayBookings = getBookingsForDate(date);
      const isToday =
        new Date().getDate() === date &&
        new Date().getMonth() === month &&
        new Date().getFullYear() === year;

      days.push(
        <div
          key={date}
          className={`p-1 h-24 border border-gray-100 relative overflow-hidden
            ${isToday ? "bg-blue-50" : "bg-white"} hover:bg-gray-50`}
        >
          <div
            className={`text-sm font-medium mb-1 ${
              isToday ? "text-blue-600" : "text-gray-700"
            }`}
          >
            {date}
          </div>
          <div className="space-y-1">
            {dayBookings.slice(0, 3).map((booking, index) => (
              <div
                key={booking._id}
                className={`text-xs px-1 py-0.5 rounded truncate ${getStatusColor(
                  booking.status
                )}`}
                title={`${booking.user.username} - ${booking.status}`}
              >
                {booking.user.username}
              </div>
            ))}
            {dayBookings.length > 3 && (
              <div className="text-xs text-gray-500">
                +{dayBookings.length - 3} илүү
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl shadow-lg">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <CalendarDays className="w-5 h-5" />
            {getMonthName(month)} {year}
          </h3>
        </div>
        <div className="grid grid-cols-7 gap-0">
          {weekHeaders}
          {days}
        </div>
      </div>
    );
  };

  return (
    <div className="flex gap-8">
      <div className="w-1/3 max-h-[75vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">👥 Манай баг</h2>
        <div className="space-y-4">
          {company.employees?.map((e) => (
            <div
              key={e._id}
              onClick={() => setSelectedEmployee(e)}
              className={`cursor-pointer bg-white rounded-xl p-4 shadow-md transition-all duration-300 transform
                hover:shadow-lg hover:-translate-y-1
                ${
                  selectedEmployee?._id === e._id
                    ? "ring-2 ring-blue-400 bg-blue-50"
                    : ""
                }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 p-0.5">
                  <img
                    src={
                      e.profileImage ||
                      "https://images.unsplash.com/photo-1494790108755-2616c9c9b7d2?w=64&h=64&fit=crop"
                    }
                    className="w-full h-full rounded-full object-cover"
                    alt={e.employeeName}
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">
                    {e.employeeName}
                  </h4>
                  <p className="text-gray-600 text-xs truncate">
                    {e.description}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-xs text-gray-500">4.8</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-2/3">
        {!selectedEmployee ? (
          <div className="bg-white rounded-xl p-8 shadow-lg text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Ажилтан сонгоно уу
            </h2>
            <p className="text-gray-500">
              Зүүн талд ажилтан дээр дарж календар харна уу
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-4 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 p-1">
                    <img
                      src={
                        selectedEmployee.profileImage ||
                        "https://images.unsplash.com/photo-1494790108755-2616c9c9b7d2?w=64&h=64&fit=crop"
                      }
                      className="w-full h-full rounded-full object-cover"
                      alt={selectedEmployee.employeeName}
                    />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      {selectedEmployee.employeeName}
                    </h2>
                    <p className="text-gray-600">
                      {selectedEmployee.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">
                          4.8 (124 үнэлгээ)
                        </span>
                      </div>
                      <span className="text-gray-400">•</span>
                      <span className="text-sm text-gray-600">
                        {bookingsForSelected?.length || 0} захиалга
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => setShowNewBookingForm(true)}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Захиалга нэмэх
                </Button>
              </div>
            </div>

            {renderCalendar()}

            <div className="bg-white rounded-xl p-4 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Сүүлийн захиалгууд ({bookingsForSelected?.length || 0})
              </h3>
              {bookingsForSelected?.length === 0 ? (
                <p className="text-gray-500">Захиалга байхгүй байна.</p>
              ) : (
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {bookingsForSelected?.slice(0, 5).map((booking) => (
                    <div
                      key={booking._id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-800">
                          {booking.user.username}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          {new Date(booking.selectedTime).toLocaleString(
                            "mn-MN"
                          )}
                        </div>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {showNewBookingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">
                Шинэ захиалга нэмэх
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNewBookingForm(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Хэрэглэгчийн ID
                </label>
                <input
                  type="text"
                  value={newBooking.user}
                  onChange={(e) =>
                    setNewBooking({ ...newBooking, user: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Хэрэглэгчийн ID оруулна уу"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Огноо ба цаг
                </label>
                <input
                  type="datetime-local"
                  value={newBooking.selectedTime}
                  onChange={(e) =>
                    setNewBooking({
                      ...newBooking,
                      selectedTime: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Статус
                </label>
                <select
                  value={newBooking.status}
                  onChange={(e) =>
                    setNewBooking({ ...newBooking, status: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="pending">Хүлээгдэж буй</option>
                  <option value="confirmed">Баталгаажсан</option>
                  <option value="cancelled">Цуцалсан</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowNewBookingForm(false)}
                className="flex-1"
              >
                Цуцлах
              </Button>
              <Button
                onClick={handleCreateBooking}
                disabled={isSubmitting}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                {isSubmitting ? "Үүсгэж байна..." : "Захиалга үүсгэх"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
