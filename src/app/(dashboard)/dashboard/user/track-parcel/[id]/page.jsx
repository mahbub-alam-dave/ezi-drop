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

// Custom icons for sender and receiver (Fixed btoa issue)
const createCustomIcon = (type) => {
  const colors = {
    sender: "#3B82F6", // Blue for sender
    receiver: "#10B981" // Green for receiver
  };
  
  // Use SVG paths instead of emojis
  const svgPaths = {
    sender: `<path d="M16 4L12 8H14V16H18V8H20L16 4Z" fill="white"/>
             <path d="M8 8H10V12H22V14H10V18H8V8Z" fill="white"/>`,
    receiver: `<path d="M16 4L20 8H18V16H14V8H12L16 4Z" fill="white"/>
               <path d="M8 8H6V18H8V14H22V12H8V8Z" fill="white"/>`
  };

  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
      <rect width="32" height="32" rx="16" fill="${colors[type]}" stroke="#fff" stroke-width="2"/>
      ${svgPaths[type]}
    </svg>
  `;

  // Use encodeURIComponent instead of btoa for Unicode characters
  const encodedSvg = encodeURIComponent(svgString);

  return new L.Icon({
    iconUrl: `data:image/svg+xml;utf8,${encodedSvg}`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

const senderIcon = createCustomIcon("sender");
const receiverIcon = createCustomIcon("receiver");

export default function ParcelMapPage() {
  const { id } = useParams();
  const [parcel, setParcel] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [routeStatus, setRouteStatus] = useState("Calculating route...");

  // Fetch ALL parcels এবং specific ID দিয়ে filter
  useEffect(() => {
    const fetchParcelById = async () => {
      try {
        setLoading(true);
        setError("");
        setRouteStatus("Calculating route...");
        
        // সব parcels fetch করুন
        const res = await fetch("/api/parcels");
        if (!res.ok) throw new Error("Failed to fetch parcels");
        
        const data = await res.json();
        const allParcels = Array.isArray(data.data) ? data.data : [];
        
        console.log("All parcels:", allParcels);
        console.log("Looking for parcel ID:", id);

        // Specific ID দিয়ে parcel খুঁজুন
        const foundParcel = allParcels.find(p => p._id === id || p.parcelId === id);
        
        if (!foundParcel) {
          throw new Error("Parcel not found");
        }

        setParcel(foundParcel);
        console.log("Found parcel:", foundParcel);

        // Real Road Route calculation
        if (foundParcel?.pickupLocation && foundParcel?.deliveryLocation) {
          await calculateRealRoadRoute(
            foundParcel.pickupLocation,
            foundParcel.deliveryLocation
          );
        } else {
          setRouteStatus("Location data incomplete");
        }
      } catch (err) {
        console.error("Parcel fetch error:", err);
        setError(err.message);
        setRouteStatus("Failed to calculate route");
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchParcelById();
    }
  }, [id]);

  // Real Road Route Calculation Function
  const calculateRealRoadRoute = async (pickupLocation, deliveryLocation) => {
    try {
      const startLon = parseFloat(pickupLocation.lon);
      const startLat = parseFloat(pickupLocation.lat);
      const endLon = parseFloat(deliveryLocation.lon);
      const endLat = parseFloat(deliveryLocation.lat);

      console.log("Calculating road route from:", [startLon, startLat], "to:", [endLon, endLat]);
      setRouteStatus("Calculating optimal road route...");

      // Try OpenRouteService first
      await calculateOpenRouteServiceRoute(startLon, startLat, endLon, endLat);
      
    } catch (error) {
      console.warn("OpenRouteService failed:", error);
      
      // Fallback: Use OSRM (Open Source Routing Machine)
      try {
        setRouteStatus("Trying alternative routing service...");
        await calculateOSRMRoute(startLon, startLat, endLon, endLat);
      } catch (osrmError) {
        console.warn("OSRM also failed:", osrmError);
        
        // Final fallback: Create realistic route with waypoints
        setRouteStatus("Using estimated route");
        createRealisticRoute(startLon, startLat, endLon, endLat);
      }
    }
  };

  // OpenRouteService Route Calculation
  const calculateOpenRouteServiceRoute = async (startLon, startLat, endLon, endLat) => {
    // Replace with your actual OpenRouteService API key
    const apiKey = process.env.NEXT_PUBLIC_OPENROUTE_API_KEY || 'YOUR_API_KEY';
    
    const response = await fetch(
      `https://api.openrouteservice.org/v2/directions/driving-car/geojson`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': apiKey
        },
        body: JSON.stringify({
          coordinates: [
            [startLon, startLat],
            [endLon, endLat]
          ],
          instructions: false,
          preference: 'recommended'
        })
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log("OpenRouteService Response:", data);

      if (data.features && data.features[0]?.geometry?.coordinates) {
        // Convert coordinates from [lon, lat] to [lat, lon] for Leaflet
        const roadCoordinates = data.features[0].geometry.coordinates.map(([lon, lat]) => [lat, lon]);
        setRouteCoords(roadCoordinates);
        setRouteStatus("Real road route calculated ✓");
        console.log("Road route coordinates:", roadCoordinates);
      } else {
        throw new Error("No route found in response");
      }
    } else {
      throw new Error(`OpenRouteService API failed: ${response.status}`);
    }
  };

  // OSRM Fallback Route Calculation
  const calculateOSRMRoute = async (startLon, startLat, endLon, endLat) => {
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${startLon},${startLat};${endLon},${endLat}?overview=full&geometries=geojson`
    );

    if (response.ok) {
      const data = await response.json();
      if (data.routes && data.routes[0]?.geometry?.coordinates) {
        const coordinates = data.routes[0].geometry.coordinates.map(([lon, lat]) => [lat, lon]);
        setRouteCoords(coordinates);
        setRouteStatus("Route calculated via OSRM ✓");
        console.log("OSRM route coordinates:", coordinates);
      } else {
        throw new Error("No route data in OSRM response");
      }
    } else {
      throw new Error("OSRM route calculation failed");
    }
  };

  // Create realistic route with waypoints (simulating road paths)
  const createRealisticRoute = (startLon, startLat, endLon, endLat) => {
    // Add intermediate waypoints to simulate road routes
    const waypoints = [
      [startLat, startLon], // Start point
      [startLat + (endLat - startLat) * 0.2, startLon + (endLon - startLon) * 0.1], // Waypoint 1
      [startLat + (endLat - startLat) * 0.4, startLon + (endLon - startLon) * 0.3], // Waypoint 2
      [startLat + (endLat - startLat) * 0.6, startLon + (endLon - startLon) * 0.5], // Waypoint 3
      [startLat + (endLat - startLat) * 0.8, startLon + (endLon - startLon) * 0.7], // Waypoint 4
      [endLat, endLon] // End point
    ];
    
    setRouteCoords(waypoints);
    setRouteStatus("Estimated route displayed");
    console.log("Using realistic route with waypoints:", waypoints);
  };

  // Progress calculation
  useEffect(() => {
    if (!parcel) return;

    let calculatedProgress = 0;

    switch (parcel.status) {
      case "not_picked":
        calculatedProgress = parcel.payment === "done" ? 10 : 0;
        break;
      case "in_transit":
        calculatedProgress = 50;
        break;
      case "delivered":
        calculatedProgress = 100;
        break;
      default:
        calculatedProgress = 0;
    }

    setProgress(calculatedProgress);
  }, [parcel]);

  if (loading) {
    return (
      <div className="flex justify-center h-screen items-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading parcel details...</p>
        </div>
      </div>
    );
  }

  if (error || !parcel) {
    return (
      <div className="flex justify-center h-screen items-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Parcel Not Found</h2>
          <p className="text-gray-600">{error || "The requested parcel could not be found."}</p>
          <button 
            onClick={() => window.history.back()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!parcel.pickupLocation || !parcel.deliveryLocation) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-yellow-800">Location Data Missing</h2>
          <p className="text-yellow-700">Unable to display map. Parcel location information is incomplete.</p>
        </div>
        
        {/* Parcel Info Card */}
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Parcel Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><strong>Parcel ID:</strong> {parcel.parcelId}</p>
              <p><strong>Sender:</strong> {parcel.senderName}</p>
              <p><strong>Receiver:</strong> {parcel.receiverName}</p>
              <p><strong>Status:</strong> 
                <span className={`ml-2 px-2 py-1 rounded text-xs ${
                  parcel.status === "delivered" ? "bg-green-100 text-green-800" :
                  parcel.status === "in_transit" ? "bg-blue-100 text-blue-800" :
                  "bg-yellow-100 text-yellow-800"
                }`}>
                  {parcel.status}
                </span>
              </p>
            </div>
            <div>
              <p><strong>Pickup:</strong> {parcel.pickupDistrict}</p>
              <p><strong>Delivery:</strong> {parcel.deliveryDistrict}</p>
              <p><strong>Payment:</strong> 
                <span className={`ml-2 px-2 py-1 rounded text-xs ${
                  parcel.payment === "done" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}>
                  {parcel.payment}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const pickupLat = parseFloat(parcel.pickupLocation.lat);
  const pickupLon = parseFloat(parcel.pickupLocation.lon);
  const deliveryLat = parseFloat(parcel.deliveryLocation.lat);
  const deliveryLon = parseFloat(parcel.deliveryLocation.lon);

  const centerLat = (pickupLat + deliveryLat) / 2;
  const centerLon = (pickupLon + deliveryLon) / 2;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📦 Tracking Parcel: {parcel.parcelId}
          </h1>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <strong className="mr-2">Sender:</strong>
              {parcel.senderName}
            </div>
            <div className="flex items-center">
              <strong className="mr-2">Receiver:</strong>
              {parcel.receiverName}
            </div>
            <div className="flex items-center">
              <strong className="mr-2">Status:</strong>
              <span className={`px-2 py-1 rounded text-xs ${
                parcel.status === "delivered" ? "bg-green-100 text-green-800" :
                parcel.status === "in_transit" ? "bg-blue-100 text-blue-800" :
                "bg-yellow-100 text-yellow-800"
              }`}>
                {parcel.status?.replace('_', ' ').toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 border-b">
                <h2 className="text-xl font-semibold">🚚 Delivery Route Map</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Real-time road route from sender to receiver
                </p>
              </div>
              <MapContainer
                center={[centerLat, centerLon]}
                zoom={10}
                style={{ height: "500px", width: "100%" }}
                className="z-0"
              >
                <TileLayer 
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {/* Sender Marker (Pickup) */}
                <Marker position={[pickupLat, pickupLon]} icon={senderIcon}>
                  <Popup>
                    <div className="text-sm min-w-[200px]">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <strong className="text-blue-600">Sender Location</strong>
                      </div>
                      <p><strong>Name:</strong> {parcel.senderName}</p>
                      <p><strong>Phone:</strong> {parcel.senderPhone}</p>
                      <p><strong>Address:</strong> {parcel.pickupLocation.display_name}</p>
                      <p><strong>District:</strong> {parcel.pickupDistrict}</p>
                    </div>
                  </Popup>
                </Marker>

                {/* Receiver Marker (Delivery) */}
                <Marker position={[deliveryLat, deliveryLon]} icon={receiverIcon}>
                  <Popup>
                    <div className="text-sm min-w-[200px]">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <strong className="text-green-600">Receiver Location</strong>
                      </div>
                      <p><strong>Name:</strong> {parcel.receiverName}</p>
                      <p><strong>Phone:</strong> {parcel.receiverPhone}</p>
                      <p><strong>Address:</strong> {parcel.deliveryLocation.display_name}</p>
                      <p><strong>District:</strong> {parcel.deliveryDistrict}</p>
                    </div>
                  </Popup>
                </Marker>

                {/* Real Road Route Polyline */}
                {routeCoords.length > 0 ? (
                  <Polyline 
                    positions={routeCoords} 
                    color="#DC2626" 
                    weight={5}
                    opacity={0.8}
                  />
                ) : (
                  // Fallback straight line
                  <Polyline
                    positions={[
                      [pickupLat, pickupLon],
                      [deliveryLat, deliveryLon]
                    ]}
                    color="#6B7280"
                    weight={3}
                    opacity={0.5}
                    dashArray="5, 5"
                  />
                )}
              </MapContainer>
              
              {/* Route Status */}
              <div className="p-4 border-t bg-gray-50">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      routeStatus.includes('✓') ? 'bg-green-500' : 
                      routeStatus.includes('Failed') ? 'bg-red-500' : 'bg-yellow-500'
                    }`}></div>
                    <span className="text-gray-700">
                      {routeStatus}
                    </span>
                  </div>
                  {routeCoords.length > 0 && (
                    <span className="text-green-600 font-medium">
                      {routeCoords.length} route points
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Progress & Info Section */}
          <div className="space-y-6">
            {/* Progress Bar */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Delivery Progress</h3>
              <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                <div
                  className="h-4 bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Sender
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  In Transit
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Receiver
                </span>
              </div>
              <p className="mt-2 text-center font-medium text-lg">
                {progress}% completed
              </p>
            </div>

            {/* Route Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Route Information</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 text-sm">📤</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-blue-600">From Sender</p>
                    <p className="text-sm text-gray-600 truncate">{parcel.pickupDistrict}</p>
                    <p 
                      className="text-xs text-gray-500 break-words line-clamp-2"
                      title={parcel.pickupLocation.display_name}
                    >
                      {parcel.pickupLocation.display_name}
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <div className="w-0.5 h-8 bg-gray-300"></div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 text-sm">📥</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-green-600">To Receiver</p>
                    <p className="text-sm text-gray-600 truncate">{parcel.deliveryDistrict}</p>
                    <p 
                      className="text-xs text-gray-500 break-words line-clamp-2"
                      title={parcel.deliveryLocation.display_name}
                    >
                      {parcel.deliveryLocation.display_name}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Parcel Details */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Parcel Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Parcel Type:</span>
                  <span className="font-medium">{parcel.parcelType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Weight:</span>
                  <span className="font-medium">{parcel.weight} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium">{parcel.amount} ৳</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment:</span>
                  <span className={`font-medium ${
                    parcel.payment === "done" ? "text-green-600" : "text-red-600"
                  }`}>
                    {parcel.payment === "done" ? "Paid" : "Pending"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}