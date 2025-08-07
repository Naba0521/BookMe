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

interface BookingCalendarProps {
  company?: Company;
  selectedEmployee?: Employee | null;
  bookings?: Booking[];
}

const getEventColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "confirmed":
      return "#1a73e8";
    case "cancelled":
      return "#ea4335";
    case "completed":
      return "#34a853";
    case "pending":
      return "#fbbc04";
    default:
      return "#9aa0a6";
  }
};

const getEventStyle = (status: string) => {
  const baseColor = getEventColor(status);
  return {
    backgroundColor: baseColor,
    borderColor: baseColor,
    color: "#ffffff",
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

  if (duration === 60) {
    return [60];
  }

  if (duration === 30) {
    return [30, 60];
  }
  return [duration];
};

export const BookingCalendar = ({
  company,
  selectedEmployee,
  bookings = [],
}: BookingCalendarProps) => {
  const [events, setEvents] = useState<EventInput[]>([]);
  const { company: loggedInCompany } = useCompanyAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number>(60);
  const [calendarApi, setCalendarApi] = useState<any>(null);

  useEffect(() => {
    const blockedTimeSlots: EventInput[] = [];

    if (selectedEmployee) {
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay() + 1);

      for (let i = 0; i < 7; i++) {
        const currentDate = new Date(startOfWeek);
        currentDate.setDate(startOfWeek.getDate() + i);

        const dateStr = currentDate.toISOString().split("T")[0];

        if (selectedEmployee.startTime) {
          const workStart = timeToMinutes(selectedEmployee.startTime);
          if (workStart > 0) {
            blockedTimeSlots.push({
              id: `blocked-before-${dateStr}`,
              title: "Ажил эхлээгүй",
              start: `${dateStr}T00:00:00`,
              end: `${dateStr}T${selectedEmployee.startTime}:00`,
              backgroundColor: "#f5f5f5",
              borderColor: "#d1d5db",
              textColor: "#6b7280",
              display: "background",
              overlap: false,
            });
          }
        }
        if (selectedEmployee.endTime) {
          const workEnd = timeToMinutes(selectedEmployee.endTime);
          if (workEnd < 24 * 60) {
            blockedTimeSlots.push({
              id: `blocked-after-${dateStr}`,
              title: "Ажил дууссан",
              start: `${dateStr}T${selectedEmployee.endTime}:00`,
              end: `${dateStr}T23:59:59`,
              backgroundColor: "#f5f5f5",
              borderColor: "#d1d5db",
              textColor: "#6b7280",
              display: "background",
              overlap: false,
            });
          }
        }

        if (selectedEmployee.lunchTimeStart && selectedEmployee.lunchTimeEnd) {
          blockedTimeSlots.push({
            id: `lunch-${dateStr}`,
            title: "Цайны цаг",
            start: `${dateStr}T${selectedEmployee.lunchTimeStart}:00`,
            end: `${dateStr}T${selectedEmployee.lunchTimeEnd}:00`,
            backgroundColor: "#fef3c7",
            borderColor: "#f59e0b",
            textColor: "#92400e",
            display: "background",
            overlap: false,
          });
        }
      }
    }

    const calendarEvents: EventInput[] = bookings.map((booking) => {
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
        backgroundColor: style.backgroundColor,
        borderColor: style.borderColor,
        textColor: style.color,
        extendedProps: {
          employee: booking.employee?.employeeName || "—",
          status: booking.status,
          customerName: booking.user?.username || "Guest",
        },
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
        user: loggedInCompany._id
      });

      if (response.status === 201) {
        toast.success("Захиалга амжилттай илгээгдлээ!");

        const style = getEventStyle("confirmed");
        const newEvent: EventInput = {
          id: response.data.order._id,
          title: "Guest",
          start: selectedSlot,
          end: new Date(selectedSlot.getTime() + selectedDuration * 60 * 1000),
          backgroundColor: style.backgroundColor,
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
        console.error("Захиалга давхардлаа", error)
        toast.error("Захиалга давхардлаа");
      }
      console.error("Захиалга илгээхэд алдаа:", error);
      toast.error("Захиалга илгээхэд алдаа гарлаа");
    }
  };

  const handleCancelBooking = () => {
    setDialogOpen(false);
    setSelectedSlot(null);
  };

  const statusLegend = [
    { status: "pending", label: "Хүлээгдэж буй", color: "#fbbc04" },
    { status: "confirmed", label: "Баталгаажсан", color: "#1a73e8" },
    { status: "completed", label: "Дууссан", color: "#34a853" },
    { status: "cancelled", label: "Цуцлагдсан", color: "#ea4335" },
    { status: "blocked", label: "Боломжгүй цаг", color: "#f5f5f5" },
    { status: "lunch", label: "Цайны цаг", color: "#fef3c7" },
  ];

  const handleViewChange = (view: string) => {
    if (calendarApi) {
      calendarApi.changeView(view);
    }
  };

  const getSlotDuration = () => {
    if (!selectedEmployee?.duration) return "00:30:00";

    const duration = parseDuration(selectedEmployee.duration);
    if (duration === 60) {
      return "01:00:00";
    }
    return "00:30:00";
  };
  const getSlotMinTime = () => {
    return selectedEmployee?.startTime
      ? selectedEmployee.startTime + ":00"
      : "08:00:00";
  };

  const getSlotMaxTime = () => {
    return selectedEmployee?.endTime
      ? selectedEmployee.endTime + ":00"
      : "20:00:00";
  };

  const availableDurations = selectedEmployee
    ? getAvailableSlotDurations(selectedEmployee)
    : [60];

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-200 bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-medium text-gray-900">
                    {selectedEmployee
                      ? selectedEmployee.employeeName
                      : "Бүх ажилтнууд"}
                  </h1>
                  <p className="text-sm text-gray-500">
                    Цаг захиалгын календар
                    {selectedEmployee &&
                      selectedEmployee.startTime &&
                      selectedEmployee.endTime && (
                        <span className="ml-2">
                          ({selectedEmployee.startTime} -{" "}
                          {selectedEmployee.endTime}
                          {selectedEmployee.lunchTimeStart &&
                            selectedEmployee.lunchTimeEnd && (
                              <>
                                , Цай: {selectedEmployee.lunchTimeStart} -{" "}
                                {selectedEmployee.lunchTimeEnd}
                              </>
                            )}
                          )
                        </span>
                      )}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => handleViewChange("dayGridMonth")}
                className="px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              >
                Сар
              </button>
              <button
                onClick={() => handleViewChange("timeGridWeek")}
                className="px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 bg-white text-gray-900 shadow-sm"
              >
                7 хоног
              </button>
              <button
                onClick={() => handleViewChange("timeGridDay")}
                className="px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              >
                Өдөр
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-6">
            {statusLegend.map((item) => (
              <div key={item.status} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-600 font-medium">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
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
            editable={false}
            selectable={!!selectedEmployee}
            nowIndicator={true}
            selectMirror={true}
            dayMaxEvents={false}
            allDaySlot={false}
            slotMinTime={
              selectedEmployee?.startTime
                ? `${selectedEmployee.startTime}:00`
                : "08:00:00"
            }
            slotMaxTime={
              selectedEmployee?.endTime
                ? `${selectedEmployee.endTime}:00`
                : "20:00:00"
            }
            slotDuration={getSlotDuration()}
            events={events}
            dateClick={selectedEmployee ? handleDateClick : undefined}
            height={selectedEmployee ? 1000 : "auto"}
            contentHeight={800}
            locale="en"
            firstDay={1}
            ref={(calendarRef) => {
              if (calendarRef) {
                setCalendarApi(calendarRef.getApi());
              }
            }}
            eventContent={(arg) => (
              <div className="px-2 py-1 h-full overflow-hidden">
                <div className="text-xs font-semibold truncate mb-1">
                  {arg.event.extendedProps?.customerName || arg.event.title}
                </div>
                <div className="text-xs opacity-90 truncate">
                  {arg.event.extendedProps?.employee}
                </div>
                <div className="text-xs opacity-75 mt-1">
                  {arg.event.start?.toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </div>
              </div>
            )}
            eventClassNames="rounded-md border-l-4 cursor-pointer hover:shadow-lg transition-shadow duration-200"
            dayHeaderClassNames="bg-gray-50 border-b border-gray-200 py-3 text-center text-sm font-medium text-gray-700"
            slotLabelClassNames="text-xs text-gray-500 pr-2"
            viewClassNames="p-4"
            eventDidMount={(info) => {
              info.el.style.border = "none";
              info.el.style.borderRadius = "4px";
              info.el.style.fontSize = "12px";
              info.el.style.fontWeight = "500";
            }}
          />
        </div>
      </div>

      {dialogOpen && selectedSlot && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md mx-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Цаг захиалга үүсгэх
              </h2>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {selectedEmployee?.employeeName}
                  </div>
                  <div className="text-xs text-gray-500">
                    Ажлын цаг: {selectedEmployee?.startTime} -{" "}
                    {selectedEmployee?.endTime}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {formatSelectedTime(selectedSlot)}
                  </div>
                  <div className="text-xs text-gray-500">Сонгосон цаг</div>
                </div>
              </div>

              {availableDurations.length > 1 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Үргэлжлэх хугацаа:
                  </label>
                  <div className="flex gap-2">
                    {availableDurations.map((duration) => (
                      <button
                        key={duration}
                        onClick={() => setSelectedDuration(duration)}
                        className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                          selectedDuration === duration
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {duration} минут
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-xs text-gray-500 px-3">
                Үргэлжлэх хугацаа: {selectedDuration} минут
                <br />
                Дуусах цаг:{" "}
                {new Date(
                  selectedSlot.getTime() + selectedDuration * 60 * 1000
                ).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={handleCancelBooking}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Цуцлах
              </button>
              <button
                onClick={handleConfirmBooking}
                className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors shadow-sm"
              >
                Хадгалах
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
