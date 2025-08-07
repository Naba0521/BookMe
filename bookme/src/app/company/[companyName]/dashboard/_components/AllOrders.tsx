"use client";

import { useEffect, useState } from "react";
import { Company, Booking } from "../../_components/CompanyTypes";
import { api } from "@/axios";
import { toast } from "sonner";
import { isToday, isThisWeek, isThisMonth, isPast } from "date-fns";
import {
  ShoppingCart,
  Check,
  Clock,
  AlertCircle,
  Search,
  ChevronDown,
  Eye,
  X,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

const ITEMS_PER_PAGE = 10;

type AllOrdersPageProps = {
  company: Company;
};

// Animated counter component
const AnimatedCounter = ({ value, duration = 1000 }: { value: number; duration?: number }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const startValue = displayValue;
    const difference = value - startValue;

    const updateCounter = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.round(startValue + difference * easeOutQuart);
      
      setDisplayValue(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };

    requestAnimationFrame(updateCounter);
  }, [value, duration]);

  return <span>{displayValue}</span>;
};

export function AllOrdersPage({ company }: AllOrdersPageProps) {
  const [orders, setOrders] = useState<Booking[]>([]);
  const [filter, setFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [previousStats, setPreviousStats] = useState<any>({});

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!company?._id) return;
        const res = await api.get(`/order/company/${company._id}`);
        setOrders(res.data.bookings);
      } catch (err) {
        toast.error("Захиалгын мэдээлэл татаж чадсангүй");
        console.error(err);
      }
    };
    fetchOrders();
  }, [company]);

  const filteredOrders = orders.filter((o) => {
    const date = new Date(o.selectedTime);
    const isFuture = date.getTime() >= new Date().getTime();
const matchesSearch =
  (o.user?.username ?? "").toLowerCase().includes(search.toLowerCase()) ||
  (o.employee?.employeeName ?? "").toLowerCase().includes(search.toLowerCase());


    if (!matchesSearch) return false;

    if (filter === "past") return o.status === "confirmed" && isPast(date);
    if (!isFuture) return false;

    if (selectedDate) {
      const selected = new Date(selectedDate);
      const orderDate = new Date(o.selectedTime);
      const sameDay = 
        orderDate.getFullYear() === selected.getFullYear() &&
        orderDate.getMonth() === selected.getMonth() &&
        orderDate.getDate() === selected.getDate();

      if (!sameDay) return false;
    }

    switch (filter) {
      case "all":
        return ["confirmed", "cancelled"].includes(o.status);
      case "today":
        return ["confirmed", "cancelled"].includes(o.status) && isToday(date);
      case "week":
        return (
          ["confirmed", "cancelled"].includes(o.status) &&
          isThisWeek(date, { weekStartsOn: 1 })
        );
      case "month":
        return (
          ["confirmed", "cancelled"].includes(o.status) && isThisMonth(date)
        );
      case "confirmed":
      case "cancelled":
      case "pending":
        return o.status === filter;
      default:
        return true;
    }
  });

  const handleCancel = async (orderId: string) => {
    try {
      const res = await api.delete(`/order/${orderId}`);
      toast.success("Захиалгыг цуцаллаа");

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: "cancelled" } : order
        )
      );
    } catch (err) {
      toast.error("Цуцалж чадсангүй");
      console.error(err);
    }
  };

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getStatusConfig = (status: string) => {
    const configs = {
      confirmed: {
        label: "Батлагдсан",
        className: "bg-green-50 text-green-700 border-green-200",
        dot: "bg-green-500",
      },
      pending: {
        label: "Хүлээгдэж буй",
        className: "bg-yellow-50 text-yellow-700 border-yellow-200",
        dot: "bg-yellow-500",
      },
      cancelled: {
        label: "Цуцлагдсан",
        className: "bg-red-50 text-red-700 border-red-200",
        dot: "bg-red-500",
      },
    };
    return configs[status as keyof typeof configs] || configs.pending;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("mn-MN", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("mn-MN").format(price) + "₮";
  };

  const filters = [
    { value: "all", label: "Бүгд", count: orders.length },
    {
      value: "today",
      label: "Өнөөдөр",
      count: orders.filter((o) => isToday(new Date(o.selectedTime))).length,
    },
    {
      value: "week",
      label: "Энэ долоо хоног",
      count: orders.filter((o) =>
        isThisWeek(new Date(o.selectedTime), { weekStartsOn: 1 })
      ).length,
    },
    {
      value: "confirmed",
      label: "Батлагдсан",
      count: orders.filter((o) => o.status === "confirmed").length,
    },
    {
      value: "pending",
      label: "Хүлээгдэж буй",
      count: orders.filter((o) => o.status === "pending").length,
    },
    {
      value: "cancelled",
      label: "Цуцлагдсан",
      count: orders.filter((o) => o.status === "cancelled").length,
    },
  ];

  // Calculate real-time stats
  const totalOrders = filteredOrders.length;
  const confirmedOrders = orders.filter((o) => o.status === "confirmed").length;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const cancelledOrders = orders.filter((o) => o.status === "cancelled").length;
  const todayOrders = orders.filter((o) => isToday(new Date(o.selectedTime))).length;
  const weekOrders = orders.filter((o) => isThisWeek(new Date(o.selectedTime), { weekStartsOn: 1 })).length;
  
  const confirmationRate = orders.length > 0 ? Math.round((confirmedOrders / orders.length) * 100) : 0;
  const cancellationRate = orders.length > 0 ? Math.round((cancelledOrders / orders.length) * 100) : 0;
  
  // Calculate revenue (assuming each booking has a price field)

  // Calculate trends (mock data for demonstration)
  const getTrend = (current: number, category: string) => {
    const previous = previousStats[category] || current * 0.9;
    const change = current - previous;
    const percentage = previous > 0 ? Math.round((change / previous) * 100) : 0;
    return {
      change: percentage,
      isPositive: change >= 0,
      display: `${percentage > 0 ? '+' : ''}${percentage}%`
    };
  };

  // Update previous stats
  useEffect(() => {
    setPreviousStats({
      total: totalOrders,
      confirmed: confirmedOrders,
      pending: pendingOrders,
      cancelled: cancelledOrders,
    });
  }, []);

  const stats = [
    {
      title: "Нийт захиалга",
      value: totalOrders,
      trend: getTrend(totalOrders, 'total'),
      icon: ShoppingCart,
      color: "blue",
      gradient: "from-blue-500 to-blue-600",
      description: "Нийт захиалгын тоо",
    },
    {
      title: "Батлагдсан захиалга",
      value: confirmedOrders,
      percentage: confirmationRate,
      trend: getTrend(confirmedOrders, 'confirmed'),
      icon: Check,
      color: "green",
      gradient: "from-green-500 to-green-600",
      description: `${confirmationRate}% амжилттай`,
    },
    {
      title: "Хүлээгдэж буй",
      value: pendingOrders,
      trend: getTrend(pendingOrders, 'pending'),
      icon: Clock,
      color: "yellow",
      gradient: "from-yellow-500 to-yellow-600",
      description: "Шийдвэр хүлээж буй",
    },
    {
      title: "Цуцлагдсан",
      value: cancelledOrders,
      percentage: cancellationRate,
      trend: getTrend(cancelledOrders, 'cancelled'),
      icon: AlertCircle,
      color: "red",
      gradient: "from-red-500 to-red-600",
      description: `${cancellationRate}% цуцлагдсан`,
    },
  ];

  return (
    <div className="flex-1 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Захиалгууд</h1>
              <p className="text-gray-600 mt-1">
                Шүүлт хийж захиалгуудыг харах
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Popover>
                <PopoverTrigger asChild>
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-200 flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" />
                    Хугацаагаар шүүх
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      setSelectedDate(date);
                      setFilter("all"); 
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Хайлт хийх..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  filter === f.value
                    ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {f.label}
                <span
                  className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    filter === f.value
                      ? "bg-white/20 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {f.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Enhanced Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {/* Background Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-semibold ${
                    stat.trend.isPositive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.trend.isPositive ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    {stat.trend.display}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>
                  <div className="flex items-baseline gap-2">
                    {stat.percentage && (
                      <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                        stat.percentage >= 80 ? 'bg-green-100 text-green-700' : 
                        stat.percentage >= 50 ? 'bg-yellow-100 text-yellow-700' : 
                        'bg-red-100 text-red-700'
                      }`}>
                        {stat.percentage}%
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{stat.description}</p>
                </div>

                {/* Progress bar for percentages */}
                {stat.percentage && (
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full bg-gradient-to-r ${stat.gradient} transition-all duration-1000 ease-out`}
                        style={{ width: `${stat.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold">Захиалгын жагсаалт</h2>
            <p className="text-sm text-gray-500 mt-1">
              Шүүлтийн дагуу харуулж байна
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Үйлчлүүлэгч
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ажилтан
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Төлөв
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Цаг
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Үйлдэл
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedOrders.map((order) => {
                  const statusConfig = getStatusConfig(order.status);
                  return (
                    <tr
                      key={order._id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {order.user?.username?.charAt(0) || "U"}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {order.user?.username || "—"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {order.employee?.employeeName || "—"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.className}`}
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full mr-2 ${statusConfig.dot}`}
                          ></div>
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatTime(order.selectedTime)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-150">
                            <Eye className="w-4 h-4" />
                          </button>
                          {order.status === "confirmed" && (
                            <button
                              onClick={() => handleCancel(order._id)}
                              className="px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-150"
                            >
                              Цуцлах
                            </button>
                          )}
                          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-150">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Өмнөх
              </button>
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium ${
                        currentPage === page
                          ? "bg-blue-500 text-white"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Дараах
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}