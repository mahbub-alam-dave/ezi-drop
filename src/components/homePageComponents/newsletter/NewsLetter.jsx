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
      className="w-full flex justify-center mb-16 px-4 sm:px-6 lg:px-8 py-6 lg:py-12 
       bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)]
       text-[var(--color-text)] dark:text-[var(--color-text-dark)]
       transition-colors duration-500"
    >
      <div className="w-full max-w-[1440px] grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
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
          // initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          className="rounded-2xl 
           dark:border-[var(--border-color-two)]
           bg-white/80 dark:bg-[#10182e]/80
           backdrop-blur-md  p-6 sm:p-10 lg:p-14"
        >
          <h2
            className=" font-serif font-bold mb-8
             text-2xl sm:text-3xl md:text-4xl"
          >
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
              className="flex-1 min-w-[220px] rounded-lg border
               border-[var(--border-color)]
               dark:border-[var(--border-color-two)]
               bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)]
               placeholder:text-[var(--color-text-soft)]
               dark:placeholder:text-[var(--color-text-soft-dark)]
               focus:outline-none focus:ring-1 focus:ring-[var(--border-color-two)]
               dark:focus:ring-[var(--color-primary-dark)]
               px-4 py-3 text-base"
            />

            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
              }}
              whileTap={{ scale: 0.96 }}
              type="submit"
              className="w-full sm:w-auto rounded-lg bg-[var(--color-primary)]
               hover:bg-[var(--color-primary-dark)]
               text-white font-semibold px-6 py-3 text-base
               transition-colors duration-300"
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
