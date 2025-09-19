"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaPhoneAlt, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { MdMarkEmailRead } from "react-icons/md";

export default function ContactPage() {
  const [enquiryType, setEnquiryType] = useState("");

  return (
    <main className="bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] min-h-screen py-20 px-6 md:px-10">
      <div className="max-w-[1440px] mx-auto space-y-28">

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-6"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] bg-clip-text text-transparent">
            Let’s Connect
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-[var(--color-subtext)] dark:text-[var(--color-subtext-dark)]">
            Have a question about delivery, partnership, or support? We’re here to help you 24/7.
          </p>
        </motion.div>

        {/* Contact Info + Form */}
        <div className="grid md:grid-cols-2 gap-16 items-start">
          
          {/* Left Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-[var(--color-card)] dark:bg-[var(--color-card-dark)] rounded-3xl shadow-xl p-10 space-y-6"
          >
            <h2 className="text-3xl font-bold text-[var(--color-text)] dark:text-[var(--color-text-dark)]">
              Contact Information
            </h2>
            <p className="text-[var(--color-subtext)] dark:text-[var(--color-subtext-dark)]">
              Reach out via email, phone, or visit one of our branches. Our friendly team is ready to assist you.
            </p>
            <div className="space-y-4">
              <p className="flex gap-3 items-center text-[var(--color-subtext)] dark:text-[var(--color-subtext-dark)]">
                <FaLocationDot className="text-[var(--color-primary)]" /> Dhaka, Bangladesh
              </p>
              <p className="flex gap-3 items-center text-[var(--color-subtext)] dark:text-[var(--color-subtext-dark)]">
                <FaPhoneAlt className="text-[var(--color-primary)]" /> +880 1234-567890
              </p>
              <p className="flex gap-3 items-center text-[var(--color-subtext)] dark:text-[var(--color-subtext-dark)]">
                <MdMarkEmailRead className="text-[var(--color-primary)]" /> support@ezidrop.com
              </p>
            </div>
          </motion.div>

          {/* Right Form */}
          <motion.form
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-br from-[var(--color-card)] to-[var(--color-bg)] dark:from-[var(--color-card-dark)] dark:to-[var(--color-bg-dark)] p-10 rounded-3xl shadow-2xl space-y-6"
          >
            <h2 className="text-2xl font-semibold text-[var(--color-text)] dark:text-[var(--color-text-dark)] mb-4">
              Send Us a Message
            </h2>
            
            {/* Enquiry Categories */}
            <div>
              <label className="block mb-2 text-[var(--color-text)] dark:text-[var(--color-text-dark)]">Enquiry Type</label>
              <select
                value={enquiryType}
                onChange={(e) => setEnquiryType(e.target.value)}
                className="w-full px-5 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] text-[var(--color-text)] dark:text-[var(--color-text-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              >
                <option value="">Select Enquiry</option>
                <option value="general">General Enquiry</option>
                <option value="partnership">Partnership</option>
                <option value="delivery">Delivery Issue</option>
                <option value="feedback">Feedback</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 text-[var(--color-text)] dark:text-[var(--color-text-dark)]">Name</label>
              <input type="text" required placeholder="Your Name" className="w-full px-5 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] text-[var(--color-text)] dark:text-[var(--color-text-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"/>
            </div>

            <div>
              <label className="block mb-2 text-[var(--color-text)] dark:text-[var(--color-text-dark)]">Email</label>
              <input type="email" required placeholder="Your Email" className="w-full px-5 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] text-[var(--color-text)] dark:text-[var(--color-text-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"/>
            </div>

            <div>
              <label className="block mb-2 text-[var(--color-text)] dark:text-[var(--color-text-dark)]">Message</label>
              <textarea rows="5" placeholder="Your Message" className="w-full px-5 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] text-[var(--color-text)] dark:text-[var(--color-text-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"/>
            </div>

            {/* File Upload */}
            <div>
              <label className="block mb-2 text-[var(--color-text)] dark:text-[var(--color-text-dark)]">Attach File (Optional)</label>
              <input type="file" className="w-full text-[var(--color-text)] dark:text-[var(--color-text-dark)]"/>
            </div>

            {/* Preferred Contact Time */}
            <div>
              <label className="block mb-2 text-[var(--color-text)] dark:text-[var(--color-text-dark)]">Preferred Contact Time</label>
              <input type="time" className="w-full px-5 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] text-[var(--color-text)] dark:text-[var(--color-text-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"/>
            </div>

            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" className="w-full py-3 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-semibold shadow-md transition">
              Send Message
            </motion.button>
          </motion.form>
        </div>

        {/* Multiple Branch Locations */}
        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="space-y-10">
          <h2 className="text-3xl font-bold text-[var(--color-text)] dark:text-[var(--color-text-dark)] text-center mb-6">Our Branches</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { city: "Dhaka", address: "Dhaka, Bangladesh", map: "https://www.google.com/maps/embed?pb=!1m18..." },
              { city: "Chittagong", address: "Chittagong, Bangladesh", map: "https://www.google.com/maps/embed?pb=!1m18..." },
              { city: "Sylhet", address: "Sylhet, Bangladesh", map: "https://www.google.com/maps/embed?pb=!1m18..." },
            ].map((branch, i) => (
              <div key={i} className="bg-[var(--color-card)] dark:bg-[var(--color-card-dark)] rounded-3xl shadow-lg p-6 text-center">
                <h3 className="text-xl font-semibold text-[var(--color-text)] dark:text-[var(--color-text-dark)]">{branch.city}</h3>
                <p className="text-[var(--color-subtext)] dark:text-[var(--color-subtext-dark)]">{branch.address}</p>
                <iframe src={branch.map} width="100%" height="200" className="mt-4 border-0 rounded-xl"></iframe>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Team / Department Details */}
        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="space-y-12">
          <h2 className="text-3xl font-bold text-center text-[var(--color-text)] dark:text-[var(--color-text-dark)]">Meet Our Departments</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { name: "Rahim", role: "Customer Support", email: "rahim@ezidrop.com"  , image : "/customer 2.jpg"},
              { name: "Karim", role: "Logistics Manager", email: "karim@ezidrop.com" , image : "/customer 3.jpg" },
              { name: "Ayesha", role: "Operations", email: "ayesha@ezidrop.com" , image : "/customer 1.jpg" },
            ].map((member, i) => (
              <div key={i} className="bg-[var(--color-card)] dark:bg-[var(--color-card-dark)] p-8 rounded-2xl shadow-lg text-center">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] mb-6">
                  <img src={member.image} alt={member.name} className="w-24 h-24 rounded-full object-cover mx-auto mb-6" />

                </div>
                <h3 className="text-xl font-semibold text-[var(--color-text)] dark:text-[var(--color-text-dark)]">{member.name}</h3>
                <p className="text-[var(--color-subtext)] dark:text-[var(--color-subtext-dark)]">{member.role}</p>
                <p className="text-[var(--color-subtext)] dark:text-[var(--color-subtext-dark)]">{member.email}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Company Policies */}
        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="bg-[var(--color-card)] dark:bg-[var(--color-card-dark)] rounded-3xl shadow-lg p-10 space-y-4">
          <h2 className="text-3xl font-bold text-[var(--color-text)] dark:text-[var(--color-text-dark)]">Our Policies</h2>
          <ul className="list-disc list-inside text-[var(--color-subtext)] dark:text-[var(--color-subtext-dark)]">
            <li>Delivery Policy: Fast & reliable delivery across major cities.</li>
            <li>Refund Policy: Easy returns within 7 days of delivery.</li>
            <li>Service Coverage: Dhaka, Chittagong, Sylhet & nearby areas.</li>
          </ul>
        </motion.div>

        {/* Live Chat Placeholder */}
        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="bg-[var(--color-card)] dark:bg-[var(--color-card-dark)] rounded-3xl shadow-lg p-10 text-center">
          <h2 className="text-3xl font-bold text-[var(--color-text)] dark:text-[var(--color-text-dark)]">Need Instant Help?</h2>
          <p className="text-[var(--color-subtext)] dark:text-[var(--color-subtext-dark)] mb-4">Chat with our support team (coming soon)</p>
          <button className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-semibold px-8 py-3 rounded-xl">Start Chat</button>
        </motion.div>

        {/* Fun / Engagement Section */}
        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="space-y-10">
          <h2 className="text-3xl font-bold text-center text-[var(--color-text)] dark:text-[var(--color-text-dark)]">Behind the Scenes</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {["behind-1.jpg","behind-2.jpg","behind-3.jpg"].map((img, i) => (
              <div key={i} className="h-48 bg-[var(--color-card)] dark:bg-[var(--color-card-dark)] rounded-2xl shadow-lg bg-cover bg-center" style={{ backgroundImage: `url('/${img}')` }}></div>
            ))}
          </div>
        </motion.div>

        {/* Social Media */}
        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center space-y-6">
          <h2 className="text-3xl font-bold text-[var(--color-text)] dark:text-[var(--color-text-dark)]">Connect With Us</h2>
          <div className="flex justify-center gap-8 text-3xl text-[var(--color-primary)] dark:text-[var(--color-primary-dark)]">
            <FaFacebook className="cursor-pointer hover:scale-110 transition" />
            <FaTwitter className="cursor-pointer hover:scale-110 transition" />
            <FaInstagram className="cursor-pointer hover:scale-110 transition" />
            <FaLinkedin className="cursor-pointer hover:scale-110 transition" />
          </div>
        </motion.div>

      </div>
    </main>
  );
}
