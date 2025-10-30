'use client';
import React, { useState } from 'react';
import { FiArrowLeft, FiFileText, FiAlertTriangle, FiShield, FiCreditCard, FiTruck, FiUser, FiMail, FiPhone } from 'react-icons/fi';

export default function TermsAndConditions() {
  const [activeSection, setActiveSection] = useState('acceptance');

  return (
    <div className="min-h-screen bg-base-400 text-base-100 flex flex-col items-center">
      {/* Header */}
      <div className="text-center mt-12">
        <h1 className="text-4xl font-bold text-base-100">Terms & Conditions</h1>
        <p className="text-base-100/70 mt-2">Last updated: December 2025</p>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center">
        <div className="flex flex-col gap-8 w-full items-center">
          <div className="lg:w-full">
            <div className="bg-base-500 rounded-2xl shadow-sm border border-base-300 p-8">
              {/* Acceptance of Terms Section */}
              <section id="acceptance" className="mb-12 scroll-mt-20">
                <div className="flex flex-col items-center gap-4 mb-6 text-center">
                  <div className="p-3 bg-primary/20 rounded-xl">
                    <FiFileText className="text-2xl text-primary" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-base-100">Acceptance of Terms</h2>
                    <div className="w-16 h-1 bg-primary rounded-full mt-2 mx-auto"></div>
                  </div>
                </div>
                <div className="prose prose-lg max-w-none text-center">
                  <p className="text-base-100/80 leading-relaxed text-lg">
                    By accessing and using Ezi Drop's delivery services, you acknowledge that you have read, 
                    understood, and agree to be bound by these Terms and Conditions. If you do not agree with 
                    any part of these terms, you must not use our services.
                  </p>
                  <div className="bg-primary/10 border-l-4 border-primary p-6 my-8 rounded-r-xl">
                    <p className="text-base-100 text-sm font-medium">
                      <strong className="text-primary">Note:</strong> These terms constitute a legally binding agreement between you and Ezi Drop.
                    </p>
                  </div>
                </div>
              </section>

              {/* Services Description Section */}
              <section id="services" className="mb-12 scroll-mt-20">
                <div className="flex flex-col items-center gap-4 mb-6 text-center">
                  <div className="p-3 bg-primary/20 rounded-xl">
                    <FiTruck className="text-2xl text-primary" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-base-100">Services Description</h2>
                    <div className="w-16 h-1 bg-primary rounded-full mt-2 mx-auto"></div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6 justify-center">
                  {/* Delivery Services */}
                  <div className="bg-base-400 border border-base-300 p-6 rounded-xl">
                    <h3 className="font-semibold text-base-100 mb-4 flex items-center gap-3 text-lg">
                      <FiTruck className="text-primary" />
                      Delivery Services
                    </h3>
                    <ul className="text-base-100/80 space-y-3 text-base">
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                        Same-day delivery within city limits
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                        Next-day delivery for nationwide shipping
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                        Real-time parcel tracking
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                        Cash on Delivery (COD) options
                      </li>
                    </ul>
                  </div>
                  
                  {/* Service Coverage */}
                  <div className="bg-base-400 border border-base-300 p-6 rounded-xl">
                    <h3 className="font-semibold text-base-100 mb-4 flex items-center gap-3 text-lg">
                      <FiUser className="text-primary" />
                      Service Coverage
                    </h3>
                    <ul className="text-base-100/80 space-y-3 text-base">
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                        Major cities across Bangladesh
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                        Urban and semi-urban areas
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                        Business and residential addresses
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                        24/7 customer support availability
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Repeat same centering logic for all other sections */}
              {/* ... User Responsibilities, Payments, Prohibited Items, Liability, Contact ... */}

              {/* Last Updated */}
              <div className="mt-12 pt-8 border-t border-base-300 text-center">
                <p className="text-base-100/70 text-sm">
                  These Terms and Conditions were last updated on <strong className="text-base-100">December 1, 2024</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
