"use client";
import { useEffect, useRef } from "react";

type LocationPickerProps = {
  onSelect: (result: { lat: number; lng: number; address: string }) => void;
  defaultLocation?: { lat: number; lng: number; address: string };
};

export const LocPickerCompany = ({
  onSelect,
  defaultLocation,
}: LocationPickerProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);

  useEffect(() => {
    const initializeMap = () => {
      const map = new google.maps.Map(mapRef.current!, {
        center: defaultLocation || { lat: 47.9185, lng: 106.9176 },
        zoom: 13,
      });

      if (defaultLocation) {
        markerRef.current = new google.maps.Marker({
          position: defaultLocation,
          map,
        });
        return;
      }

      map.addListener("click", (e: google.maps.MapMouseEvent) => {
        const lat = e.latLng?.lat();
        const lng = e.latLng?.lng();
        if (!lat || !lng) return;

        const coords = { lat, lng };

        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: coords }, (results, status) => {
          if (status === "OK" && results?.[0]) {
            const address = results[0].formatted_address;

            if (markerRef.current) {
              markerRef.current.setMap(null);
            }
            markerRef.current = new google.maps.Marker({
              position: coords,
              map,
            });

            onSelect({ lat, lng, address });
          }
        });
      });
    };

    const scriptId = "google-maps-script";
    const existingScript = document.getElementById(scriptId);

    if (!existingScript) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDlBLYHFfHDRdJ9b7B02Kg-x5VXSV6iIVA&libraries=places`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        if (window.google) initializeMap();
      };

      document.head.appendChild(script);
    } else {
      if (window.google) initializeMap();
    }
  }, [defaultLocation, onSelect]);

  return <div ref={mapRef} style={{ height: "400px", width: "100%" }} />;
};

declare global {
  interface Window {
    google: any;
  }
}
