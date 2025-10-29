"use client";
import L from "leaflet";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import { HeatmapLayer } from "react-leaflet-heatmap-layer-v3";
import polyline from "@mapbox/polyline";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
// Fix default marker icons
/* delete L.Icon.Default.prototype._getIconUrl;
const origin = typeof window !== "undefined" ? window.location.origin : "";
L.Icon.Default.mergeOptions({
  iconRetinaUrl: `${origin}/leaflet/marker-icon-2x.png`,
  iconUrl: `${origin}/leaflet/marker-icon.png`,
  shadowUrl: `${origin}/leaflet/marker-shadow.png`,
}); */


export default function RouteMap({ routeData }) {

    useEffect(() => {
    const iconRetinaUrl = new URL('/leaflet/marker-icon-2x.png', window.location.origin).toString();
    const iconUrl = new URL('/leaflet/marker-icon.png', window.location.origin).toString();
    const shadowUrl = new URL('/leaflet/marker-shadow.png', window.location.origin).toString();

    delete L.Icon.Default.prototype._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
    });
  }, []);

      // ✅ Guard: handle cases where routeData or polyline is missing
  if (!routeData?.bestRoute?.polyline) {
    return (
      <div className="h-[400px] flex items-center justify-center text-gray-500">
        Route data not available yet...
      </div>
    );
  }

  const positions = polyline.decode(routeData?.bestRoute?.polyline);

  return (
    <div className="h-[400px] w-full rounded-xl overflow-hidden shadow-md">
      <MapContainer
        center={[positions[0][0], positions[0][1]]}
        zoom={10}
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        <Polyline positions={positions} pathOptions={{ color: "blue", weight: 5 }} />

        <Marker position={positions[0]}>
          <Popup>Start Location</Popup>
        </Marker>
        <Marker position={positions[positions?.length - 1]}>
          <Popup>Destination</Popup>
        </Marker>

        <HeatmapLayer
          points={positions.map(([lat, lon]) => ({ lat, lon, intensity: 0.7 }))}
          longitudeExtractor={(m) => m.lon}
          latitudeExtractor={(m) => m.lat}
          intensityExtractor={(m) => m.intensity}
        />
      </MapContainer>
    </div>
  );
}
