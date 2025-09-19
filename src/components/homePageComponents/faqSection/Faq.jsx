"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How can I book a courier with Ezi Courier?",
      answer: "Booking with Ezi Courier is simple! Visit our website or mobile app, fill out the Send Parcel form with sender and receiver details, select parcel type and dimensions, choose your preferred service center and delivery speed. You can pay securely online and receive instant confirmation with your tracking ID.",
      icon: "📦"
    },
    {
      question: "How do I track my parcel in real-time?",
      answer: "After booking, you'll receive a unique Tracking ID via email and SMS. Enter this ID in the Track Parcel section on our website or app to see real-time delivery updates, including pickup confirmation, transit status, and delivery confirmation with recipient signature. You can also opt for proactive notifications at every stage.",
      icon: "📍"
    },
    {
      question: "What types of delivery services do you provide?",
      answer: "We offer comprehensive delivery solutions including same-day city delivery, next-day domestic service, inter-district delivery, international shipping to 50+ countries, specialized temperature-controlled deliveries, and express document services. We also provide specialized logistics for businesses with bulk shipping discounts.",
      icon: "🚚"
    },
    {
      question: "Is my parcel safe during delivery?",
      answer: "Absolutely! We employ multiple security measures: verified background-checked delivery personnel, tamper-evident packaging options, real-time GPS tracking, secure handling protocols, and optional insurance coverage up to $5,000. High-value items receive special handling and signature-required delivery confirmation.",
      icon: "🔒"
    },
    {
      question: "What if I need to cancel or modify my delivery?",
      answer: "You can cancel or modify your delivery through your account dashboard up until the package is picked up by our courier. For changes after pickup, contact our support team immediately. Modification fees may apply depending on the changes requested. Cancellations before pickup receive full refunds.",
      icon: "🔄"
    },
    {
      question: "How do I contact customer support?",
      answer: "Our customer support team is available 24/7 through multiple channels: Live chat on our website and app, phone support at 1-800-EZI-COURIER, email at support@ezi-courier.com, and social media messaging. For complex issues, you can schedule a callback from a specialized support agent.",
      icon: "📞"
    },
  ];

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center p-2 bg-blue-100 rounded-full mb-4">
            <span className="text-blue-600 text-sm font-semibold uppercase tracking-wide px-2">
              FAQs
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Everything you need to know about Ezi Courier services. Can't find what you're looking for? 
            Contact our friendly team.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* FAQ Items */}
          <motion.div 
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100 dark:border-slate-700 ${
                  openIndex === index ? 'ring-2 ring-blue-500 shadow-lg' : ''
                }`}
                onClick={() => handleToggle(index)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="text-2xl mt-1">{faq.icon}</div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-4">
                      {faq.question}
                    </h3>
                  </div>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.div>
                </div>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ 
                        height: "auto", 
                        opacity: 1,
                        transition: {
                          height: {
                            duration: 0.3
                          },
                          opacity: {
                            duration: 0.4,
                            delay: 0.1
                          }
                        }
                      }}
                      exit={{ 
                        height: 0, 
                        opacity: 0,
                        transition: {
                          height: {
                            duration: 0.2
                          },
                          opacity: {
                            duration: 0.2
                          }
                        }
                      }}
                      className="overflow-hidden"
                    >
                      <p className="text-gray-600 dark:text-gray-300 mt-4 pl-10">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>

          {/* Support Section */}
          <div className="flex flex-col space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg"
            >
              <div className="mb-6">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2">Still have questions?</h3>
                <p className="opacity-90">We're here to help you with all your delivery needs</p>
              </div>
              <div className="space-y-4">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-white text-blue-700 font-medium py-3 px-6 rounded-lg flex items-center justify-center space-x-2"
                >
                  <span>Contact Support</span>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-transparent border border-white text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center space-x-2"
                >
                  <span>Live Chat</span>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                </motion.button>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-slate-700"
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Fast Delivery</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">24/7 service available</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Secure Handling</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Your packages are safe</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Online Tracking</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Real-time updates</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}