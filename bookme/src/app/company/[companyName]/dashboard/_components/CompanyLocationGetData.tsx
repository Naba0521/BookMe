"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useCompanyAuth } from "@/app/_providers/CompanyAuthProvider";
import { useEffect, useState } from "react";
import { CompanyLocationEdit } from "./CompanyLocationEdit";

export const CompanyLocationGetData = () => {
  const { company } = useCompanyAuth();

  const [selectedPosition, setSelectedPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    if (company?.lat && company?.lng) {
      setSelectedPosition({
        lat: company.lat,
        lng: company.lng,
      });
    }
  }, [company]);

  return (
    <div className="w-full h-full min-h-[600px] rounded-xl overflow-hidden">
      {!selectedPosition ? (
        <Skeleton className="w-full h-full min-h-[600px]" />
      ) : (
        <div className="w-full h-full min-h-[600px]">
          <CompanyLocationEdit
            companyId={company?._id}
            selectedPosition={selectedPosition}
            setSelectedPosition={setSelectedPosition}
          />
        </div>
      )}
    </div>
  );
};