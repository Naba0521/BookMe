"use client";

import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { EventInput } from "@fullcalendar/core";
import { toast } from "sonner";
import { api } from "@/axios";
import { useCompanyAuth } from "@/app/_providers/CompanyAuthProvider";
import { Booking, Company, Employee } from "../../_components/CompanyTypes";
import { Users, Calendar, Clock } from "lucide-react";

interface BookingCalendarProps {
  company?: Company;
  selectedEmployee?: Employee | null;
  bookings?: Booking[];
  onEmployeeSelect?: (employee: Employee) => void;
  onShowAll?: () => void;
  activeStaff?: number;
  pendingOrders?: number;
  completedToday?: number;
}

const getEventColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "confirmed":
      return "#3b82f6";
    case "cancelled":
      return "#ef4444";
    case "completed":
      return "#10b981";
    case "pending":
      return "#f59e0b";
    default:
      return "#6b7280";
  }
};

const getEventStyle = (status: string) => {
  const baseColor = getEventColor(status);
  return {
    background: `linear-gradient(135deg, ${baseColor}, ${baseColor}dd)`,
    borderColor: baseColor,
    color: "#ffffff",
    boxShadow: `0 4px 12px ${baseColor}40`,
  };
};

const formatSelectedTime = (date: Date): string => {
  const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
  const month = date.toLocaleDateString("en-US", { month: "long" });
  const day = date.getDate();
  const year = date.getFullYear();
  const time = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return `${weekday}, ${month} ${day}, ${year} at ${time}`;
};

const parseDuration = (durationStr?: string): number => {
  if (!durationStr) return 60;

  // Handle different duration formats
  if (durationStr.includes("30")) return 30;
  if (durationStr.includes("60")) return 60;
  if (durationStr.includes("90")) return 90;
  if (durationStr.includes("120")) return 120;

  const match = durationStr.match(/(\d+)/);
  return match ? parseInt(match[1]) : 60;
};

const timeToMinutes = (timeString?: string): number => {
  if (!timeString) return 0;
  const [hours, minutes] = timeString.split(":").map(Number);
  return hours * 60 + minutes;
};

const isValidTimeSlot = (
  selectedDate: Date,
  employee: Employee,
  duration: number
): { isValid: boolean; reason?: string } => {
  const selectedTime = selectedDate.getHours() * 60 + selectedDate.getMinutes();
  const endTime = selectedTime + duration;

  const workStart = timeToMinutes(employee.startTime);
  const workEnd = timeToMinutes(employee.endTime);
  const lunchStart = timeToMinutes(employee.lunchTimeStart);
  const lunchEnd = timeToMinutes(employee.lunchTimeEnd);

  if (selectedTime < workStart) {
    return {
      isValid: false,
      reason: `Ажил эхлэх цагаас өмнө байна. Ажил эхлэх цаг: ${employee.startTime}`,
    };
  }

  if (endTime > workEnd) {
    return {
      isValid: false,
      reason: `Ажил дуусах цагаас хойш байна. Ажил дуусах цаг: ${employee.endTime}`,
    };
  }

  if (
    employee.lunchTimeStart &&
    employee.lunchTimeEnd &&
    ((selectedTime >= lunchStart && selectedTime < lunchEnd) ||
      (endTime > lunchStart && endTime <= lunchEnd) ||
      (selectedTime <= lunchStart && endTime >= lunchEnd))
  ) {
    return {
      isValid: false,
      reason: `Цайны цагтай давхцаж байна. Цайны цаг: ${employee.lunchTimeStart} - ${employee.lunchTimeEnd}`,
    };
  }

  return { isValid: true };
};

const getAvailableSlotDurations = (employee: Employee): number[] => {
  const duration = parseDuration(employee.duration);

  // Always provide multiple duration options
  if (duration === 30) {
    return [30, 60, 90];
  }

  if (duration === 60) {
    return [30, 60, 90];
  }

  if (duration === 90) {
    return [30, 60, 90];
  }

  // Default options
  return [30, 60, 90];
};

