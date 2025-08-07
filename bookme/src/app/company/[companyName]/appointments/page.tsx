"use client";
import { useAuth } from "@/app/_providers/UserAuthProvider";
import { api } from "@/axios";
import { useEffect, useState } from "react";
import { Navbar } from "../userprofile/_components/Navbar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";

type OrderType = {
  _id: string;
  selectedTime: string;
  status: "confirmed" | "cancelled" | string;
  company: {
    _id: string;
    companyName: string;
    companyLogo: string;
    companyImages: string[];
    address: string;
  };
  employee: {
    _id: string;
    employeeName: string;
    profileImage: string;
  };
};

export default function Home() {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [isClicked, setIsClicked] = useState<OrderType | null>(null);
  const { user } = useAuth();
  const params = useParams();
  const companyName = params?.companyName as string;
  const cancelledOrders = orders.filter((o) => o.status === "cancelled");
  const confirmedOrders = orders.filter((o) => o.status === "confirmed");

  const fetchOrders = async () => {
    if (!user) return;
    try {
      const res = await api.get(`/order/user/${user._id}`);
      setOrders(res.data.bookings);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const cancelOrder = async (orderId: string) => {
    try {
      await api.patch(`/order/${orderId}/status`, { status: "cancelled" });
      await fetchOrders();
      setIsClicked(null);
    } catch (error) {
      console.error("Захиалгыг цуцлах үед алдаа:", error);
    }
  };
  return (
    <div className="min-h-screen bg-[#f9f9f9] flex flex-col items-center pb-10">
      <Navbar />
      <div className="w-full max-w-[1440px] px-6 mt-20 flex flex-col gap-10">
        <h1 className="text-[32px] font-bold text-gray-800">Захиалгын түүх</h1>
        {orders.length === 0 ? (
          <p className="text-gray-400 text-lg">
            Та ямар нэгэн захиалга хийгээгүй байна.
          </p>
        ) : (
          <div className="flex flex-wrap gap-8">
            <div className="flex flex-col gap-4 w-[420px] max-h-[450px] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-transparent pr-2">
              <p className="text-[20px] font-semibold flex items-center gap-2">
                ✅ Баталгаажсан захиалгууд
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-[14px]">
                  {confirmedOrders.length}
                </span>
              </p>
              {confirmedOrders.length > 0 ? (
                confirmedOrders.reverse().map((order) => (
                  <div
                    key={order._id}
                    onClick={() => setIsClicked(order)}
                    className="flex gap-4 p-3 bg-white rounded-xl border border-gray-300 shadow hover:shadow-md cursor-pointer transition"
                  >
                    <img
                      src={order.company.companyLogo}
                      className="w-[110px] h-[110px] object-cover rounded-lg"
                      alt="company"
                    />
                    <div className="flex flex-col justify-between py-1">
                      <p className="font-bold text-[16px] text-gray-800">
                        {order.company.companyName}
                      </p>
                      <p className="text-sm text-gray-500">
                        🕒 {order.selectedTime}
                      </p>
                      <p className="text-sm text-gray-500">
                        👤{" "}
                        {order.employee?.employeeName || "Ажилтан сонгоогүй."}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm">Идэвхтэй захиалга алга.</p>
              )}
            </div>

            <div className="flex flex-col gap-4 w-[420px] max-h-[450px] overflow-y-auto scrollbar-thin scrollbar-thumb-red-400 scrollbar-track-transparent pr-2">
              <p className="text-[20px] font-semibold flex items-center gap-2">
                ❌ Цуцлагдсан захиалгууд
                <span className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-[14px]">
                  {cancelledOrders.length}
                </span>
              </p>
              {cancelledOrders.length > 0 ? (
                cancelledOrders.reverse().map((order) => (
                  <div
                    key={order._id}
                    onClick={() => setIsClicked(order)}
                    className="flex gap-4 p-3 bg-white rounded-xl border border-gray-300 shadow hover:shadow-md cursor-pointer transition"
                  >
                    <img
                      src={order.company.companyLogo}
                      className="w-[110px] h-[110px] object-cover rounded-lg"
                      alt="company"
                    />
                    <div className="flex flex-col justify-between py-1">
                      <p className="font-bold text-[16px] text-gray-800">
                        {order.company.companyName}
                      </p>
                      <p className="text-sm text-gray-500">
                        🕒 {order.selectedTime}
                      </p>
                      <p className="text-sm text-gray-500">
                        👤{" "}
                        {order.employee?.employeeName || "Ажилтан сонгоогүй."}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm">
                  Цуцлагдсан захиалга байхгүй.
                </p>
              )}
            </div>

            <div className=" flex-1 bg-white p-6 rounded-xl border border-gray-300 shadow-sm h-fit mt-6">
              {isClicked ? (
                <>
                  <img
                    src={isClicked.company.companyImages?.[0]}
                    className="w-full h-[280px] object-cover rounded-lg mb-4"
                    alt="booking"
                  />
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {isClicked.company.companyName}
                  </h2>
                  <p className="text-md text-gray-600 mb-1">
                    📅 {isClicked.selectedTime.split(",")[0]} –{" "}
                    {isClicked.selectedTime.split(",")[1]}
                  </p>
                  <p className="text-md text-gray-600 mb-2">
                    🕒 {isClicked.selectedTime.split(",")[2]}
                  </p>
                  <div className="flex items-center gap-3 mt-4">
                    <img
                      src={isClicked.employee?.profileImage}
                      className="w-10 h-10 rounded-full"
                      alt="employee"
                    />
                    <p className="text-md text-gray-700">
                      👤{" "}
                      {isClicked.employee?.employeeName || "Ажилтан сонгоогүй."}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsClicked(null)}
                    className="mt-6 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition cursor-pointer"
                  >
                    Хаах
                  </button>
                  <button
                    onClick={() => cancelOrder(isClicked._id)}
                    className="mt-6 ml-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition cursor-pointer"
                  >
                    Цуцлах
                  </button>
                </>
              ) : (
                <p className="text-gray-400">Захиалгын дэлгэрэнгүй.</p>
              )}
            </div>
          </div>
        )}

        <Link href={`/company/${companyName}/userprofile`} className="mt-auto">
          <Button className="relative w-full bg-[#77b8fa] hover:bg-blue-500 text-white font-medium py-2 rounded-md transition-all duration-300 cursor-pointer">
            Хэрэглэгчийн нүүр харах
          </Button>
        </Link>
      </div>
    </div>
  );
}
