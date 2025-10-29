"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { IoMdCheckmark } from "react-icons/io";
import { motion } from "framer-motion";
import Link from "next/link";

function Counter({ target, label }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(target);
    if (start === end) return;

    let totalMilSecDur = 2000; // 2 seconds
    let incrementTime = Math.floor(totalMilSecDur / end);

    let timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [target]);

  return (
    <div className="text-center">
      <h3 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)]">
        {count}+
      </h3>
      <p className="text-[var(--color-subtext)] dark:text-[var(--color-subtext-dark)]">
        {label}
      </p>
    </div>
  );
}

export default function Overview() {
  return (
  
    <section
  className="py-16 px-6 md:px-8 w-full relative overflow-hidden"
  style={{
    background:
      "linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(14,165,233,0.08) 100%)",
  }}
>
  <div className="w-full max-w-[1440px] mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
    {/* Left Side Image with Animation */}
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
    >
      <Image
        src="/delivery.jpg"
        alt="Smart Courier Delivery"
        width={500}
        height={400}
        className="rounded-xl shadow-xl w-full border border-indigo-100"
      />
    </motion.div>

    {/* Right Side Content */}
    <motion.div whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-slate-900 dark:text-slate-100">
        Smart Courier & Delivery Platform
      </h2>
      <p className="text-lg mb-6 text-slate-600 dark:text-slate-300 leading-relaxed">
        Our platform ensures faster, safer, and hassle-free parcel delivery.
        With just a few clicks, you can easily send and track your parcels
        anytime, anywhere.
      </p>

      <ul className="space-y-3 text-slate-600 dark:text-slate-300">
        <li className="flex items-center gap-2">
          <span className="text-indigo-500">
            <IoMdCheckmark />
          </span>{" "}
          Easy parcel sending & tracking
        </li>
        <li className="flex items-center gap-2">
          <span className="text-indigo-500">
            <IoMdCheckmark />
          </span>{" "}
          Fast & secure delivery
        </li>
        <li className="flex items-center gap-2">
          <span className="text-indigo-500">
            <IoMdCheckmark />
          </span>{" "}
          24/7 customer support
        </li>
        <li className="flex items-center gap-2">
          <span className="text-indigo-500">
            <IoMdCheckmark />
          </span>{" "}
          Coverage area: Dhaka, Chattogram, Sylhet (initially)
        </li>
      </ul>

      {/* Learn More Button */}
      <Link href={"/about"} className="flex justify-end">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 rounded-lg mt-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 text-white font-semibold shadow-lg hover:from-indigo-600 hover:via-purple-600 hover:to-cyan-500 transition-all duration-300"
        >
          Learn More
        </motion.button>
      </Link>

      {/* Stats / Counters */}
      <div className="grid grid-cols-3 gap-6 mt-10 text-center">
        <Counter target={5000} label="Parcels Delivered" />
        <Counter target={200} label="Partners" />
        <Counter target={24} label="7 Support (Hours)" />
      </div>
    </motion.div>
  </div>

  {/* Optional soft glow background shape */}
  <div
    className="absolute inset-0 opacity-30 blur-3xl -z-10"
    style={{
      background:
        "radial-gradient(circle at 20% 30%, rgba(99,102,241,0.25), transparent 60%), radial-gradient(circle at 80% 70%, rgba(14,165,233,0.25), transparent 60%)",
    }}
  ></div>
</section>

  );
}