export const BookingCalendar = ({
  company,
  selectedEmployee,
  bookings = [],
  onEmployeeSelect,
  onShowAll,
  activeStaff = 0,
  pendingOrders = 0,
  completedToday = 0,
}: BookingCalendarProps) => {
  const [events, setEvents] = useState<EventInput[]>([]);
  const { company: loggedInCompany } = useCompanyAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number>(60);
  const [calendarApi, setCalendarApi] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentView, setCurrentView] = useState<string>("timeGridWeek");

  useEffect(() => {
    const blockedTimeSlots: EventInput[] = [];

    if (selectedEmployee) {
      // Generate blocked time slots for the current month view
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

      // Generate for the entire month
      for (
        let d = new Date(startOfMonth);
        d <= endOfMonth;
        d.setDate(d.getDate() + 1)
      ) {
        const dateStr = d.toISOString().split("T")[0];

        // Block time before work starts
        if (selectedEmployee.startTime) {
          blockedTimeSlots.push({
            id: `blocked-before-${dateStr}`,
            title: "Ажил эхлээгүй",
            start: `${dateStr}T00:00:00`,
            end: `${dateStr}T${selectedEmployee.startTime}:00`,
            backgroundColor: "#f8f9fa",
            borderColor: "#e9ecef",
            textColor: "#6c757d",
            display: "background",
            overlap: false,
            classNames: "blocked-time-slot",
          });
        }

        // Block time after work ends
        if (selectedEmployee.endTime) {
          blockedTimeSlots.push({
            id: `blocked-after-${dateStr}`,
            title: "Ажил дууссан",
            start: `${dateStr}T${selectedEmployee.endTime}:00`,
            end: `${dateStr}T23:59:59`,
            backgroundColor: "#f8f9fa",
            borderColor: "#e9ecef",
            textColor: "#6c757d",
            display: "background",
            overlap: false,
            classNames: "blocked-time-slot",
          });
        }

        // Add lunch break
        if (selectedEmployee.lunchTimeStart && selectedEmployee.lunchTimeEnd) {
          // Convert lunch time to proper format (e.g., "12-1" to "12:00-13:00")
          let lunchStart = selectedEmployee.lunchTimeStart;
          let lunchEnd = selectedEmployee.lunchTimeEnd;

          // Handle format like "12-1" -> "12:00-13:00"
          if (lunchStart.includes("-")) {
            const parts = lunchStart.split("-");
            lunchStart = `${parts[0]}:00`;
            lunchEnd = `${parseInt(parts[1]) + 12}:00`; // Convert 1 to 13:00
          } else if (!lunchStart.includes(":")) {
            lunchStart = `${lunchStart}:00`;
          }

          if (!lunchEnd.includes(":")) {
            lunchEnd = `${lunchEnd}:00`;
          }

          blockedTimeSlots.push({
            id: `lunch-${dateStr}`,
            title: "Цайны цаг",
            start: `${dateStr}T${lunchStart}`,
            end: `${dateStr}T${lunchEnd}`,
            backgroundColor: "#fff3cd",
            borderColor: "#ffeaa7",
            textColor: "#856404",
            display: "background",
            overlap: false,
            classNames: "lunch-break-slot",
          });
        }
      }
    }

    // Filter bookings to only show those for the selected employee
    const filteredBookings = selectedEmployee
      ? bookings.filter(
          (booking) => booking.employee?._id === selectedEmployee._id
        )
      : bookings;

    const calendarEvents: EventInput[] = filteredBookings.map((booking) => {
      const duration = booking.employee?.duration
        ? parseDuration(booking.employee.duration)
        : 60;

      const style = getEventStyle(booking.status);

      return {
        id: booking._id,
        title: `${booking.user?.username || "Guest"}`,
        start: new Date(booking.selectedTime),
        end: new Date(
          new Date(booking.selectedTime).getTime() + duration * 60 * 1000
        ),
        backgroundColor: style.background,
        borderColor: style.borderColor,
        textColor: style.color,
        extendedProps: {
          employee: booking.employee?.employeeName || "—",
          status: booking.status,
          customerName: booking.user?.username || "Guest",
        },
        classNames: `booking-event booking-${booking.status.toLowerCase()}`,
      };
    });

    setEvents([...calendarEvents, ...blockedTimeSlots]);
  }, [bookings, selectedEmployee]);

  useEffect(() => {
    if (selectedEmployee) {
      const availableDurations = getAvailableSlotDurations(selectedEmployee);
      setSelectedDuration(availableDurations[0]);
    }
  }, [selectedEmployee]);

  const handleDateClick = (arg: DateClickArg) => {
    if (!selectedEmployee) {
      toast.error("Ажилтан сонгогдоогүй байна.");
      return;
    }

    const validation = isValidTimeSlot(
      arg.date,
      selectedEmployee,
      selectedDuration
    );

    if (!validation.isValid) {
      toast.error(validation.reason || "Буруу цаг сонгосон байна.");
      return;
    }
    setSelectedSlot(arg.date);
    setDialogOpen(true);
    console.log("dialog should opeeeen");
  };

  const handleConfirmBooking = async () => {
    if (!selectedEmployee || !selectedSlot || !loggedInCompany?._id) {
      toast.error("Мэдээлэл дутуу байна.");
      return;
    }

    const validation = isValidTimeSlot(
      selectedSlot,
      selectedEmployee,
      selectedDuration
    );

    if (!validation.isValid) {
      toast.error(validation.reason || "Буруу цаг сонгосон байна.");
      return;
    }

    setIsLoading(true);

    const formattedSelectedTime =
      selectedSlot.toLocaleDateString("mn-MN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        weekday: "short",
      }) +
      ", " +
      selectedSlot.toLocaleTimeString("mn-MN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

    try {
      const response = await api.post("/order/company", {
        company: loggedInCompany._id,
        employee: selectedEmployee._id,
        selectedTime: formattedSelectedTime,
        status: "confirmed",
        duration: selectedDuration,
        user: loggedInCompany._id,
      });

      if (response.status === 201) {
        toast.success("🎉 Захиалга амжилттай илгээгдлээ!");

        const style = getEventStyle("confirmed");
        const newEvent: EventInput = {
          id: response.data.order._id,
          title: "Guest",
          start: selectedSlot,
          end: new Date(selectedSlot.getTime() + selectedDuration * 60 * 1000),
          backgroundColor: style.background,
          borderColor: style.borderColor,
          textColor: style.color,
          extendedProps: {
            employee: selectedEmployee.employeeName,
            status: "confirmed",
            customerName: "Guest",
          },
        };

        setEvents((prev) => [...prev, newEvent]);
        setDialogOpen(false);
        setSelectedSlot(null);
      }
    } catch (error: any) {
      if (error.response.status === 409) {
        console.error("Захиалга давхардлаа", error);
        toast.error("⚠️ Захиалга давхардлаа");
      }
      console.error("Захиалга илгээхэд алдаа:", error);
      toast.error("❌ Захиалга илгээхэд алдаа гарлаа");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelBooking = () => {
    setDialogOpen(false);
    setSelectedSlot(null);
  };

  const handleViewChange = (view: string) => {
    setCurrentView(view);
    if (calendarApi) {
      calendarApi.changeView(view);
    }
  };

  const getSlotDuration = () => {
    // Always use 30-minute slots for better granularity
    return "00:30:00";
  };
  const getSlotMinTime = () => {
    return selectedEmployee?.startTime
      ? `${selectedEmployee.startTime}:00`
      : "08:00:00";
  };

  const getSlotMaxTime = () => {
    return selectedEmployee?.endTime
      ? `${selectedEmployee.endTime}:00`
      : "20:00:00";
  };

  const availableDurations = selectedEmployee
    ? getAvailableSlotDurations(selectedEmployee)
    : [60];

  return (
    <div className="w-full overflow-hidden bg-white border shadow-2xl border-gray-200/60 rounded-3xl">
      {/* Clean Professional Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="p-6">
          {/* Header Title */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-12 h-12 shadow-lg bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Цаг захиалгын календар
                  </h1>
                  <div className="flex items-center mt-1 space-x-3">
                    {selectedEmployee ? (
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          {selectedEmployee.profileImage ? (
                            <img
                              src={selectedEmployee.profileImage}
                              alt={selectedEmployee.employeeName}
                              className="object-cover w-8 h-8 border-2 border-green-400 rounded-full"
                            />
                          ) : (
                            <div className="flex items-center justify-center w-8 h-8 bg-green-100 border-2 border-green-400 rounded-full">
                              <svg
                                className="w-4 h-4 text-green-600"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                              </svg>
                            </div>
                          )}
                          <div className="absolute w-3 h-3 bg-green-400 border-2 border-white rounded-full -bottom-0.5 -right-0.5"></div>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-base font-semibold text-gray-800">
                            {selectedEmployee.employeeName
                              .charAt(0)
                              .toUpperCase() +
                              selectedEmployee.employeeName.slice(1)}
                          </span>
                          <div className="flex items-center mt-1 space-x-4">
                            {selectedEmployee.startTime &&
                              selectedEmployee.endTime && (
                                <div className="flex items-center space-x-1">
                                  <svg
                                    className="w-3 h-3 text-gray-500"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
                                  </svg>
                                  <span className="text-xs text-gray-600">
                                    Ажлын цаг: {selectedEmployee.startTime} -{" "}
                                    {selectedEmployee.endTime}
                                  </span>
                                </div>
                              )}
                            {selectedEmployee.lunchTimeStart &&
                              selectedEmployee.lunchTimeEnd && (
                                <div className="flex items-center space-x-1">
                                  <svg
                                    className="w-3 h-3 text-gray-500"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
                                  </svg>
                                  <span className="text-xs text-gray-600">
                                    Цайны цаг: {selectedEmployee.lunchTimeStart}{" "}
                                    - {selectedEmployee.lunchTimeEnd}
                                  </span>
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <span className="text-sm text-gray-600">
                          Ажилтан сонгоно уу
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Controls on the right */}
              <div className="flex items-center space-x-4">
                {/* Employee Selection */}
                <div className="relative">
                  <select
                    value={selectedEmployee?._id || ""}
                    onChange={(e) => {
                      if (e.target.value === "all") {
                        onShowAll?.();
                      } else {
                        const employee = company?.employees?.find(
                          (emp) => emp._id === e.target.value
                        );
                        if (employee) {
                          onEmployeeSelect?.(employee);
                        }
                      }
                    }}
                    className="py-3 pl-12 pr-10 text-sm font-medium text-gray-700 transition-all duration-300 bg-white border border-gray-300 rounded-lg appearance-none hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">👥 Бүх ажилтнууд</option>
                    {company?.employees?.map((employee) => (
                      <option key={employee._id} value={employee._id}>
                        {employee.employeeName}
                      </option>
                    ))}
                  </select>

                  {/* Avatar in dropdown */}
                  {selectedEmployee && (
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <div className="relative">
                        {selectedEmployee.profileImage ? (
                          <img
                            src={selectedEmployee.profileImage}
                            alt={selectedEmployee.employeeName}
                            className="object-cover w-6 h-6 border border-gray-300 rounded-full"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-6 h-6 bg-gray-100 border border-gray-300 rounded-full">
                            <svg
                              className="w-3 h-3 text-gray-500"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                          </div>
                        )}
                        <div className="absolute w-2 h-2 bg-green-400 border border-white rounded-full -bottom-0.5 -right-0.5"></div>
                      </div>
                    </div>
                  )}

                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>

                {/* View Controls */}
                <div className="flex items-center p-1 bg-gray-100 rounded-lg">
                  <button
                    onClick={() => handleViewChange("dayGridMonth")}
                    className={`px-4 py-2 text-sm font-medium transition-all duration-200 rounded-md ${
                      currentView === "dayGridMonth"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    📅 Сар
                  </button>
                  <button
                    onClick={() => handleViewChange("timeGridWeek")}
                    className={`px-4 py-2 text-sm font-medium transition-all duration-200 rounded-md ${
                      currentView === "timeGridWeek"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    📊 7 хоног
                  </button>
                  <button
                    onClick={() => handleViewChange("timeGridDay")}
                    className={`px-4 py-2 text-sm font-medium transition-all duration-200 rounded-md ${
                      currentView === "timeGridDay"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    🕐 Өдөр
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clean Professional Calendar */}
      <div className="p-6">
        <div className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "",
            }}
            buttonText={{
              today: "Өнөөдөр",
              month: "Сар",
              week: "7 хоног",
              day: "Өдөр",
            }}
            dayHeaderFormat={{
              weekday: "short",
              month: "numeric",
              day: "numeric",
            }}
            editable={false}
            selectable={!!selectedEmployee}
            nowIndicator={true}
            selectMirror={true}
            dayMaxEvents={false}
            allDaySlot={false}
            slotMinTime={getSlotMinTime()}
            slotMaxTime={getSlotMaxTime()}
            slotDuration={getSlotDuration()}
            events={events}
            dateClick={selectedEmployee ? handleDateClick : undefined}
            height="auto"
            contentHeight={800}
            locale="en"
            firstDay={1}
            ref={(calendarRef) => {
              if (calendarRef) {
                setCalendarApi(calendarRef.getApi());
                setCurrentView(calendarRef.getApi().view.type);
              }
            }}
            eventContent={(arg) => {
              const view = calendarApi?.view?.type;
              const isMonthView = view === "dayGridMonth";
              const event = arg.event;
              const customerName =
                event.extendedProps?.customerName || event.title;
              const employee = event.extendedProps?.employee;
              const startTime = event.start?.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              });

              if (isMonthView) {
                return (
                  <div className="h-full px-1 py-0.5 overflow-hidden">
                    <div className="text-xs font-bold text-black truncate">
                      {customerName}
                    </div>
                    <div className="text-xs text-gray-700 truncate">
                      👤 {employee}
                    </div>
                    <div className="text-xs text-gray-600 truncate">
                      {startTime}
                    </div>
                  </div>
                );
              } else {
                return (
                  <div className="h-full px-2 py-1 overflow-hidden">
                    <div className="text-xs font-bold text-white truncate drop-shadow-sm">
                      {customerName}
                    </div>
                    <div className="text-xs font-medium truncate text-white/95">
                      👤 {employee}
                    </div>
                  </div>
                );
              }
            }}
            eventClassNames="cursor-pointer hover:shadow-md transition-all duration-200"
            dayHeaderClassNames="bg-gray-50 border-b border-gray-200 py-3 text-center text-sm font-bold text-gray-800"
            slotLabelClassNames="text-sm font-bold text-gray-700 pr-3"
            viewClassNames="p-4"
            nowIndicatorClassNames="bg-red-500 h-0.5"
            eventDidMount={(info) => {
              const view = calendarApi?.view?.type;
              const isMonthView = view === "dayGridMonth";

              // Enhanced professional styling for better visibility
              info.el.style.border = "none";
              info.el.style.borderRadius = isMonthView ? "4px" : "8px";
              info.el.style.fontSize = isMonthView ? "11px" : "11px";
              info.el.style.fontWeight = "600";
              info.el.style.boxShadow = "0 2px 6px rgba(0, 0, 0, 0.15)";
              info.el.style.borderLeft = isMonthView
                ? "3px solid"
                : "4px solid";
              info.el.style.transition = "all 0.3s ease";
              info.el.style.padding = isMonthView ? "2px 4px" : "4px 6px";
              info.el.style.minHeight = isMonthView ? "auto" : "50px";
              info.el.style.maxHeight = isMonthView ? "auto" : "60px";
              info.el.style.lineHeight = "1.1";
              info.el.style.overflow = "hidden";

              // Different text shadow for month vs week view
              if (isMonthView) {
                info.el.style.textShadow = "none";
                info.el.style.background = "rgba(255, 255, 255, 0.9)";
              } else {
                info.el.style.textShadow = "0 1px 2px rgba(0, 0, 0, 0.3)";
              }

              // Blocked time slots
              if (info.event.classNames.includes("blocked-time-slot")) {
                info.el.style.opacity = "0.6";
                info.el.style.cursor = "not-allowed";
                info.el.style.background = "#f3f4f6";
                info.el.style.borderLeft = isMonthView
                  ? "3px solid #9ca3af"
                  : "4px solid #9ca3af";
                info.el.style.color = "#374151";
                info.el.style.fontWeight = "600";
              }

              if (info.event.classNames.includes("lunch-break-slot")) {
                info.el.style.opacity = "0.8";
                info.el.style.cursor = "not-allowed";
                info.el.style.background = "#fbbf24";
                info.el.style.borderLeft = isMonthView
                  ? "3px solid #f59e0b"
                  : "4px solid #f59e0b";
                info.el.style.color = "#92400e";
                info.el.style.fontWeight = "700";
              }

              // Enhanced hover effects
              info.el.addEventListener("mouseenter", () => {
                if (
                  !info.event.classNames.includes("blocked-time-slot") &&
                  !info.event.classNames.includes("lunch-break-slot")
                ) {
                  info.el.style.transform = "translateY(-2px)";
                  info.el.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.2)";
                }
              });

              info.el.addEventListener("mouseleave", () => {
                info.el.style.transform = "translateY(0)";
                info.el.style.boxShadow = "0 2px 6px rgba(0, 0, 0, 0.15)";
              });
            }}
          />
        </div>
      </div>

      {dialogOpen && selectedSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="w-full max-w-lg mx-auto overflow-hidden bg-white shadow-2xl rounded-2xl">
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative px-8 py-6">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 border shadow-lg bg-white/20 backdrop-blur-sm rounded-xl border-white/30">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      Цаг захиалга үүсгэх
                    </h2>
                    <p className="text-blue-100">Шинэ захиалга нэмэх</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-8 py-8 space-y-8">
              {/* Employee Info */}
              <div className="relative overflow-hidden border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5"></div>
                <div className="relative flex items-center p-6 space-x-4">
                  <div className="flex items-center justify-center shadow-lg w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl">
                    <svg
                      className="text-white w-7 h-7"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">
                      {selectedEmployee?.employeeName}
                    </div>
                    <div className="text-sm text-gray-600">
                      Ажлын цаг: {selectedEmployee?.startTime} -{" "}
                      {selectedEmployee?.endTime}
                    </div>
                  </div>
                </div>
              </div>

              {/* Time Info */}
              <div className="relative overflow-hidden border border-gray-200 bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-600/5 to-slate-600/5"></div>
                <div className="relative flex items-center p-6 space-x-4">
                  <div className="flex items-center justify-center shadow-lg w-14 h-14 bg-gradient-to-br from-gray-500 to-slate-500 rounded-2xl">
                    <svg
                      className="text-white w-7 h-7"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">
                      {formatSelectedTime(selectedSlot)}
                    </div>
                    <div className="text-sm text-gray-600">Сонгосон цаг</div>
                  </div>
                </div>
              </div>

              {/* Duration Selection */}
              {availableDurations.length > 1 && (
                <div className="space-y-4">
                  <label className="text-lg font-bold text-gray-800">
                    Үргэлжлэх хугацаа:
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {availableDurations.map((duration) => (
                      <button
                        key={duration}
                        onClick={() => setSelectedDuration(duration)}
                        className={`px-6 py-4 text-sm font-semibold rounded-xl border-2 transition-all duration-300 ${
                          selectedDuration === duration
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 shadow-lg transform scale-105"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:shadow-md"
                        }`}
                      >
                        {duration} минут
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Booking Summary */}
              <div className="relative overflow-hidden border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-green-600/5 to-emerald-600/5"></div>
                <div className="relative p-6">
                  <div className="flex items-center mb-4 space-x-3">
                    <div className="flex items-center justify-center w-10 h-10 shadow-lg bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Захиалгын дэлгэрэнгүй
                    </h3>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Үргэлжлэх хугацаа:</span>
                      <span className="font-bold text-gray-900">
                        {selectedDuration} минут
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Дуусах цаг:</span>
                      <span className="font-bold text-gray-900">
                        {new Date(
                          selectedSlot.getTime() + selectedDuration * 60 * 1000
                        ).toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end px-8 py-6 space-x-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={handleCancelBooking}
                disabled={isLoading}
                className="px-6 py-3 text-sm font-semibold text-gray-700 transition-all duration-200 bg-white border border-gray-300 shadow-sm rounded-xl hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Цуцлах
              </button>
              <button
                onClick={handleConfirmBooking}
                disabled={isLoading}
                className="px-8 py-3 text-sm font-bold text-white transition-all duration-200 shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 rounded-full border-white/30 border-t-white animate-spin"></div>
                    <span>Хадгалагдаж байна...</span>
                  </div>
                ) : (
                  "💾 Хадгалах"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
