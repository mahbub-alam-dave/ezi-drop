'use client';
import React from 'react';
import { FiShield, FiUser, FiLock, FiGlobe, FiEye, FiFileText, FiPhone, FiMail, FiAlertCircle } from 'react-icons/fi';

export default function PrivacyPolicy() {

  return (
    <div className="bg-ng-base-400  min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">

        {/* Main Content */}
        <main className="lg:w-3/4 space-y-12">

          {/* Introduction */}
          <section id="introduction" className="scroll-mt-20">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-ng-base-500 text-base-100">
                <FiShield className="text-2xl" />
              </div>
              <h2 className="text-2xl font-bold">Introduction</h2>
            </div>
            <p className="leading-relaxed text-base-400">
              At <strong>Ezi Drop</strong>, we are committed to protecting your privacy and ensuring the security of your personal information. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our delivery services.
            </p>
            <div className="border-l-4 border-ng-base-500 bg-ng-base-500/20 p-4 my-4 rounded">
              <p className="text-sm">
                <strong>Note:</strong> By using Ezi Drop services, you agree to the collection and use of information in accordance with this policy.
              </p>
            </div>
          </section>

          {/* Information We Collect */}
          <section id="information-collection" className="scroll-mt-20">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-green-500 text-base-100">
                <FiUser className="text-2xl" />
              </div>
              <h2 className="text-2xl font-bold">Information We Collect</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-500/20 p-6 rounded-lg hover:bg-green-500/30 transition">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <FiUser /> Personal Information
                </h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Full name, email, and contact details</li>
                  <li>Delivery addresses and location data</li>
                  <li>Payment information</li>
                  <li>Identification documents</li>
                </ul>
              </div>

              <div className="bg-green-500/20 p-6 rounded-lg hover:bg-green-500/30 transition">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <FiGlobe /> Technical Information
                </h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>IP address and device information</li>
                  <li>Browser type and version</li>
                  <li>Usage data and analytics</li>
                  <li>Cookies and tracking data</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section id="how-we-use" className="scroll-mt-20">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-purple-500 text-base-100">
                <FiEye className="text-2xl" />
              </div>
              <h2 className="text-2xl font-bold">How We Use Your Information</h2>
            </div>
            <ul className="space-y-3">
              {[
                'Service Delivery: Process and fulfill your delivery requests',
                'Communication: Send updates, tracking information, notifications',
                'Payment Processing: Handle transactions and prevent fraud',
                'Customer Support: Provide assistance and resolve issues',
                'Service Improvement: Enhance and optimize our services',
                'Legal Compliance: Meet regulatory requirements and obligations',
              ].map((item, idx) => (
                <li key={idx} className="bg-purple-500/20 p-3 rounded hover:bg-purple-500/30 transition">{item}</li>
              ))}
            </ul>
          </section>

          {/* Data Sharing */}
          <section id="data-sharing" className="scroll-mt-20">
            <h2 className="text-2xl font-bold mb-4">Data Sharing and Disclosure</h2>
            <div className="bg-yellow-500/20 p-6 rounded-lg hover:bg-yellow-500/30 transition">
              <p className="mb-2">We do not sell your personal information. We may share your data with:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Delivery Riders: Necessary information to complete deliveries</li>
                <li>Payment Processors: Secure payment handling partners</li>
                <li>Legal Authorities: When required by law</li>
                <li>Service Providers: Trusted partners who assist operations</li>
              </ul>
            </div>
          </section>

          {/* Data Security */}
          <section id="data-security" className="scroll-mt-20">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-red-500 text-base-100">
                <FiLock className="text-2xl" />
              </div>
              <h2 className="text-2xl font-bold">Data Security</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { title: 'Encryption', desc: 'All data encrypted in transit and at rest' },
                { title: 'Access Control', desc: 'Strict role-based access to personal data' },
                { title: 'Regular Audits', desc: 'Continuous monitoring and testing' },
              ].map((item, idx) => (
                <div key={idx} className="bg-red-500/20 p-4 rounded-lg text-center hover:bg-red-500/30 transition">
                  <h4 className="font-semibold mb-1">{item.title}</h4>
                  <p className="text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* User Rights */}
          <section id="your-rights" className="scroll-mt-20">
            <h2 className="text-2xl font-bold mb-4">Your Rights</h2>
            <div className="bg-blue-500/20 p-6 rounded-lg grid md:grid-cols-2 gap-3 hover:bg-blue-500/30 transition">
              {[
                'Access your personal data',
                'Correct inaccurate data',
                'Delete your personal data',
                'Object to data processing',
                'Data portability',
                'Withdraw consent',
              ].map((right, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>{right}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Cookies */}
          <section id="cookies" className="scroll-mt-20">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-orange-500 text-base-100">
                <FiAlertCircle className="text-2xl" />
              </div>
              <h2 className="text-2xl font-bold">Cookies & Tracking</h2>
            </div>
            <p className="bg-orange-500/20 p-4 rounded hover:bg-orange-500/30 transition">
              We use cookies and similar tracking technologies to monitor activity, personalize content, and improve user experience. You can control cookies via browser settings.
            </p>
          </section>

          {/* Contact */}
          <section id="contact" className="scroll-mt-20">
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <div className="bg-ng-base-500/80 p-6 rounded-lg text-base-100 hover:bg-ng-base-500/90 transition">
              <h3 className="text-xl font-semibold mb-2">Privacy Questions?</h3>
              <p className="mb-3">If you have questions about this Privacy Policy or your data, please contact our Privacy Team:</p>
              <p className="flex items-center gap-2"><FiMail /> privacy@ezidrop.com</p>
              <p className="flex items-center gap-2"><FiPhone /> +1-212-456-7890</p>
            </div>
          </section>

          {/* Last Updated */}
          <div className="text-center mt-8">
            <p className="text-sm opacity-80">
              This Privacy Policy was last updated on <strong>December 1, 2024</strong>
            </p>
          </div>

        </main>
      </div>
    </div>
  );
}
