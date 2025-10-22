"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { FiMail, FiGift } from "react-icons/fi";


export default function ReferralPage() {
  const [showInput, setShowInput] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [referrals, setReferrals] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);

  // Input validation
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    setIsValid(valid);
  };

  // Fetch referral list
  const fetchReferrals = async () => {
    try {
      const res = await fetch("/api/referrallist");
      const data = await res.json();
      if (res.ok) {
        setReferrals(data);

        // Calculate total points from all referral documents
        const total = data.reduce(
          (sum, item) => sum + (item.refererpoint || 0),
          0
        );
        setTotalPoints(total);
      } else toast.error(data.message || "Failed to fetch referrals");
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch referrals");
    }
  };

  useEffect(() => {
    fetchReferrals();
    const interval = setInterval(fetchReferrals, 60000);
    return () => clearInterval(interval);
  }, []);

  // Handle referral submit
  const handleRefer = async () => {
    try {
      const res = await fetch("/api/referraladd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Referral email sent successfully 🎉");
        setEmail("");
        setName("");
        setIsValid(false);
        setShowInput(false);
        fetchReferrals();
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to send referral");
    }
  };

  //  Status badge color logic
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "in-time":
        return "bg-green-100 text-green-700";
      case "after-time":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center dark:from-gray-900 dark:to-gray-950 transition-colors duration-300 p-6">
      <Toaster position="top-right" />
    

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl mt-12 bg-white dark:bg-gray-900 p-6 lg:p-12 rounded-2xl"
      >
        {/* Hero Section */}
        <div className="text-center mb-10">
          <motion.img
            src="https://cdn-icons-png.flaticon.com/512/869/869869.png"
            alt="Referral Illustration"
            className="w-32 mx-auto mb-4 animate-bounce"
          />
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
            Invite & Earn Rewards 🎉
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Refer your friends and earn exclusive delivery points & discounts!
          </p>
        </div>

      <div className="flex  justify-center  gap-5">
          {/*  Total Points Display */}
        <div className="flex justify-center mb-6">
          <h2 className="flex items-center gap-2 bg-purple-600 text-white px-6 py-2 rounded-xl font-medium shadow-md hover:scale-105 transition">
            Total Points: {totalPoints}
          </h2>
        </div>
        {/* Reward Info Button */}
<div className="flex justify-center mb-6">
  <button
    onClick={() => setShowModal(true)}
    className="flex items-center gap-2 bg-purple-600 text-white px-6 py-2 rounded-xl font-medium shadow-md hover:scale-105 transition"
  >
    <FiGift className="text-lg" />
    View Reward Info
  </button>
</div>
      </div>

{/* Reward Modal */}
<AnimatePresence>
  {showModal && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-md w-full shadow-xl relative"
      >
        <h2 className="text-2xl font-bold text-center text-purple-600 mb-4">
          🎁 Reward Information
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-2">
          ✅ You will earn <b>50 points</b> for each successful referral.
        </p>
        <p className="text-gray-700 dark:text-gray-300 mb-2">
          💎 If your referred person joins within 30 days, that person will get a <b>bonus of 100 points</b>.
        </p>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          📅 All rewards will be automatically added to your profile points.
        </p>
        <button
          onClick={() => setShowModal(false)}
          className="mt-4 w-full bg-purple-600 text-white py-2 rounded-xl font-semibold hover:scale-105 transition"
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>



        {/* Reward Cards */}
        <div className="grid sm:grid-cols-2 gap-6 mb-10">
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-2xl p-6 shadow-lg text-center"
          >
            <h3 className="text-3xl font-bold">100 Points</h3>
            <p>Earned user by your Referrals</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-2xl p-6 shadow-lg text-center"
          >
            <h3 className="text-3xl font-bold">50 Points</h3>
            <p>Earned You for referduser</p>
          </motion.div>
        </div>

        {/* Refer Button */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setShowInput(!showInput)}
            className="bg-[var(--color-primary)] dark:bg-[var(--color-primary-dark)] text-white px-8 py-3 rounded-2xl font-medium hover:scale-105 transition-transform"
          >
            Refer a Friend / Known Person
          </button>
        </div>

        {/* Email + Name Input Section */}
        <AnimatePresence>
          {showInput && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-6 flex flex-col items-center"
            >
              <div className="relative w-full max-w-sm mb-4">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter friend's name"
                  className="border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-purple-500 outline-none dark:bg-gray-800 dark:text-gray-100 transition"
                />
              </div>
              <div className="relative w-full max-w-sm">
                <FiMail className="absolute left-3 top-3 text-gray-400 text-lg" />
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Enter friend's email"
                  className={`border ${
                    isValid
                      ? "border-green-400"
                      : "border-gray-300 dark:border-gray-700"
                  } rounded-lg pl-10 pr-4 py-2 w-full focus:ring-2 focus:ring-purple-500 outline-none dark:bg-gray-800 dark:text-gray-100 transition`}
                />
              </div>

              {!isValid && email.length > 0 && (
                <p className="text-red-500 text-sm mt-2">
                  Please enter a valid email address
                </p>
              )}
              {isValid && name.length > 0 && (
                <motion.button
                  onClick={handleRefer}
                  whileHover={{ scale: 1.05 }}
                  className="mt-4 bg-purple-600 text-white px-8 py-2 rounded-xl font-medium shadow-md hover:shadow-lg transition"
                >
                  Refer Now
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/*  Referral List Table */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
            Your Referrals
          </h2>
          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <table className="w-full border-collapse text-sm text-left dark:text-gray-100">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Join Time</th>
                  <th className="px-4 py-3">Day Left / Over</th>
                </tr>
              </thead>
              <tbody>
                {referrals.map((r, i) => (
                  <motion.tr
                    key={i}
                    whileHover={{ scale: 1.01 }}
                    className="transition bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="px-4 py-3 font-medium">{r.referredName}</td>
                    <td className="px-4 py-3">{r.referredEmail}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          r.status
                        )}`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {r.jointime
                        ? new Date(r.jointime).toLocaleString()
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      {r.dateLeft > 0
                        ? `${r.dateLeft} days left`
                        : r.dateOver > 0
                        ? `${r.dateOver} days over`
                        : "—"}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
