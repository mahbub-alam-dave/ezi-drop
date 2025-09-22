"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import supportAnimation from "../../../app/assests/lottieFiles/lottie.json";

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(null);
  const lottieRef = useRef();

  // Function to change colors in the Lottie animation
  const modifyColors = (animationData) => {
    // Create a deep copy of the animation data
    const modifiedData = JSON.parse(JSON.stringify(animationData));
    
    // Define color mappings (original colors to new colors)
    const colorMappings = {
      // Blue colors to indigo
      "#3b82f6": "#4f46e5", // blue-500 to indigo-600
      "#2563eb": "#4338ca", // blue-600 to indigo-700
      "#1d4ed8": "#3730a3", // blue-700 to indigo-800
      
      // Light blue to lighter indigo
      "#93c5fd": "#a5b4fc", // blue-300 to indigo-300
      
      // You can add more color mappings based on your animation
    };
    
    // Recursive function to update colors in the animation data
    const updateColors = (obj) => {
      if (typeof obj === "object" && obj !== null) {
        for (let key in obj) {
          if (key === "c" && typeof obj[key] === "object" && obj[key].k !== undefined) {
            // This is a color property
            const colorValue = obj[key].k;
            if (Array.isArray(colorValue) && colorValue.length >= 3) {
              // Convert RGB array to hex
              const r = Math.round(colorValue[0] * 255);
              const g = Math.round(colorValue[1] * 255);
              const b = Math.round(colorValue[2] * 255);
              const hexColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
              
              // Check if this color should be replaced
              if (colorMappings[hexColor]) {
                const newColor = colorMappings[hexColor];
                // Convert hex back to RGB values (0-1 range)
                const bigint = parseInt(newColor.slice(1), 16);
                obj[key].k = [
                  ((bigint >> 16) & 255) / 255,
                  ((bigint >> 8) & 255) / 255,
                  (bigint & 255) / 255,
                  colorValue[3] // preserve alpha
                ];
              }
            }
          } else {
            updateColors(obj[key]);
          }
        }
      }
    };
    
    updateColors(modifiedData);
    return modifiedData;
  };

  const [modifiedAnimation, setModifiedAnimation] = useState(null);

  useEffect(() => {
    // Modify the animation colors when component mounts
    setModifiedAnimation(modifyColors(supportAnimation));
  }, []);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 py-16 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-7xl mx-auto">
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
          {/* Lottie Animation Section */}
          <div className="flex items-center justify-center">
            {modifiedAnimation ? (
              <Lottie 
                animationData={modifiedAnimation} 
                loop={true}
                autoplay={true}
                lottieRef={lottieRef}
                className="w-full max-w-md"
              />
            ) : (
              <div className="w-full h-64 flex items-center justify-center">
                <div className="animate-pulse bg-gray-200 rounded-lg w-full h-full"></div>
              </div>
            )}
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
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
          </div>
        </div>

        {/* Support Section */}
        <motion.div 
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0.5 }}
  className="mt-16"
>
</motion.div>
      </div>
    </div>
  );
}