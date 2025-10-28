"use client";
import { useState } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import "leaflet/dist/leaflet.css";
import polyline from "@mapbox/polyline";

export default function RouteSuggestionModal({ parcel, open, onClose }) {
  const [routeData, setRouteData] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleGetRoute() {
    setLoading(true);
    try {
      const { start, end } = determineStartEnd(parcel);

      const res = await fetch("/api/riders/ai-route-suggestion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parcelId: parcel.parcelId,
          start,
          end,
        }),
      });

      const data = await res.json();
      setRouteData(data);
    } catch (err) {
      console.error("Error fetching AI route:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>AI Smart Route Suggestion</DialogTitle>
        </DialogHeader>

        {!routeData ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Button onClick={handleGetRoute} disabled={loading}>
              {loading ? "Analyzing route..." : "Generate AI Route Suggestion"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="h-[400px] w-full rounded-xl overflow-hidden shadow-md">
              <MapContainer
                center={[routeData.bestRoute.start.lat, routeData.bestRoute.start.lon]}
                zoom={10}
                className="h-full w-full"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
                <Polyline
                  positions={polyline.decode(routeData.bestRoute.polyline)}
                  pathOptions={{ color: "blue", weight: 5 }}
                />
                <Marker position={[routeData.bestRoute.start.lat, routeData.bestRoute.start.lon]}>
                  <Popup>Start Location</Popup>
                </Marker>
                <Marker position={[routeData.bestRoute.end.lat, routeData.bestRoute.end.lon]}>
                  <Popup>Destination</Popup>
                </Marker>
              </MapContainer>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
              <p className="text-sm font-semibold">🧭 Best Route Suggestion</p>
              <p className="text-gray-700 text-sm mt-1">{routeData.reason}</p>
              <p className="text-gray-600 text-xs mt-1 italic">{routeData.advice}</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function determineStartEnd(parcel) {
  if (parcel.pickupDistrictId === parcel.deliveryDistrictId) {
    return {
      start: parcel.pickupLocation,
      end: parcel.deliveryLocation,
    };
  } else if (parcel.deliveryType === "to_receiver_final") {
    return {
      start: parcel.deliveryDistrictWarehouse || parcel.deliveryLocation,
      end: parcel.deliveryLocation,
    };
  } else {
    return {
      start: parcel.pickupLocation,
      end: parcel.pickupDistrictWarehouse || parcel.wirehouseAddress,
    };
  }
}
