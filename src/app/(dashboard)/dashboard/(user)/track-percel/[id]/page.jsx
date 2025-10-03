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

  useEffect(() => {
    const fetchParcel = async () => {
      try {
        const res = await fetch("/api/parcels");
        const data = await res.json();
        const foundParcel = data.find((p) => p._id === id);
        setParcel(foundParcel);

        if (foundParcel?.pickupLocation && foundParcel?.deliveryLocation) {
          const start = [
            parseFloat(foundParcel.pickupLocation.lon),
            parseFloat(foundParcel.pickupLocation.lat),
          ];
          const end = [
            parseFloat(foundParcel.deliveryLocation.lon),
            parseFloat(foundParcel.deliveryLocation.lat),
          ];

          const orsRes = await fetch(
            `https://api.openrouteservice.org/v2/directions/driving-car?api_key=eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjY0ZWUzZmFiNzkyNzQyODZhZjdjMmMxOTIzNTk2ZGI5IiwiaCI6Im11cm11cjY0In0=&start=${start[0]},${start[1]}&end=${end[0]},${end[1]}`
          );
          const orsData = await orsRes.json();

          const coords = orsData.features[0].geometry.coordinates.map(([lon, lat]) => [lat, lon]);
          setRouteCoords(coords);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchParcel();
  }, [id]);

  if (!parcel) return <p className="p-6">Loading...</p>;
  if (!parcel.pickupLocation || !parcel.deliveryLocation) return <p className="p-6 text-red-500">Parcel location data missing</p>;

  const pickupLat = parseFloat(parcel.pickupLocation.lat);
  const pickupLon = parseFloat(parcel.pickupLocation.lon);
  const deliveryLat = parseFloat(parcel.deliveryLocation.lat);
  const deliveryLon = parseFloat(parcel.deliveryLocation.lon);

  const centerLat = (pickupLat + deliveryLat) / 2;
  const centerLon = (pickupLon + deliveryLon) / 2; 
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Parcel Tracking for {parcel.receiverName}{parcel.status}</h1>

      <MapContainer center={[centerLat, centerLon]} zoom={10} style={{ height: "500px", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <Marker position={[pickupLat, pickupLon]}>
          <Popup>Pickup: {parcel.pickupLocation.display_name}</Popup>
        </Marker>

        <Marker position={[deliveryLat, deliveryLon]}>
          <Popup>Delivery: {parcel.deliveryLocation.display_name}</Popup>
        </Marker>

        {routeCoords.length > 0 && <Polyline positions={routeCoords} color="blue" />}
      </MapContainer>
    </div>
  );
}
