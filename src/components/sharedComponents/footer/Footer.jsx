"use client";
import React, { useState, useEffect } from "react";
import { FaFacebookF, FaWhatsapp, FaSearch } from "react-icons/fa";
import { MdEmail, MdLocalPhone, MdLocationOn } from "react-icons/md";
import {
  FaYoutube,
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
} from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";
import logo from "../../../app/assests/brandlogo.png";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ChatBox from "@/components/customerServicesComponents/ChatBoxUi";

export default function Footer() {
  const [showTop, setShowTop] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();

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

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  // Navigation links data
  const companyLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About us" },
    { href: "/privacy", label: "Privacy policy" },
    { href: "/terms", label: "Terms & Conditions" },
  ];

  const needHelpLinks = [
    { href: "/dashboard/user/my-bookings", label: "Delivery Information" },
    { href: "/refund-page", label: "Return & Refund Policy" },
    { href: "/dashboard/user/my-bookings", label: "Track your Order" },
    { href: "/contact", label: "Contact Us" },
  ];

  const isActiveLink = (href) => {
    return pathname === href;
  };

  return (
    <footer className="bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] px-6 md:px-8 py-16 relative">
      <div className="w-full max-w-[1440px] mx-auto">
        {/* Main Footer Content */}
        <div className="flex flex-col lg:flex-row justify-between gap-10 shadow-t-md pb-8">
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
              Ezi Drop ensures your parcels arrive safely and on time, making
              delivery simpler than ever.
              <br />
              <br />
              Our mission is to provide{" "}
              <strong>fast, affordable, and secure delivery</strong> across
              Bangladesh with real-time tracking, multiple payment options, and
              trusted riders.
            </p>
          </div>

          {/* Footer Navigation */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Links */}
            <div>
              <h2 className="font-semibold mb-5 text-[var(--color-text)] dark:text-[var(--color-text-dark)]">
                Company
              </h2>
              <ul className="text-sm space-y-3">
                {companyLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`hover:text-[var(--color-primary)] transition-colors duration-200 flex items-center group ${
                        isActiveLink(link.href)
                          ? "text-[var(--color-primary)] font-medium"
                          : "text-[var(--color-text-soft)] dark:text-[var(--color-text-soft-dark)]"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 bg-[var(--color-primary)] rounded-full mr-3 transition-all duration-200 ${
                          isActiveLink(link.href)
                            ? "opacity-100"
                            : "opacity-0 group-hover:opacity-100"
                        }`}
                      ></span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services / Project Info */}
            <div>
              <h2 className="font-semibold mb-5 text-[var(--color-text)] dark:text-[var(--color-text-dark)]">
                Our Services
              </h2>
              <ul className="text-sm space-y-3">
                <li className="flex items-center gap-3 text-[var(--color-text-soft)] dark:text-[var(--color-text-soft-dark)] group hover:text-[var(--color-primary)] transition-colors">
                  <span className="text-[var(--color-primary)] group-hover:scale-110 transition-transform">
                    📦
                  </span>
                  Same-day Delivery
                </li>
                <li className="flex items-center gap-3 text-[var(--color-text-soft)] dark:text-[var(--color-text-soft-dark)] group hover:text-[var(--color-primary)] transition-colors">
                  <span className="text-[var(--color-primary)] group-hover:scale-110 transition-transform">
                    🚚
                  </span>
                  Nationwide Shipping
                </li>
                <li className="flex items-center gap-3 text-[var(--color-text-soft)] dark:text-[var(--color-text-soft-dark)] group hover:text-[var(--color-primary)] transition-colors">
                  <span className="text-[var(--color-primary)] group-hover:scale-110 transition-transform">
                    🛵
                  </span>
                  Rider Assignment System
                </li>
                <li className="flex items-center gap-3 text-[var(--color-text-soft)] dark:text-[var(--color-text-soft-dark)] group hover:text-[var(--color-primary)] transition-colors">
                  <span className="text-[var(--color-primary)] group-hover:scale-110 transition-transform">
                    💳
                  </span>
                  Online Payment & COD
                </li>
                <li className="flex items-center gap-3 text-[var(--color-text-soft)] dark:text-[var(--color-text-soft-dark)] group hover:text-[var(--color-primary)] transition-colors">
                  <span className="text-[var(--color-primary)] group-hover:scale-110 transition-transform">
                    📍
                  </span>
                  Real-time Parcel Tracking
                </li>
              </ul>
            </div>

            {/* Need Help Links */}
            <div>
              <h2 className="font-semibold mb-5 text-[var(--color-text)] dark:text-[var(--color-text-dark)]">
                Need Help?
              </h2>
              <ul className="text-sm space-y-3">
                {needHelpLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`hover:text-[var(--color-primary)] transition-colors duration-200 flex items-center group ${
                        isActiveLink(link.href)
                          ? "text-[var(--color-primary)] font-medium"
                          : "text-[var(--color-text-soft)] dark:text-[var(--color-text-soft-dark)]"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 bg-[var(--color-primary)] rounded-full mr-3 transition-all duration-200 ${
                          isActiveLink(link.href)
                            ? "opacity-100"
                            : "opacity-0 group-hover:opacity-100"
                        }`}
                      ></span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact + Socials */}
            <div>
              <h2 className="font-semibold mb-5 text-[var(--color-text)] dark:text-[var(--color-text-dark)]">
                Get in touch
              </h2>
              <div className="text-sm space-y-3">
                <p className="flex items-center gap-2 text-[var(--color-text-soft)] dark:text-[var(--color-text-soft-dark)]">
                  <MdLocalPhone className="text-[var(--color-primary)]" />{" "}
                  +1-212-456-7890
                </p>
                <p className="flex items-center gap-2 text-[var(--color-text-soft)] dark:text-[var(--color-text-soft-dark)]">
                  <MdEmail className="text-[var(--color-primary)]" />{" "}
                  contact@ezidrop.com
                </p>
                <p className="flex items-center gap-2 text-[var(--color-text-soft)] dark:text-[var(--color-text-soft-dark)]">
                  <MdLocationOn className="text-[var(--color-primary)]" />{" "}
                  Dhaka, Bangladesh
                </p>

                {/* Socials */}
                <div className="flex gap-3 pt-2">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-[#3b5998] text-white rounded-full hover:bg-[#2d4373] transition-colors hover:scale-110 transform duration-200"
                  >
                    <FaFacebookF size={14} />
                  </a>
                  <a
                    href="https://x.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors hover:scale-110 transform duration-200"
                  >
                    <FaXTwitter size={14} />
                  </a>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-[#b50000] text-white rounded-full hover:bg-[#8a0000] transition-colors hover:scale-110 transform duration-200"
                  >
                    <FaYoutube size={14} />
                  </a>
                  <a
                    href="https://wa.me"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-[#13cc0d] text-white rounded-full hover:bg-[#0fa30a] transition-colors hover:scale-110 transform duration-200"
                  >
                    <FaWhatsapp size={14} />
                  </a>
                </div>

                {/* Payment Methods */}
                <div className="pt-4">
                  <h3 className="font-semibold mb-2 text-[var(--color-text)] dark:text-[var(--color-text-dark)] text-sm">
                    We Accept
                  </h3>
                  <div className="flex gap-3">
                    <FaCcVisa className="text-2xl text-blue-600 hover:scale-110 transition-transform duration-200" />
                    <FaCcMastercard className="text-2xl text-red-600 hover:scale-110 transition-transform duration-200" />
                    <FaCcPaypal className="text-2xl text-blue-400 hover:scale-110 transition-transform duration-200" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <p className="pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-xs md:text-sm text-[var(--color-text-soft)] dark:text-[var(--color-text-soft-dark)]">
          Copyright 2025 © <span className="font-semibold">Ezi Drop</span>. All
          Rights Reserved.
        </p>
      </div>

      {/* Back-to-top button */}
      {showTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 rounded-full w-12 h-12 bg-[var(--color-primary)] text-white font-bold shadow-lg hover:opacity-90 transition-opacity flex items-center justify-center hover:scale-105 transform duration-200 z-50"
          aria-label="Back to top"
        >
          ↑
        </button>
      )}
      <ChatBox />
    </footer>
  );
}
