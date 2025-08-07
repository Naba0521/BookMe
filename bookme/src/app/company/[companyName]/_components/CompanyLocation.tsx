"use client";

import { LocPickerCompany } from "@/app/signup/_components/LocPicker";
import { Company } from "./CompanyTypes";

export const CompanyLocation = ({
  company,
  companyLocation,
}: {
  company: Company;
  companyLocation: { lat: number; lng: number } | null;
}) => {
  return (
    <section className="py-20 " id="location">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Байршил
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Манай салоны байршил
          </p>
        </div>
        <div className="w-full h-[400px] rounded-xl overflow-hidden shadow-lg">
          <LocPickerCompany
            defaultLocation={{
              lat: companyLocation?.lat || 47.9185,
              lng: companyLocation?.lng || 106.9176,
              address: company.address,
            }}
            onSelect={() => {}}
          />
        </div>
        {company?.address && (
          <div className="mt-6 text-center text-gray-700">
            <p className="font-medium">{company.address}</p>
          </div>
        )}
      </div>
    </section>
  );
};
