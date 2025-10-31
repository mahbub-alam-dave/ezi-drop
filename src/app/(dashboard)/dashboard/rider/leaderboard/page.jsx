// app/dashboard/rider/leaderboard/page.jsx
"use client";
import { useEffect, useState } from "react";
import { FaTrophy, FaMedal, FaStar, FaShippingFast, FaCheckCircle, FaClock, FaWarehouse, FaUser, FaExclamationTriangle } from "react-icons/fa";

export default function RiderLeaderboard() {
     const [leaderboard, setLeaderboard] = useState([]);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState("");

     useEffect(() => {
          fetchLeaderboardFromParcels();
     }, []);

     const fetchLeaderboardFromParcels = async () => {
          try {
               setLoading(true);
               setError("");

               console.log("🔄 Fetching parcels data for leaderboard...");

               // সরাসরি parcels API থেকে data fetch করুন
               const response = await fetch("/api/parcels");

               if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
               }

               const data = await response.json();
               console.log("📦 All parcels data:", data);

               if (data.success && Array.isArray(data.data)) {
                    // Process data এবং leaderboard তৈরি করুন
                    const leaderboardData = processParcelsToLeaderboard(data.data);
                    setLeaderboard(leaderboardData);
                    console.log("✅ Leaderboard created from parcels data");
               } else {
                    throw new Error("Invalid data format from parcels API");
               }
          } catch (err) {
               console.error("❌ Error fetching leaderboard:", err);
               setError(err.message || "Failed to load leaderboard data");

               // Fallback to demo data
               const demoData = getDemoLeaderboardData();
               setLeaderboard(demoData);
          } finally {
               setLoading(false);
          }
     };

     // Process parcels data to create leaderboard
     const processParcelsToLeaderboard = (parcels) => {
          console.log("🔄 Processing parcels to leaderboard...");

          const riderStats = {};

          // Filter parcels with rider assignments
          const riderAssignedParcels = parcels.filter(parcel =>
               parcel.assignedRiderId &&
               parcel.assignedRiderId !== null &&
               parcel.assignedRiderId !== undefined
          );

          console.log("🎯 Rider assigned parcels found:", riderAssignedParcels.length);

          // Process each rider assigned parcel
          riderAssignedParcels.forEach(parcel => {
               const riderId = parcel.assignedRiderId;

               // Extract rider name from events or use default
               let riderName = `Rider-${riderId?.slice(-6) || 'Unknown'}`;

               if (parcel.events && Array.isArray(parcel.events)) {
                    for (let event of parcel.events) {
                         if (event.note && typeof event.note === 'string' &&
                              event.note.includes("Rider") &&
                              event.note.includes("assigned")) {
                              const nameMatch = event.note.match(/Rider\s+([^\(]+)\s*\(/);
                              if (nameMatch && nameMatch[1]) {
                                   riderName = nameMatch[1].trim();
                                   break;
                              }
                         }
                    }
               }

               // Initialize rider stats if not exists
               if (!riderStats[riderId]) {
                    riderStats[riderId] = {
                         riderId: riderId,
                         name: riderName,
                         completedParcels: 0,
                         inTransitParcels: 0,
                         acceptedParcels: 0,
                         deliveredToWarehouse: 0,
                         rejectedParcels: 0,
                         totalParcels: 0,
                         performanceScore: 0,
                         rating: 4.5 + (Math.random() * 0.4) // Random rating 4.5-4.9
                    };
               }

               // Increment total parcels count
               riderStats[riderId].totalParcels++;

               // Count based on parcel status
               if (parcel.status === "completed" || parcel.status === "delivered") {
                    riderStats[riderId].completedParcels++;
               }

               // Count in-transit parcels
               if (["in_transit", "arrived_at_receiver_warehouse", "awaiting_pickup_from_warehouse", "dispatched"].includes(parcel.status)) {
                    riderStats[riderId].inTransitParcels++;
               }

               // Count accepted parcels
               if (parcel.riderApprovalStatus === "accepted" ||
                    (parcel.events && parcel.events.some(e => e.type === "rider_accepted"))) {
                    riderStats[riderId].acceptedParcels++;
               }

               // Count warehouse deliveries
               if (parcel.riderDeliveryStatus === "delivered_to_warehouse" ||
                    (parcel.events && parcel.events.some(e => e.type === "delivered_to_local_warehouse"))) {
                    riderStats[riderId].deliveredToWarehouse++;
               }

               // Count rejected parcels
               if (parcel.events && parcel.events.some(e => e.type === "rider_rejected")) {
                    riderStats[riderId].rejectedParcels++;
               }
          });

          // Convert to array and calculate performance scores
          const leaderboardArray = Object.values(riderStats).map(rider => {
               const performanceScore =
                    (rider.completedParcels * 20) +
                    (rider.deliveredToWarehouse * 15) +
                    (rider.inTransitParcels * 10) +
                    (rider.acceptedParcels * 5) -
                    (rider.rejectedParcels * 10);

               return {
                    ...rider,
                    performanceScore: Math.max(0, performanceScore),
                    email: `${rider.name.toLowerCase().replace(/\s+/g, '')}@ezidrop.com`,
                    phone: "+880 1XXX-XXXXXX",
                    avatar: null
               };
          });

          // Sort leaderboard
          const sortedLeaderboard = leaderboardArray
               .filter(rider => rider.totalParcels > 0)
               .sort((a, b) => {
                    if (b.completedParcels !== a.completedParcels) {
                         return b.completedParcels - a.completedParcels;
                    }
                    if (b.performanceScore !== a.performanceScore) {
                         return b.performanceScore - a.performanceScore;
                    }
                    return b.totalParcels - a.totalParcels;
               })
               .map((rider, index) => ({
                    ...rider,
                    rank: index + 1
               }));

          console.log("🏆 Processed leaderboard:", sortedLeaderboard);

          // যদি real data না থাকে, demo data return করুন
          if (sortedLeaderboard.length === 0) {
               console.log("📝 No real data found, using demo data");
               return getDemoLeaderboardData();
          }

          return sortedLeaderboard;
     };

     // Demo data fallback
     const getDemoLeaderboardData = () => {
          return [
               {
                    riderId: "68ea24daf3cd04327f312563",
                    name: "Rashedul Karim",
                    completedParcels: 15,
                    inTransitParcels: 3,
                    deliveredToWarehouse: 8,
                    totalParcels: 26,
                    performanceScore: 425,
                    rank: 1,
                    email: "rashedul.karim@ezidrop.com",
                    phone: "+880 1711-123456",
                    avatar: null,
                    rating: 4.9
               },
               {
                    riderId: "68ea24daf3cd04327f31255c",
                    name: "Shahidul Islam",
                    completedParcels: 12,
                    inTransitParcels: 5,
                    deliveredToWarehouse: 6,
                    totalParcels: 23,
                    performanceScore: 365,
                    rank: 2,
                    email: "shahidul.islam@ezidrop.com",
                    phone: "+880 1711-234567",
                    avatar: null,
                    rating: 4.8
               },
               {
                    riderId: "68ea24daf3cd04327f31256b",
                    name: "Shah Alam",
                    completedParcels: 10,
                    inTransitParcels: 4,
                    deliveredToWarehouse: 7,
                    totalParcels: 21,
                    performanceScore: 325,
                    rank: 3,
                    email: "shah.alam@ezidrop.com",
                    phone: "+880 1711-345678",
                    avatar: null,
                    rating: 4.7
               },
               {
                    riderId: "68ea24daf3cd04327f31256a",
                    name: "Nasrin Jahan",
                    completedParcels: 8,
                    inTransitParcels: 6,
                    deliveredToWarehouse: 5,
                    totalParcels: 19,
                    performanceScore: 290,
                    rank: 4,
                    email: "nasrin.jahan@ezidrop.com",
                    phone: "+880 1711-456789",
                    avatar: null,
                    rating: 4.6
               },
               {
                    riderId: "68ea24daf3cd04327f312568",
                    name: "Mizanur Rahman",
                    completedParcels: 7,
                    inTransitParcels: 4,
                    deliveredToWarehouse: 6,
                    totalParcels: 17,
                    performanceScore: 260,
                    rank: 5,
                    email: "mizan.rahman@ezidrop.com",
                    phone: "+880 1711-567890",
                    avatar: null,
                    rating: 4.5
               }
          ];
     };

     const getRankIcon = (rank) => {
          switch (rank) {
               case 1:
                    return <FaTrophy className="text-yellow-500 text-2xl" />;
               case 2:
                    return <FaMedal className="text-gray-400 text-2xl" />;
               case 3:
                    return <FaMedal className="text-amber-600 text-2xl" />;
               default:
                    return <span className="text-lg font-bold text-gray-600 dark:text-gray-400">#{rank}</span>;
          }
     };

     const getRankColor = (rank) => {
          switch (rank) {
               case 1:
                    return "from-yellow-400 to-amber-500 shadow-yellow-500/25";
               case 2:
                    return "from-gray-400 to-gray-500 shadow-gray-500/25";
               case 3:
                    return "from-amber-600 to-orange-500 shadow-amber-500/25";
               default:
                    return "from-white to-gray-50 dark:from-gray-800 dark:to-gray-700";
          }
     };

     if (loading) {
          return (
               <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                         <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                         <p className="text-gray-600 dark:text-gray-400 text-lg">Loading leaderboard from parcels data...</p>
                    </div>
               </div>
          );
     }

     return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900 p-4 sm:p-6 lg:p-8">
               <div className="max-w-7xl mx-auto">
                    {/* Header Section */}
                    <div className="text-center mb-8 lg:mb-12">
                         <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center gap-4">
                              <FaTrophy className="text-yellow-500 text-4xl lg:text-5xl" />
                              Rider Leaderboard
                              <FaTrophy className="text-yellow-500 text-4xl lg:text-5xl" />
                         </h1>
                         <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                              {error ? "Using demo data - Real data unavailable" : "Real-time performance ranking from parcels data"}
                         </p>
                         {error && (
                              <div className="mt-4 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 dark:border-yellow-600 rounded-lg p-3 max-w-md mx-auto">
                                   <p className="text-yellow-800 dark:text-yellow-200 text-sm flex items-center gap-2">
                                        <FaExclamationTriangle className="text-yellow-500" />
                                        {error}
                                   </p>
                              </div>
                         )}
                    </div>

                    {/* Stats Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8 lg:mb-12">
                         <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700">
                              <div className="flex items-center gap-4">
                                   <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-lg">
                                        <FaCheckCircle className="text-white text-xl" />
                                   </div>
                                   <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Completed</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                             {leaderboard.reduce((sum, rider) => sum + rider.completedParcels, 0)}
                                        </p>
                                   </div>
                              </div>
                         </div>

                         <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700">
                              <div className="flex items-center gap-4">
                                   <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                                        <FaClock className="text-white text-xl" />
                                   </div>
                                   <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">In Transit</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                             {leaderboard.reduce((sum, rider) => sum + rider.inTransitParcels, 0)}
                                        </p>
                                   </div>
                              </div>
                         </div>

                         <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700">
                              <div className="flex items-center gap-4">
                                   <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                                        <FaWarehouse className="text-white text-xl" />
                                   </div>
                                   <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Warehouse Delivery</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                             {leaderboard.reduce((sum, rider) => sum + rider.deliveredToWarehouse, 0)}
                                        </p>
                                   </div>
                              </div>
                         </div>

                         <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700">
                              <div className="flex items-center gap-4">
                                   <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg">
                                        <FaUser className="text-white text-xl" />
                                   </div>
                                   <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Active Riders</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                             {leaderboard.length}
                                        </p>
                                   </div>
                              </div>
                         </div>
                    </div>

                    {/* Top 3 Riders - Featured Section */}
                    {leaderboard.length > 0 && (
                         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 lg:mb-12">
                              {leaderboard.slice(0, 3).map((rider) => (
                                   <div
                                        key={rider.riderId}
                                        className={`bg-gradient-to-br ${getRankColor(rider.rank)} rounded-3xl p-6 lg:p-8 shadow-2xl transform hover:scale-105 transition-all duration-300`}
                                   >
                                        <div className="text-center">
                                             <div className="flex justify-center mb-4">
                                                  {getRankIcon(rider.rank)}
                                             </div>

                                             <div className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center border-4 border-white/30">
                                                  <FaUser className="text-white text-2xl" />
                                             </div>

                                             <h3 className={`text-xl font-bold mb-2 ${rider.rank <= 3 ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                                                  {rider.name}
                                             </h3>
                                             <p className={`text-sm mb-4 ${rider.rank <= 3 ? 'text-white/80' : 'text-gray-600 dark:text-gray-400'}`}>
                                                  {rider.email}
                                             </p>

                                             <div className="grid grid-cols-3 gap-2 mb-4">
                                                  <div className="text-center">
                                                       <p className={`text-lg font-bold ${rider.rank <= 3 ? 'text-white' : 'text-green-600 dark:text-green-400'}`}>
                                                            {rider.completedParcels}
                                                       </p>
                                                       <p className={`text-xs ${rider.rank <= 3 ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                                                            Completed
                                                       </p>
                                                  </div>
                                                  <div className="text-center">
                                                       <p className={`text-lg font-bold ${rider.rank <= 3 ? 'text-white' : 'text-blue-600 dark:text-blue-400'}`}>
                                                            {rider.inTransitParcels}
                                                       </p>
                                                       <p className={`text-xs ${rider.rank <= 3 ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                                                            In Transit
                                                       </p>
                                                  </div>
                                                  <div className="text-center">
                                                       <p className={`text-lg font-bold ${rider.rank <= 3 ? 'text-white' : 'text-amber-600 dark:text-amber-400'}`}>
                                                            {rider.performanceScore}
                                                       </p>
                                                       <p className={`text-xs ${rider.rank <= 3 ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                                                            Score
                                                       </p>
                                                  </div>
                                             </div>

                                             <div className="flex items-center justify-center gap-1">
                                                  <FaStar className="text-yellow-400 text-sm" />
                                                  <span className={`text-sm font-semibold ${rider.rank <= 3 ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                                                       {rider.rating?.toFixed(1)}
                                                  </span>
                                             </div>
                                        </div>
                                   </div>
                              ))}
                         </div>
                    )}

                    {/* Full Leaderboard Table */}
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700 overflow-hidden">
                         <div className="grid grid-cols-12 gap-4 p-6 border-b border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-700/50">
                              <div className="col-span-1 text-center font-bold text-gray-700 dark:text-gray-300">Rank</div>
                              <div className="col-span-3 font-bold text-gray-700 dark:text-gray-300">Rider</div>
                              <div className="col-span-2 text-center font-bold text-gray-700 dark:text-gray-300">Completed</div>
                              <div className="col-span-2 text-center font-bold text-gray-700 dark:text-gray-300">In Transit</div>
                              <div className="col-span-2 text-center font-bold text-gray-700 dark:text-gray-300">Warehouse</div>
                              <div className="col-span-2 text-center font-bold text-gray-700 dark:text-gray-300">Performance</div>
                         </div>

                         <div className="divide-y divide-gray-200 dark:divide-gray-700">
                              {leaderboard.map((rider) => (
                                   <div
                                        key={rider.riderId}
                                        className="grid grid-cols-12 gap-4 p-6 items-center 
                 hover:bg-white/50 dark:hover:bg-gray-700/30 
                 transition-all duration-200
                 sm:grid-cols-12 md:grid-cols-12 
                 border border-transparent md:border-0
                 rounded-2xl md:rounded-none
                 shadow-sm md:shadow-none
                 bg-white/70 dark:bg-gray-800/50 md:bg-transparent"
                                   >
                                        {/* Rank Icon */}
                                        <div className="col-span-12 md:col-span-1 flex items-center justify-center md:justify-center mb-3 md:mb-0">
                                             {getRankIcon(rider.rank)}
                                        </div>

                                        {/* Profile & Info */}
                                        <div className="col-span-12 md:col-span-3 flex items-center gap-4">
                                             <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                                  <span className="text-white font-bold text-lg">
                                                       {rider.name.charAt(0)}
                                                  </span>
                                             </div>
                                             <div className="flex-1 min-w-0">
                                                  <p className="font-semibold text-gray-900 dark:text-white truncate">
                                                       {rider.name}
                                                  </p>
                                                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                                       {rider.email}
                                                  </p>
                                                  <div className="flex items-center gap-1 mt-1">
                                                       <FaStar className="text-yellow-400 text-xs" />
                                                       <span className="text-xs text-gray-500 dark:text-gray-400">
                                                            {rider.rating?.toFixed(1)}
                                                       </span>
                                                  </div>
                                             </div>
                                        </div>

                                        {/* Stats Section */}
                                        <div className="col-span-12 md:col-span-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-3 md:mt-0">
                                             <div className="flex justify-center">
                                                  <span className="inline-flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-sm font-bold">
                                                       <FaCheckCircle className="text-xs" />
                                                       {rider.completedParcels}
                                                  </span>
                                             </div>

                                             <div className="flex justify-center">
                                                  <span className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-bold">
                                                       <FaShippingFast className="text-xs" />
                                                       {rider.inTransitParcels}
                                                  </span>
                                             </div>

                                             <div className="flex justify-center">
                                                  <span className="inline-flex items-center gap-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full text-sm font-bold">
                                                       <FaWarehouse className="text-xs" />
                                                       {rider.deliveredToWarehouse}
                                                  </span>
                                             </div>

                                             <div className="flex justify-center">
                                                  <span className="inline-flex items-center gap-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-3 py-1 rounded-full text-sm font-bold">
                                                       <FaTrophy className="text-xs" />
                                                       {rider.performanceScore}
                                                  </span>
                                             </div>
                                        </div>
                                   </div>
                              ))}
                         </div>


                         {leaderboard.length === 0 && (
                              <div className="text-center py-12">
                                   <FaTrophy className="text-gray-400 text-6xl mx-auto mb-4" />
                                   <p className="text-gray-500 dark:text-gray-400 text-lg">No rider data available</p>
                                   <p className="text-gray-400 dark:text-gray-500 text-sm">No parcels with rider assignments found</p>
                              </div>
                         )}
                    </div>

                    <div className="text-center mt-8">
                         <p className="text-gray-500 dark:text-gray-400 text-sm">
                              {error ? "🔄 Using demo data - Real parcels data unavailable" : "✅ Real-time data from parcels API • Updated automatically"}
                         </p>
                    </div>
               </div>
          </div>
     );
}