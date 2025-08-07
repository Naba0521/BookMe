"use client";

import { Clock } from "lucide-react";
import Image from "next/image";
import { Booking, Company } from "../../_components/CompanyTypes";

type BookingsTabProps = {
  company: Company;
};

export const BookingsTab = ({ company }: BookingsTabProps) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-[#3b4b60] mb-6">Захиалгууд</h2>
      <div className="grid gap-6">
        {company.bookings?.map((b) => (
          <div
            key={b._id}
            className="bg-gradient-to-r from-[#f0f4f8] to-[#e2e8f0] border border-[#dbe4ee] p-6 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between flex-wrap gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full overflow-hidden border border-[#c3d3e6]">
                  <Image
                    src={b.employee.profileImage || "/default-profile.png"}
                    alt={b.employee.employeeName}
                    width={56}
                    height={56}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <p className="text-xs text-[#7a8ca3]">Ажилтан</p>
                  <h4 className="font-medium text-[#3b4b60]">
                    {b.employee.employeeName}
                  </h4>
                </div>
              </div>

              <div>
                <p className="text-xs text-[#7a8ca3]">Хэрэглэгч</p>
                <h4 className="font-medium text-[#3b4b60]">
                  {b.user.username}
                </h4>
              </div>
              <div className="flex items-center gap-2 text-[#5e6e84]">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">{b.selectedTime}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
