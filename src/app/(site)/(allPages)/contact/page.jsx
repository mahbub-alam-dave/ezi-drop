"use client";
import React from "react";
import { motion } from "framer-motion";
import {  FaPhoneAlt} from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { MdMarkEmailRead } from "react-icons/md";

export default function ContactPage() {
  return (
    <main className="bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] min-h-screen py-16 px-6 md:px-8">
      <div className="max-w-[1440px] mx-auto">
        
        {/* Title Section */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-text)] dark:text-[var(--color-text-dark)]">
            Get in Touch
          </h1>
          <p className="mt-4 text-lg text-[var(--color-subtext)] dark:text-[var(--color-subtext-dark)]">
            We love to hear from you! Fill out the form below or reach us directly.
          </p>
        </motion.div>

        {/* Contact Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* Left Info */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold text-[var(--color-text)] dark:text-[var(--color-text-dark)]">
              Contact Information
            </h2>
            <p className="text-[var(--color-subtext)] dark:text-[var(--color-subtext-dark)]">
              You can reach us anytime via email or phone. Our support team is always available to help you.
            </p>
            <div className="space-y-3">
              <p className="text-[var(--color-subtext)] gap-3 items-center flex dark:text-[var(--color-subtext-dark)]">
              <FaLocationDot /> Dhaka, Bangladesh
              </p>
              <p className="text-[var(--color-subtext)] gap-3 items-center flex dark:text-[var(--color-subtext-dark)]">
                <FaPhoneAlt /> +880 1234-567890
              </p>
              <p className="text-[var(--color-subtext)] gap-3 items-center flex  dark:text-[var(--color-subtext-dark)]">
                <MdMarkEmailRead /> support@ezidrop.com
              </p>
            </div>
          </motion.div>

          {/* Right Form */}
          <motion.form 
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-[var(--color-card)] dark:bg-[var(--color-card-dark)] p-8 rounded-2xl shadow-lg space-y-6"
          >
            <div>
              <label className="block mb-2 text-[var(--color-text)] dark:text-[var(--color-text-dark)]">Name</label>
              <input 
                type="text" 
                placeholder="Your Name"
                className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] text-[var(--color-text)] dark:text-[var(--color-text-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>
            <div>
              <label className="block mb-2 text-[var(--color-text)] dark:text-[var(--color-text-dark)]">Email</label>
              <input 
                type="email" 
                placeholder="Your Email"
                className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] text-[var(--color-text)] dark:text-[var(--color-text-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>
            <div>
              <label className="block mb-2 text-[var(--color-text)] dark:text-[var(--color-text-dark)]">Message</label>
              <textarea 
                rows="5"
                placeholder="Your Message"
                className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] text-[var(--color-text)] dark:text-[var(--color-text-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full py-3 rounded-lg bg-[var(--color-primary)] dark:bg-[var(--color-primary-dark)] text-white font-semibold"
            >
              Send Message
            </motion.button>
          </motion.form>
        </div>
      </div>
    </main>
  );
}
