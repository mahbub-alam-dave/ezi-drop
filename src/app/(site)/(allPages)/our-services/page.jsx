"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";

const OurServices = () => {
  return (
    <main className="bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] min-h-screen py-20 px-6 md:px-10">
      <div className="max-w-[1440px] mx-auto space-y-28">
        {/* Heading Section */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-6"
        >
          <p className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] bg-clip-text text-transparent">
            Our Services
          </p>
        </motion.div>
      </div>
    </main>
  );
};

export default OurServices;
