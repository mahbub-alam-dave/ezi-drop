"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { IoMdCheckmark } from "react-icons/io";
import { motion } from "framer-motion";

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
      <p className="text-[var(--color-subtext)] dark:text-[var(--color-subtext-dark)]">{label}</p>
    </div>
  );
}

export default function Overview() {
  return (
    <section className="py-16 px-6 md:px-8">
      <div className="max-w-[1440px] mx-auto grid md:grid-cols-2 gap-12 items-center">
        
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
            className="rounded-xl shadow-lg w-full"
          />
        </motion.div>

        {/* Right Side Content */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-[var(--color-text)] dark:text-[var(--color-text-dark)]">
            Smart Courier & Delivery Platform
          </h2>
          <p className="text-lg mb-6 text-[var(--color-subtext)] dark:text-[var(--color-subtext-dark)] leading-relaxed">
            Our platform ensures faster, safer, and hassle-free parcel delivery. 
            With just a few clicks, you can easily send and track your parcels anytime, anywhere.
          </p>

          <ul className="space-y-3 text-[var(--color-subtext)] dark:text-[var(--color-subtext-dark)]">
            <li className="flex items-center gap-2">
              <span className="text-[var(--color-primary)]"><IoMdCheckmark /></span> Easy parcel sending & tracking
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[var(--color-primary)]"><IoMdCheckmark /></span> Fast & secure delivery
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[var(--color-primary)]"><IoMdCheckmark /></span> 24/7 customer support
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[var(--color-primary)]"><IoMdCheckmark /></span> Coverage area: Dhaka, Chattogram, Sylhet (initially)
            </li>
          </ul>

          {/* Stats / Counters */}
          <div className="grid grid-cols-3 gap-6 mt-10">
            <Counter target={5000} label="Parcels Delivered" />
            <Counter target={200} label="Partners" />
            <Counter target={24} label="7 Support (Hours)" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
