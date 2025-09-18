import React from "react";
import { FaFacebookF, FaTwitter,FaWhatsapp} from "react-icons/fa";
import { MdEmail, MdLocalPhone } from "react-icons/md";
import { FaYoutube } from "react-icons/fa6";
import logo from "../../../app/assests/brandlogo.png"
import Image from "next/image";
export default function Footer() {
    return (
        <footer className="bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] px-6 md:px-8">
            <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between gap-10 py-8 shadow-t-md">

                {/* Logo + About */}
                <div className="md:max-w-96">
                    <div className="flex items-center">
                        {/* Logo */}
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
                        Modern, reliable, and efficient delivery services.
                        Ezi Drop ensures your parcels arrive safely and on time, making delivery simpler than ever.
                    </p>
                </div>
                {/* Company Links + Contact + Need Help */}
                <div className="flex-1 flex flex-col md:flex-row justify-between gap-20">
                    {/* Company Links */}
                    <div>
                        <h2 className="font-semibold mb-5 text-[var(--color-text)] dark:text-[var(--color-text-dark)]">Company</h2>
                        <ul className="text-sm space-y-2">
                            <li><a href="#" className="hover:text-[var(--color-primary)]">Home</a></li>
                            <li><a href="#" className="hover:text-[var(--color-primary)]">About us</a></li>
                            <li><a href="/contact" className="hover:text-[var(--color-primary)]">Contact us</a></li>
                            <li><a href="#" className="hover:text-[var(--color-primary)]">Privacy policy</a></li>
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

                            {/* Socials */}
                            <div className="flex gap-4 pt-2">
                                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                                    className="p-2 bg-[#3b5998] text-white rounded-full hover:bg-[#2d4373]">
                                    <FaFacebookF  />
                                </a>
                                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                                    className="p-2 bg-[#1da1f2] text-white rounded-full hover:bg-[#0d95e8]">
                                    <FaTwitter />
                                </a>
                                
                                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                                    className="p-2 bg-[#b50000] text-white rounded-full hover:bg-[#005582]">
                                    <FaYoutube />
                                </a>
                                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                                    className="p-2 bg-[#13cc0d] text-white rounded-full hover:bg-[#005582]">
                                    <FaWhatsapp />
                                </a>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Bottom */}
            <p className="pt-4 border-t-1 border-gray-200 text-center text-xs md:text-sm pb-5 text-[var(--color-text-soft)] dark:text-[var(--color-text-soft-dark)]">
                Copyright 2025 © <span className="font-semibold">Ezi Drop</span>. All Rights Reserved.
            </p>
        </footer>
    );
}
