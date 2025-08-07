"use client";

import ProfileCard from "@/blocks/Components/ProfileCard/ProfileCard";
import { Company, Employee } from "./CompanyTypes";

export const CompanyEmployees = ({ company }: { company: Company }) => {
  console.log(company.employees);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Бидний хамт олон
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Манай мэргэжлийн баг танд төгс үйлчилгээг үзүүлэхэд бэлэн байна.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {company.employees?.map((member: Employee) => (
            <ProfileCard
              key={member._id}
              name={member.employeeName}
              title={member.description}
              handle={member.employeeName.toLowerCase().replace(/\s/g, "")}
              status="Online"
              contactText="Цаг захиалах"
              avatarUrl={member.profileImage ?? "https://res-console.cloudinary.com/dxhmgs7wt/thumbnails/v1/image/upload/v1748851861/dW11Z29xOHRkN2ppcnc3Mm1nZW0=/drilldown"}
              miniAvatarUrl={member.profileImage ?? "https://res-console.cloudinary.com/dxhmgs7wt/thumbnails/v1/image/upload/v1748851861/dW11Z29xOHRkN2ppcnc3Mm1nZW0=/drilldown"}
              showUserInfo={true}
              enableTilt={true}
              onContactClick={() =>
                console.log(`${member.employeeName} руу холбогдлоо`)
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
};
