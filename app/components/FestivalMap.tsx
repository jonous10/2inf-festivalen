"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fikser standard Leaflet-markør i Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function FestivalMap() {
  // Eksempelkoordinater i Hamar
  const festivalLocation: [number, number] = [60.7945, 11.0679];

  return (
    <div style={{ width: "100%", height: "400px" }}>
      <MapContainer
        center={festivalLocation}
        zoom={15}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "12px",
        }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={festivalLocation}>
          <Popup>
            <strong>2INF Festival</strong>
            <br />
            Hamar, Norge
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
