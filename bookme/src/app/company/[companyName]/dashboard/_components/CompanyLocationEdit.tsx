"use client";

import { Button } from "@/components/ui/button";
import { useRef, useEffect, useState } from "react";
import { api } from "@/axios";
import { toast } from "sonner";
import { LoadingSvg } from "@/app/_components/assets/LoadingSvg";

type Props = {
  companyId: string | undefined;
  selectedPosition: {
    lat: number;
    lng: number;
  };
  setSelectedPosition: React.Dispatch<
    React.SetStateAction<{ lat: number; lng: number } | null>
  >;
};

export const CompanyLocationEdit = ({
  companyId,
  selectedPosition,
  setSelectedPosition,
}: Props) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && mapRef.current) {
      const existingScript = document.querySelector(
        'script[src^="https://maps.googleapis.com/maps/api/js"]'
      );

      if (existingScript) {
        if (window.google && window.google.maps) {
          initMap();
        } else {
          (window as any).initMap = initMap;
        }
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDlBLYHFfHDRdJ9b7B02Kg-x5VXSV6iIVA&callback=initMap`;
      script.async = true;
      document.head.appendChild(script);
      (window as any).initMap = initMap;
    }

    function initMap() {
      const map = new google.maps.Map(mapRef.current!, {
        center: selectedPosition,
        zoom: 14,
      });

      const marker = new google.maps.Marker({
        position: selectedPosition,
        map,
        draggable: false,
        title: "Сонгосон байршил",
      });

      map.addListener("click", (event: google.maps.MapMouseEvent) => {
        if (event.latLng) {
          const newPos = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
          };
          setSelectedPosition(newPos);
          marker.setPosition(newPos);
          map.panTo(newPos);
        }
      });
    }
  }, []);

  const handleSaveNewLocation = async () => {
    setLoading(true);
    try {
      const changedLocation = await api.put(`/company/${companyId}`, {
        lat: selectedPosition.lat,
        lng: selectedPosition.lng,
      });
      toast.success("Компанийн байршил амжилттай солигдлоо.");
    } catch (error) {
      console.error("Компанийн байршил өөрчлөхөд алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full h-fit rounded-2xl p-4 flex flex-col gap-4 bg-white">
      <div className="flex flex-col p-3">
        <div className="text-[20px] font-bold">Компанийн байршил</div>
        <div className="text-[14px] font-normal text-[#aaa]">
          Байршлын мэдээлэл өөрчлөх хэсэг
        </div>
      </div>
      <div className="w-full h-[500px]">
        <div ref={mapRef} className="w-full h-full rounded-md border" />
      </div>
      <div className="w-full flex justify-between">
        <div className="text-sm text-gray-600 flex">
          Сонгосон байршил: {selectedPosition.lat},{selectedPosition.lng}
        </div>

        <div className="w-full flex justify-end">
          <Button
            onClick={handleSaveNewLocation}
            className="bg-[#007FFF]  text-white hover:bg-[#007FFF]/90 cursor-pointer"
          >
            {loading ? <LoadingSvg /> : "Байршил хадгалах"}
          </Button>
        </div>
      </div>
    </section>
  );
};
