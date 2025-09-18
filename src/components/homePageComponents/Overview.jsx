"use client";
import React from "react";
import Image from "next/image";
import { IoMdCheckmark } from "react-icons/io";

export default function Overview() {
  return (
    // bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)]
    <section className="py-16 px-6 md:px-8">
      <div className="max-w-[1440px] mx-auto grid md:grid-cols-2 gap-12 items-center">
        
        {/* Left Side Image */}
        <div className="">
          <Image
            src="/delivery.jpg"
            alt="Smart Courier Delivery"
            width={500}
            height={400}
            className="rounded-xl shadow-lg w-full"
          />
        </div>

        {/* Right Side Content */}
        <div>
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
        </div>
      </div>
    </section>
  );
}
