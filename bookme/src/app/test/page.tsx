"use client";
import { api } from "@/axios";
import { useEffect, useRef, useState } from "react";

export default function LocationPicker() {
  const mapRef = useRef<HTMLDivElement>(null);
  const defaultCenter = { lat: 47.9185, lng: 106.9176 };
  const [destination, setDestination] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [travelTime, setTravelTime] = useState<string | null>(null);

  useEffect(() => {
    const initMap = () => {
      const map = new google.maps.Map(mapRef.current!, {
        center: defaultCenter,
        zoom: 13,
      });

      const defaultMarker = new google.maps.Marker({
        position: defaultCenter,
        map,
        title: "Гарах цэг (УБ төв)",
      });

      let destinationMarker: google.maps.Marker | null = null;

      map.addListener("click", async (e: google.maps.MapMouseEvent) => {
        const lat = e.latLng?.lat();
        const lng = e.latLng?.lng();
        if (lat && lng) {
          const dest = { lat, lng };
          setDestination(dest);

          if (destinationMarker) {
            destinationMarker.setMap(null);
          }

          destinationMarker = new google.maps.Marker({
            position: dest,
            map,
            title: "Очих цэг",
          });

          const duration = await fetchTravelTimeWithTraffic(
            defaultCenter,
            dest
          );
          setTravelTime(duration);
        }
      });
    };

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDlBLYHFfHDRdJ9b7B02Kg-x5VXSV6iIVA&callback=initMap`;
    script.async = true;
    window.initMap = initMap;
    document.head.appendChild(script);

    return () => {
      window.initMap = () => {};
    };
  }, []);

  const fetchTravelTimeWithTraffic = async (
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number }
  ): Promise<string | null> => {
    try {
      const { data } = await api.post("/googleApi", {
        origin: `${origin.lat},${origin.lng}`,
        destination: `${destination.lat},${destination.lng}`,
      });
      console.log(data);

      return data.duration;
    } catch (error: any) {
      console.error("❌ Fetch error:", error.response?.data || error.message);
      return null;
    }
  };

  return (
    <div className="p-4">
      <div ref={mapRef} style={{ height: "500px", width: "100%" }} />

      {destination && (
        <div className="mt-4">
          <p>📍 Очих цэг:</p>
          <p>Latitude: {destination.lat}</p>
          <p>Longitude: {destination.lng}</p>
        </div>
      )}

      {travelTime && (
        <p className="mt-2 font-semibold text-blue-600">
          ⏱ Замын хөдөлгөөнтэй хугацаа: {travelTime}
        </p>
      )}
    </div>
  );
}

// typescript глобал тохиргоо
declare global {
  interface Window {
    initMap: () => void;
    google: any;
  }
}
