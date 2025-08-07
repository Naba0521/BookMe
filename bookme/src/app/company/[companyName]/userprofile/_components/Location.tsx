"use client";
import { useEffect, useRef } from "react";

type LocationPickerProps = {
  onSelect: (result: { lat: number; lng: number; address: string }) => void;
};

export const LocPicker = ({ onSelect }: LocationPickerProps) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const initMap = () => {
      const map = new google.maps.Map(mapRef.current!, {
        center: { lat: 47.9185, lng: 106.9176 },
        zoom: 13,
      });

      let marker: google.maps.Marker | null = null;

      map.addListener("click", async (e: google.maps.MapMouseEvent) => {
        const lat = e.latLng?.lat();
        const lng = e.latLng?.lng();

        if (lat && lng) {
          const coords = { lat, lng };

          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ location: coords }, (results, status) => {
            if (status === "OK" && results && results[0]) {
              const address = results[0].formatted_address;

              if (marker) marker.setMap(null);
              marker = new google.maps.Marker({
                position: coords,
                map,
              });

              onSelect({ lat, lng, address });
            } else {
              console.error("Geocoder failed:", status);
            }
          });
        }
      });
    };

    const existingScript = document.getElementById("google-maps-script");

    if (!existingScript) {
      const script = document.createElement("script");
      script.id = "google-maps-script";
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDlBLYHFfHDRdJ9b7B02Kg-x5VXSV6iIVA&callback=initMap`;
      script.async = true;
      script.onload = () => {
        initMap();
      };
      document.head.appendChild(script);
    } else {
      window.initMap = initMap;
      if (window.google) {
        initMap();
      }
    }

    return () => {
      window.initMap = () => {};
    };
  }, [onSelect]);

  return <div ref={mapRef} style={{ height: "400px", width: "100%" }} />;
};

declare global {
  interface Window {
    initMap: () => void;
    google: any;
  }
}
