import React from "react";
import { FaFacebookF, FaTwitter,  FaWhatsapp,FaXTwitter } from "react-icons/fa";

import { MdEmail, MdLocalPhone } from "react-icons/md";
import { FaTruckFast } from "react-icons/fa6";

export default function Footer() {
  return (
    <div>
      <footer className="px-6 md:px-16 lg:px-24 xl:px-32 pt-8 w-full text-gray-500 bg-base-100 shadow-inner">
        <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-500/30 pb-6">
          {/* Logo + About */}
          <div className="md:max-w-96">
            <div className="flex items-center gap-2">
              <FaTruckFast className="text-3xl text-indigo-600" />
              <h1 className="text-xl font-bold text-gray-800">Ezi Drop</h1>
            </div>
            <p className="mt-4 text-sm leading-relaxed">
              Modern, reliable, and efficient delivery services.  
              Ezi Drop ensures your parcels arrive safely and on time,  
              making delivery simpler than ever.
            </p>
          </div>

          {/* Company Links */}
          <div className="flex-1 flex items-start md:justify-end gap-20">
            <div>
              <h2 className="font-semibold mb-5 text-gray-800">Company</h2>
              <ul className="text-sm space-y-2">
                <li><a href="#" className="hover:text-blue-600">Home</a></li>
                <li><a href="#" className="hover:text-blue-600">About us</a></li>
                <li><a href="#" className="hover:text-blue-600">Contact us</a></li>
                <li><a href="#" className="hover:text-blue-600">Privacy policy</a></li>
              </ul>
            </div>
            {/* Support */}
            <div>
                    <p className='font-semibold mb-5 text-gray-800'>Support</p>
                    <ul className='mt-3 flex flex-col gap-2 text-sm'>
                        <li><a href="#">Help Center</a></li>
                        <li><a href="#">Safety Information</a></li>
                        <li><a href="#">Cancellation Options</a></li>
                        <li><a href="#">Contact Us</a></li>
                        <li><a href="#">Accessibility</a></li>
                    </ul>
                </div>

            {/* Contact */}
            <div>
              <h2 className="font-semibold mb-5 text-gray-800">Get in touch</h2>
              <div className="text-sm space-y-3">
                <p className="flex items-center gap-2">
                  <MdLocalPhone className="text-blue-600" /> +1-212-456-7890
                </p>
                <p className="flex items-center gap-2">
                  <MdEmail className="text-blue-600" /> contact@ezidrop.com
                </p>
                {/* Socials */}
                <div className="flex gap-4 pt-2">
                  <a href="#"  className="p-2 bg-blue-600 text-white rounded-full ">
                    <FaFacebookF />
                  </a>
                  <a href="#" className="p-2 bg-blue-300 text-white rounded-full ">
                    <FaTwitter />
                  </a>
                  <a href="#" className="p-2 bg-green-600 text-white rounded-full cursor-pointer ">
                    < FaWhatsapp />
                  </a>
                  
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <p className="pt-4 text-center text-xs md:text-sm pb-5">
          Copyright 2025 © <span className="font-semibold">Ezi Drop</span>. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}
