"use client";
import React from "react";
import Image from "next/image";
import { IoMdCheckmark } from "react-icons/io";

export default function Overview() {
  return (
    <section className="bg-background-light dark:bg-background-dark py-16 px-6 md:px-12">
      <div className="max-w-[1200px] mx-auto grid md:grid-cols-2 gap-12 items-center">
        
        {/* Left Side Image */}
        <div className="flex justify-center">
          <Image
            src="/delivery.jpg" 
            alt="Smart Courier Delivery"
            width={500}
            height={400}
            className="rounded-xl shadow-lg"
          />
        </div>

        {/* Right Side Content */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            Smart Courier & Delivery Platform
          </h2>
          <p className="text-lg mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
            Our platform ensures faster, safer, and hassle-free parcel delivery. 
            With just a few clicks, you can easily send and track your parcels anytime, anywhere.
          </p>

          <ul className="space-y-3 text-gray-600 dark:text-gray-400">
            <li className="flex items-center gap-2">
              <span className="text-green-500"><IoMdCheckmark /></span> Easy parcel sending & tracking
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500"><IoMdCheckmark /></span> Fast & secure delivery
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500"><IoMdCheckmark /></span> 24/7 customer support
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500"><IoMdCheckmark /></span> Coverage area: Dhaka, Chattogram, Sylhet (initially)
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
