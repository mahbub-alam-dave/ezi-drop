"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";

// --- Framer Motion Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

// --- Service Card Component ---
const ServiceCard = ({ icon, title, description }) => (
  <motion.div
    variants={itemVariants}
    // Card uses var(--color-bg) (pure white)
    className="flex flex-col items-center text-center p-6 sm:p-8 bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-[var(--color-border)] dark:border-[var(--color-border)] h-full"
    whileHover={{ scale: 1.05, rotate: 1 }}
    transition={{ type: "spring", stiffness: 300, damping: 10 }}
  >
    <div className="text-6xl mb-6 bg-[var(--color-primary)]/10 dark:bg-[var(--color-primary-dark)]/10 p-4 rounded-full">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-[var(--color-text)] dark:text-[var(--color-text-dark)] mb-3">
      {title}
    </h3>
    <p className="text-[var(--color-text-soft)] dark:text-[var(--color-text-soft-dark)] leading-relaxed">
      {description}
    </p>
  </motion.div>
);

// --- Feature Section Component ---
const FeatureSection = ({ title, description, icon, alignRight = false }) => (
  <motion.div
    initial={{ opacity: 0, x: alignRight ? 100 : -100 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    className={`flex flex-col gap-8 md:gap-16 items-center ${
      alignRight ? "md:flex-row-reverse" : "md:flex-row"
    }`}
  >
    <div className="md:w-1/2 flex justify-center items-center">
      {/* Updated: Use theme primary color with low opacity for background */}
      <div className="text-8xl p-8 rounded-full bg-[var(--color-primary)]/10 dark:bg-[var(--color-primary-dark)]/20 transform transition-transform duration-500 hover:scale-110">
        {icon}
      </div>
    </div>
    <div className="md:w-1/2 text-center md:text-left space-y-4">
      <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--color-text)] dark:text-[var(--color-text-dark)]">
        {title}
      </h2>
      <p className="text-lg text-[var(--color-text-soft)] dark:text-[var(--color-text-soft-dark)]">
        {description}
      </p>
    </div>
  </motion.div>
);

const OurServices = () => {
  return (
    // FIX: Using only theme variables for background. This ensures compliance with the custom theme.
    <main className="bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] min-h-screen py-20 px-6 md:px-10">
      <div className="max-w-[1440px] mx-auto space-y-28">
        {/* Heading Section */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-6"
        >
          {/* Main Heading: Uses Primary Color Gradient (Visible) */}
          <p className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] bg-clip-text text-transparent">
            Our Core Delivery Services
          </p>
          {/* Sub-Heading FIX: Ensure text is dark/soft text color for contrast */}
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-[var(--color-text-soft)] dark:text-[var(--color-text-soft-dark)]">
            We’re here to help you 24/7, offering reliable, fast, and secure
            logistics solutions tailored to meet your business and personal
            needs.
          </p>
        </motion.div>

        {/* --- 1. Core Services Grid (4 Cards) --- */}
        <div className="space-y-6">
          {/* Updated: Use theme text color */}
          <h2 className="text-center text-3xl font-bold text-[var(--color-text)] dark:text-[var(--color-text-dark)] mb-12">
            The EziDrop Advantage
          </h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {/* 1. Parcel Booking */}
            <ServiceCard
              icon="📝"
              title="Parcel Booking"
              description="Simple online parcel booking system to quickly initiate and schedule your deliveries with ease."
            />
            {/* 2. Automatic Cost Calculation */}
            <ServiceCard
              icon="🧮"
              title="Automatic Cost Calculation"
              description="Get instant and accurate delivery cost calculation based on weight, distance, and parcel type."
            />
            {/* 3. Digital Proofing */}
            <ServiceCard
              icon="📸"
              title="Digital Proofing (POD)"
              description="Ensure transparency with digital Proof of Delivery (POD) via photo and signature upon successful completion."
            />
            {/* 4. Role Based Dashboard Access */}
            <ServiceCard
              icon="👥"
              title="Role Based Dashboard Access"
              description="Secure and customized dashboard access based on user roles, ensuring data privacy and operational control."
            />
          </motion.div>
        </div>

        {/* --- 2. Feature Details Section (3 Big Features) --- */}
        <div className="space-y-20">
          {/* 1. AI Chatbot & Live Messaging & Customer Support */}
          <FeatureSection
            title="AI Chatbot, Live Messaging & Support"
            description="Our AI Chatbot provides immediate 24/7 support. Connect instantly with riders and dedicated customer support via live messaging."
            icon="💬"
            alignRight={false}
          />

          {/* 2. Multiple Payment & Smart Costing */}
          <FeatureSection
            title="Multiple Payment & Smart Costing"
            description="Secure multiple payment options are available. Benefit from automatic cost calculation that provides accurate, real-time pricing."
            icon="💳"
            alignRight={true} // Changed alignment for visual flow
          />

          {/* 3. Automatic Rider Assignment & AI Route Suggestion */}
          <FeatureSection
            title="Auto Rider Assignment & AI Routing"
            description="Automatic rider assignment ensures quick pickup. AI route suggestion provides riders with the most efficient routes for faster delivery."
            icon="🤖"
            alignRight={false} // Changed alignment for visual flow
          />
        </div>

        {/* --- 3. Call to Action (CTA) --- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          // Background uses Primary Color (Visible)
          className="text-center background-color-primary p-10 md:p-16 rounded-3xl shadow-2xl space-y-6"
        >
          {/* FIX: Explicitly set text to white for maximum contrast on the blue background */}
          <h2 className="text-3xl md:text-5xl font-extrabold text-white">
            Ready to Experience EziDrop?
          </h2>
          {/* FIX: Explicitly set text to white for maximum contrast on the blue background */}
          <p className="text-lg max-w-3xl mx-auto text-white">
            Join thousands of businesses and individuals who trust EziDrop for
            their daily delivery needs. It's fast, simple, and reliable.
          </p>
          <div className="pt-4">
            <a
              href="#" // Replace with actual link to signup/booking
              // Button contrast is fine (white button on primary background)
              className="inline-block px-10 py-4 bg-white text-[var(--color-primary)] dark:text-[var(--color-primary-dark)] font-bold text-lg rounded-xl shadow-lg hover:bg-gray-100 transition-colors transform hover:scale-105"
            >
              Start Booking Now
            </a>
          </div>
        </motion.div>
      </div>
    </main>
  );
};

export default OurServices;
