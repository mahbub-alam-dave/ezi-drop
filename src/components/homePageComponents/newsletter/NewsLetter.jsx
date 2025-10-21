// Implement By Abu Bokor
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import Lottie from "lottie-react";
import animationData from "../../../app/assests/ani_2.json"; // Here Add Your Prefferable file Like ani_1,2,3.

const NewsLetter = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Swal.fire({
        icon: "error",
        title: "Invalid Email",
        text: "Please enter a valid email address.",
        timer: 2500,
        showConfirmButton: false,
      });
      return;
    }

    Swal.fire({
      icon: "success",
      title: "Subscribed!",
      text: "Thanks for joining our newsletter.",
      timer: 2500,
      showConfirmButton: false,
    }).then(() => {
      setName("");
      setEmail("");
    });
  };

  return (
 
    <section
  id="newsletter"
  className="w-full flex justify-center mb-16 px-4 sm:px-6 lg:px-8 py-6 lg:py-12 relative overflow-hidden"
>
  {/* Gradient Background */}
  <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 via-blue-50 to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 -z-10"></div>

  <div className="w-full max-w-[1440px] grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
    {/* ===== Left Side Animation ===== */}
    <motion.div
      initial={{ opacity: 0, x: -60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex justify-center"
    >
      <Lottie
        animationData={animationData}
        loop
        className="w-full max-w-md max-h-[420px] dark:invert"
      />
    </motion.div>

    {/* ===== Right Side Form ===== */}
    <motion.div
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
      className="rounded-2xl bg-white/80 dark:bg-[#10182e]/80 backdrop-blur-md p-6 sm:p-10 lg:p-14 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all"
    >
      <h2 className="font-serif font-bold mb-8 text-2xl sm:text-3xl md:text-4xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent">
        Subscribe to Our Newsletter
      </h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-4"
      >
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1 min-w-[220px] rounded-lg border border-gray-300 dark:border-gray-600
                     bg-white/80 dark:bg-[#10182e]/80 placeholder:text-gray-500 dark:placeholder:text-gray-400
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 px-4 py-3 text-base transition-all"
        />

        <motion.button
          whileHover={{
            scale: 1.05,
            boxShadow: "0 6px 16px rgba(0,0,0,0.25)",
          }}
          whileTap={{ scale: 0.96 }}
          type="submit"
          className="w-full sm:w-auto rounded-lg bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500
                     hover:from-indigo-700 hover:via-purple-700 hover:to-cyan-600 text-white font-semibold px-6 py-3 text-base
                     transition-all"
        >
          Subscribe
        </motion.button>
      </form>
    </motion.div>
  </div>
</section>

  );
};

export default NewsLetter;
