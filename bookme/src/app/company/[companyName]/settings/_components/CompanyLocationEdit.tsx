"use client";

import { Button } from "@/components/ui/button";
import { useRef, useEffect } from "react";
import { api } from "@/axios";
import { toast } from "sonner";

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

  useEffect(() => {
    if (typeof window !== "undefined" && mapRef.current) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBUUhc8BdkQTPz6JFAXzVaDW-0ULb8DLIg&callback=initMap`;
      script.async = true;

      script.onload = () => {
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
      };

      document.head.appendChild(script);
    }
  }, []);

  const handleSaveNewLocation = async () => {
    try {
      const changedLocation = await api.put(`/company/${companyId}`, {
        lat: selectedPosition.lat,
        lng: selectedPosition.lng,
      });
      toast.success("Компанийн байршил амжилттай солигдлоо.");
    } catch (error) {
      console.error("Компанийн байршил өөрчлөхөд алдаа гарлаа.");
    }
  };

  return (
    <section className="flex flex-col w-full gap-4 p-4 bg-white h-fit rounded-2xl">
      <div className="text-[20px] font-bold">Компаны байршил</div>
      <div className="w-full h-[500px]">
        <div ref={mapRef} className="w-full h-full border rounded-md" />
      </div>

      {/* Байршлын координатыг харуулах */}
      <div className="flex justify-between w-full">
        <div className="flex text-sm text-gray-600">
          Сонгосон байршил: {selectedPosition.lat},{selectedPosition.lng}
        </div>

        <div className="flex justify-end w-full">
          <Button onClick={handleSaveNewLocation}>Байршил хадгалах</Button>
        </div>
      </div>
    </section>
  );
};
