'use client';
import React, { useState, useEffect } from "react";
import { FaFacebookF, FaTwitter, FaWhatsapp } from "react-icons/fa";
import { MdEmail, MdLocalPhone, MdLocationOn } from "react-icons/md";
import { FaYoutube, FaCcVisa, FaCcMastercard, FaCcPaypal } from "react-icons/fa6";
import logo from "../../../app/assests/brandlogo.png";
import Image from "next/image";

export default function Footer() {
  const [showTop, setShowTop] = useState(false);

  // Show back-to-top button on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowTop(true);
      } else {
        setShowTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] px-6 md:px-8 py-16 relative">
      <div className="w-full max-w-[1440px] mx-auto flex flex-col lg:flex-row justify-between gap-10 shadow-t-md pb-8">
        
        {/* Logo + About */}
        <div className="md:max-w-96">
          <div className="flex items-center">
            <Image
              src={logo}
              alt="Ezi Drop Logo"
              width={80}
              height={30}
              className="object-contain -mb-3"
            />
            <div className="text-2xl font-bold flex items-center -ml-3">
              Ezi Drop
            </div>
          </div>
          <p className="mt-4 text-sm font-medium leading-relaxed text-[var(--color-text-soft)] dark:text-[var(--color-text-soft-dark)]">
            Modern, reliable, and efficient delivery services. <br />
            Ezi Drop ensures your parcels arrive safely and on time, making delivery simpler than ever. 
            <br /><br />
            Our mission is to provide <strong>fast, affordable, and secure delivery</strong> across Bangladesh with 
            real-time tracking, multiple payment options, and trusted riders.
          </p>
        </div>

        {/* Footer Navigation */}
        <div className="flex-1 flex flex-col lg:flex-row justify-between gap-20">
          
          {/* Company Links */}
          <div>
            <h2 className="font-semibold mb-5 text-[var(--color-text)] dark:text-[var(--color-text-dark)]">Company</h2>
            <ul className="text-sm space-y-2">
              <li><a href="#" className="hover:text-[var(--color-primary)]">Home</a></li>
              <li><a href="#" className="hover:text-[var(--color-primary)]">About us</a></li>
              <li><a href="/contact" className="hover:text-[var(--color-primary)]">Contact us</a></li>
              <li><a href="#" className="hover:text-[var(--color-primary)]">Privacy policy</a></li>
              <li><a href="#" className="hover:text-[var(--color-primary)]">Terms & Conditions</a></li>
            </ul>
          </div>

          {/* Services / Project Info */}
          <div>
            <h2 className="font-semibold mb-5 text-[var(--color-text)] dark:text-[var(--color-text-dark)]">Our Services</h2>
            <ul className="text-sm space-y-2">
              <li>📦 Same-day Delivery</li>
              <li>🚚 Nationwide Shipping</li>
              <li>🛵 Rider Assignment System</li>
              <li>💳 Online Payment & Cash on Delivery</li>
              <li>📍 Real-time Parcel Tracking</li>
            </ul>
          </div>

          {/* Need Help Links */}
          <div>
            <h2 className="font-semibold mb-5 text-[var(--color-text)] dark:text-[var(--color-text-dark)]">Need Help?</h2>
            <ul className="text-sm space-y-2">
              <li><a href="#" className="hover:text-[var(--color-primary)]">Delivery Information</a></li>
              <li><a href="#" className="hover:text-[var(--color-primary)]">Return & Refund Policy</a></li>
              <li><a href="#" className="hover:text-[var(--color-primary)]">Payment Methods</a></li>
              <li><a href="#" className="hover:text-[var(--color-primary)]">Track your Order</a></li>
              <li><a href="/contact" className="hover:text-[var(--color-primary)]">Contact Us</a></li>
            </ul>
          </div>

          {/* Contact + Socials */}
          <div>
            <h2 className="font-semibold mb-5 text-[var(--color-text)] dark:text-[var(--color-text-dark)]">Get in touch</h2>
            <div className="text-sm space-y-3">
              <p className="flex items-center gap-2 text-[var(--color-text-soft)] dark:text-[var(--color-text-soft-dark)]">
                <MdLocalPhone className="text-[var(--color-primary)]" /> +1-212-456-7890
              </p>
              <p className="flex items-center gap-2 text-[var(--color-text-soft)] dark:text-[var(--color-text-soft-dark)]">
                <MdEmail className="text-[var(--color-primary)]" /> contact@ezidrop.com
              </p>
              <p className="flex items-center gap-2 text-[var(--color-text-soft)] dark:text-[var(--color-text-soft-dark)]">
                <MdLocationOn className="text-[var(--color-primary)]" /> Dhaka, Bangladesh
              </p>

              {/* Socials */}
              <div className="flex gap-4 pt-2">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                  className="p-2 bg-[#3b5998] text-white rounded-full hover:bg-[#2d4373]">
                  <FaFacebookF />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                  className="p-2 bg-[#1da1f2] text-white rounded-full hover:bg-[#0d95e8]">
                  <FaTwitter />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"
                  className="p-2 bg-[#b50000] text-white rounded-full hover:bg-[#8a0000]">
                  <FaYoutube />
                </a>
                <a href="https://wa.me" target="_blank" rel="noopener noreferrer"
                  className="p-2 bg-[#13cc0d] text-white rounded-full hover:bg-[#0fa30a]">
                  <FaWhatsapp />
                </a>
              </div>
            </div>
          </div>

          {/* Payment + Newsletter */}
          <div>
            <h2 className="font-semibold mb-5 text-[var(--color-text)] dark:text-[var(--color-text-dark)]">Payment Method</h2>
            <div className="flex gap-4 mb-6">
              <FaCcVisa className="text-4xl text-blue-600" />
              <FaCcMastercard className="text-4xl text-red-600" />
              <FaCcPaypal className="text-4xl text-blue-400" />
            </div>

            {/* Newsletter */}
            <h2 className="font-semibold mb-3 text-[var(--color-text)] dark:text-[var(--color-text-dark)]">Subscribe</h2>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-3 py-2 rounded-lg border focus:outline-none text-sm w-full"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90"
              >
                Join
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <p className="pt-8 border-t border-gray-200 text-center text-xs md:text-sm text-[var(--color-text-soft)] dark:text-[var(--color-text-soft-dark)]">
        Copyright 2025 © <span className="font-semibold">Ezi Drop</span>. All Rights Reserved.
      </p>

      {/* Back-to-top button */}
{/*       {showTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 rounded-full px-6 py-4 bg-[var(--color-primary)] text-white font-bold text-2xl shadow-lg hover:opacity-90 transition"
        >
          ↑
        </button>
      )} */}
    </footer>
  );
}
