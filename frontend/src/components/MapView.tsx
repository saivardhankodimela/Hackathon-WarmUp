"use client";

import { useLoadScript, GoogleMap, Marker } from "@react-google-maps/api";
import { useMemo } from "react";

interface MapViewProps {
  latitude: number;
  longitude: number;
  zoom?: number;
}

export default function MapView({ latitude, longitude, zoom = 14 }: MapViewProps) {
  // UseNEXT_PUBLIC_GOOGLE_MAPS_API_KEY for the map
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: apiKey,
  });

  const center = useMemo(() => ({ lat: latitude, lng: longitude }), [latitude, longitude]);

  if (!isLoaded) return <div className="w-full h-full bg-slate-800/50 animate-pulse flex items-center justify-center text-xs text-slate-500 rounded-lg">Loading Map...</div>;
  if (!apiKey) return <div className="w-full h-full bg-slate-800/50 flex items-center justify-center text-xs text-slate-500 rounded-lg">Map API Key Missing</div>;

  return (
    <GoogleMap
      zoom={zoom}
      center={center}
      mapContainerClassName="w-full h-full rounded-lg"
      options={{
        disableDefaultUI: true,
        zoomControl: true,
        styles: [
          { elementType: "geometry", stylers: [{ color: "#0f172a" }] },
          { elementType: "labels.text.stroke", stylers: [{ color: "#0f172a" }] },
          { elementType: "labels.text.fill", stylers: [{ color: "#94a3b8" }] },
          {
            featureType: "administrative.locality",
            elementType: "labels.text.fill",
            stylers: [{ color: "#cbd5e1" }],
          },
          {
            featureType: "poi",
            elementType: "labels.text.fill",
            stylers: [{ color: "#475569" }],
          },
          {
            featureType: "poi.park",
            elementType: "geometry",
            stylers: [{ color: "#1e293b" }],
          },
          {
            featureType: "poi.park",
            elementType: "labels.text.fill",
            stylers: [{ color: "#64748b" }],
          },
          {
            featureType: "road",
            elementType: "geometry",
            stylers: [{ color: "#334155" }],
          },
          {
            featureType: "road",
            elementType: "geometry.stroke",
            stylers: [{ color: "#1e293b" }],
          },
          {
            featureType: "road",
            elementType: "labels.text.fill",
            stylers: [{ color: "#94a3b8" }],
          },
          {
            featureType: "road.highway",
            elementType: "geometry",
            stylers: [{ color: "#475569" }],
          },
          {
            featureType: "road.highway",
            elementType: "geometry.stroke",
            stylers: [{ color: "#1e293b" }],
          },
          {
            featureType: "road.highway",
            elementType: "labels.text.fill",
            stylers: [{ color: "#cbd5e1" }],
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#020617" }],
          },
          {
            featureType: "water",
            elementType: "labels.text.fill",
            stylers: [{ color: "#334155" }],
          },
          {
            featureType: "water",
            elementType: "labels.text.stroke",
            stylers: [{ color: "#020617" }],
          },

        ],
      }}
    >
      <Marker position={center} icon={{ url: "http://maps.google.com/mapfiles/ms/icons/cyan-dot.png" }} />
    </GoogleMap>
  );
}
