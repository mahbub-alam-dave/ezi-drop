"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix default icon
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function ParcelMapPage() {
  const { id } = useParams();
  const [parcel, setParcel] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [progress, setProgress] = useState(0);

  // Fetch parcel data
  useEffect(() => {
    const fetchParcel = async () => {
      try {
        const res = await fetch(`/api/parcels/${id}`);
        const data = await res.json();
        setParcel(data);
console.log(data)
        if (data?.pickupLocation && data?.deliveryLocation) {
          const start = [
            parseFloat(data.pickupLocation.lon),
            parseFloat(data.pickupLocation.lat),
          ];
          const end = [
            parseFloat(data.deliveryLocation.lon),
            parseFloat(data.deliveryLocation.lat),
          ];

          try {
            const orsRes = await fetch(
              `https://api.openrouteservice.org/v2/directions/driving-car?api_key=eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjY0ZWUzZmFiNzkyNzQyODZhZjdjMmMxOTIzNTk2ZGI5IiwiaCI6Im11cm11cjY0In0=&start=${start[0]},${start[1]}&end=${end[0]},${end[1]}`
            );
            const orsData = await orsRes.json();

            // Safe check
            let coords = [];
            if (
              orsData &&
              orsData.features &&
              Array.isArray(orsData.features) &&
              orsData.features.length > 0 &&
              orsData.features[0].geometry &&
              Array.isArray(orsData.features[0].geometry.coordinates)
            ) {
              coords = orsData.features[0].geometry.coordinates.map(([lon, lat]) => [lat, lon]);
            }

            setRouteCoords(coords);
          } catch (err) {
            console.warn("ORS route not available:", err);
            setRouteCoords([]); // যদি route না আসে
          }
        }
      } catch (err) {
        console.error("Parcel fetch error:", err);
      }
    };
    fetchParcel();
  }, [id]);

  // Handle progress bar
  useEffect(() => {
    if (!parcel) return;

    // initial progress based on payment status
    if (parcel.payment === "pending") setProgress(0);
    else if (parcel.payment === "done") setProgress(10);

    // update in-transit progress
    let interval;
    if (parcel.status === "in-transit") {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 99) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1; // 1% per hour
        });
      }, 3600 * 1000); // 1 hour in ms
    }

    // complete status
    if (parcel.status === "complete") {
      setProgress(100);
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [parcel]);
console.log(parcel)
  if (!parcel) return <p className="p-6">Loading parcel...</p>;
  if (!parcel.pickupLocation || !parcel.deliveryLocation)
    return <p className="p-6 text-red-500">Parcel location data missing</p>;

  const pickupLat = parseFloat(parcel.pickupLocation.lat);
  const pickupLon = parseFloat(parcel.pickupLocation.lon);
  const deliveryLat = parseFloat(parcel.deliveryLocation.lat);
  const deliveryLon = parseFloat(parcel.deliveryLocation.lon);

  const centerLat = (pickupLat + deliveryLat) / 2;
  const centerLon = (pickupLon + deliveryLon) / 2;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Parcel Tracking for {parcel.receiverName} ({parcel.status})
      </h1>

      <MapContainer
        center={[centerLat, centerLon]}
        zoom={10}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <Marker position={[pickupLat, pickupLon]}>
          <Popup>Pickup: {parcel.pickupLocation.display_name}</Popup>
        </Marker>

        <Marker position={[deliveryLat, deliveryLon]}>
          <Popup>Delivery: {parcel.deliveryLocation.display_name}</Popup>
        </Marker>

        {/* Only render polyline if coordinates exist */}
        {routeCoords.length > 0 && <Polyline positions={routeCoords} color="blue" />}
      </MapContainer>

      {/* Progress bar */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Parcel Progress</h2>
        <div className="w-full bg-gray-200 h-6 rounded">
          <div
            className="h-6 bg-green-500 rounded transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-1 text-sm">Parcel Delivery {progress}% completed</p>
      </div>
    </div>
  );
}
