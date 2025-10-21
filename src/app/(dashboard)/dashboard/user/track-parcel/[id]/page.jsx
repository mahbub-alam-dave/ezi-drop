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

// Custom icons for sender and receiver
const createCustomIcon = (type) => {
  const colors = {
    sender: "#3B82F6", // Blue for sender
    receiver: "#10B981" // Green for receiver
  };
  
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
        
        const res = await fetch("/api/parcels");
        if (!res.ok) throw new Error("Failed to fetch parcels");
        
        const data = await res.json();
        const allParcels = Array.isArray(data.data) ? data.data : [];
        
        console.log("All parcels:", allParcels);
        console.log("Looking for parcel ID:", id);

        const foundParcel = allParcels.find(p => p._id === id || p.parcelId === id);
        
        if (!foundParcel) {
          throw new Error("Parcel not found");
        }

        setParcel(foundParcel);
        console.log("Found parcel:", foundParcel);

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

      await calculateOpenRouteServiceRoute(startLon, startLat, endLon, endLat);
      
    } catch (error) {
      console.warn("OpenRouteService failed:", error);
      
      try {
        setRouteStatus("Trying alternative routing service...");
        await calculateOSRMRoute(startLon, startLat, endLon, endLat);
      } catch (osrmError) {
        console.warn("OSRM also failed:", osrmError);
        
        setRouteStatus("Using estimated route");
        createRealisticRoute(startLon, startLat, endLon, endLat);
      }
    }
  };

  // OpenRouteService Route Calculation
  const calculateOpenRouteServiceRoute = async (startLon, startLat, endLon, endLat) => {
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

  // Create realistic route with waypoints
  const createRealisticRoute = (startLon, startLat, endLon, endLat) => {
    const waypoints = [
      [startLat, startLon],
      [startLat + (endLat - startLat) * 0.2, startLon + (endLon - startLon) * 0.1],
      [startLat + (endLat - startLat) * 0.4, startLon + (endLon - startLon) * 0.3],
      [startLat + (endLat - startLat) * 0.6, startLon + (endLon - startLon) * 0.5],
      [startLat + (endLat - startLat) * 0.8, startLon + (endLon - startLon) * 0.7],
      [endLat, endLon]
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center items-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading parcel Tracking...</p>
        </div>
      </div>
    );
  }

  if (error || !parcel) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center items-center p-6">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Parcel Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error || "The requested parcel could not be found."}</p>
          <button 
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!parcel.pickupLocation || !parcel.deliveryLocation) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">Location Data Missing</h2>
            <p className="text-yellow-700 dark:text-yellow-300 mt-2">Unable to display map. Parcel location information is incomplete.</p>
          </div>
          
          {/* Parcel Info Card */}
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Parcel Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Parcel ID</label>
                  <p className="text-gray-900 dark:text-white font-semibold">{parcel.parcelId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Sender</label>
                  <p className="text-gray-900 dark:text-white">{parcel.senderName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Receiver</label>
                  <p className="text-gray-900 dark:text-white">{parcel.receiverName}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Pickup</label>
                  <p className="text-gray-900 dark:text-white">{parcel.pickupDistrict}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Delivery</label>
                  <p className="text-gray-900 dark:text-white">{parcel.deliveryDistrict}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    parcel.status === "delivered" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" :
                    parcel.status === "in_transit" ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" :
                    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                  }`}>
                    {parcel.status?.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6 lg:mb-8 border border-gray-100 dark:border-gray-700">
  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
    <div className="flex-1">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
        📦 Tracking Parcel: <span className="text-blue-600 dark:text-blue-400">{parcel.parcelId}</span>
      </h1>
      
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
        {/* Sender Info */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <strong className="text-gray-700 dark:text-gray-300">Sender:</strong>
            <span className="font-semibold text-gray-900 dark:text-white">{parcel.senderName}</span>
          </div>
        </div>

        {/* Receiver Info */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <strong className="text-gray-700 dark:text-gray-300">Receiver:</strong>
            <span className="font-semibold text-gray-900 dark:text-white">{parcel.receiverName}</span>
          </div>
        </div>

        {/* Status - HIGHLIGHTED VERSION */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-ping"></div>
            <strong className="text-gray-700 dark:text-gray-300">Status:</strong>
            <span className={`px-4 py-2.5 rounded-xl text-sm font-bold tracking-wide transform transition-all duration-300 hover:scale-105 ${
              parcel.status === "delivered" ? 
                "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/40 border border-green-300" :
              parcel.status === "in_transit" ? 
                "bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg shadow-blue-500/40 border border-blue-300 animate-pulse" :
                "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/40 border border-amber-300"
            }`}>
              <span className="mr-2">
                {parcel.status === "delivered" ? "✅" : parcel.status === "in_transit" ? "🚚" : "⏳"}
              </span>
              {parcel.status?.replace('_', ' ').toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </div>
    
    <button 
      onClick={() => window.history.back()}
      className="px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl transition-all duration-200 font-medium whitespace-nowrap hover:shadow-lg border border-gray-200 dark:border-gray-600"
    >
      ← Back to List
    </button>
  </div>
</div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Map Section */}
          <div className="xl:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">🚚 Delivery Route Map</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Real-time road route from sender to receiver
                </p>
              </div>
              <div className="relative">
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
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          routeStatus.includes('✓') ? 'bg-green-500' : 
                          routeStatus.includes('Failed') ? 'bg-red-500' : 'bg-yellow-500'
                        }`}></div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {routeStatus}
                        </span>
                      </div>
                      {routeCoords.length > 0 && (
                        <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded-full font-medium">
                          {routeCoords.length} points
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Section */}
          <div className="space-y-6 lg:space-y-8">
            {/* Progress Bar */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Delivery Progress</h3>
              <div className="space-y-4">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                  <div
                    className="h-4 bg-gradient-to-r from-blue-500 via-yellow-500 to-green-500 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Sender
                  </span>
                  <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    In Transit
                  </span>
                  <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Receiver
                  </span>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{progress}%</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Delivery Completed</p>
                </div>
              </div>
            </div>

            {/* Route Information */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Route Information</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm">📤</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-blue-700 dark:text-blue-300">Pickup Location</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 font-medium mt-1">{parcel.pickupDistrict}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                      {parcel.pickupLocation.display_name}
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <div className="w-0.5 h-6 bg-gray-300 dark:bg-gray-600"></div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm">📥</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-green-700 dark:text-green-300">Delivery Location</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 font-medium mt-1">{parcel.deliveryDistrict}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                      {parcel.deliveryLocation.display_name}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Parcel Details */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Parcel Details</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Parcel Type</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{parcel.parcelType}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Weight</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{parcel.weight} kg</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Amount</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{parcel.amount} ৳</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Payment</p>
                    <p className={`text-sm font-medium ${
                      parcel.payment === "done" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                    }`}>
                      {parcel.payment === "done" ? "Paid" : "Pending"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}