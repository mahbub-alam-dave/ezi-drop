"use client";
import React, { useState, useRef, useEffect } from "react";

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(null);
  const contentRefs = useRef([]);
  const [heights, setHeights] = useState([]);

  useEffect(() => {
    // Set initial heights for animation
    setHeights(contentRefs.current.map(ref => ref ? ref.scrollHeight : 0));
  }, []);

  const faqs = [
    {
      question: "How can I book a courier with Ezi Courier?",
      answer:
        "Booking with Ezi Courier is simple! Visit our website or mobile app, fill out the Send Parcel form with sender and receiver details, select parcel type and dimensions, choose your preferred service center and delivery speed. You can pay securely online and receive instant confirmation with your tracking ID.",
    },
    {
      question: "How do I track my parcel in real-time?",
      answer:
        "After booking, you'll receive a unique Tracking ID via email and SMS. Enter this ID in the Track Parcel section on our website or app to see real-time delivery updates, including pickup confirmation, transit status, and delivery confirmation with recipient signature. You can also opt for proactive notifications at every stage.",
    },
    {
      question: "What types of delivery services do you provide?",
      answer:
        "We offer comprehensive delivery solutions including same-day city delivery, next-day domestic service, inter-district delivery, international shipping to 50+ countries, specialized temperature-controlled deliveries, and express document services. We also provide specialized logistics for businesses with bulk shipping discounts.",
    },
    {
      question: "How is the delivery cost calculated?",
      answer:
        "Our pricing is transparent and based on: 1) Parcel dimensions (weight and volume), 2) Delivery distance, 3) Service speed (standard vs express), 4) Package value (insurance considerations), and 5) Special handling requirements. Use our online calculator for instant quotes before booking. Businesses eligible for volume discounts can contact our corporate team.",
    },
    {
      question: "Is my parcel safe during delivery?",
      answer:
        "Absolutely! We employ multiple security measures: verified background-checked delivery personnel, tamper-evident packaging options, real-time GPS tracking, secure handling protocols, and optional insurance coverage up to $5,000. High-value items receive special handling and signature-required delivery confirmation.",
    },
    {
      question: "What are your delivery hours and days?",
      answer:
        "We offer extended delivery hours from 8:00 AM to 9:00 PM, Monday through Saturday. Sunday deliveries available in select metropolitan areas for an additional fee. For urgent after-hours deliveries, contact our customer service team for special arrangements.",
    },
    {
      question: "What if I need to cancel or modify my delivery?",
      answer:
        "You can cancel or modify your delivery through your account dashboard up until the package is picked up by our courier. For changes after pickup, contact our support team immediately. Modification fees may apply depending on the changes requested. Cancellations before pickup receive full refunds.",
    },
    {
      question: "How do I contact customer support?",
      answer:
        "Our customer support team is available 24/7 through multiple channels: Live chat on our website and app, phone support at 1-800-EZI-COURIER, email at support@ezi-courier.com, and social media messaging. For complex issues, you can schedule a callback from a specialized support agent.",
    },
  ];

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        * { font-family: 'Poppins', sans-serif; }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .faq-item {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .faq-item:hover {
          transform: translateX(5px);
        }
        
        .answer-text {
          animation: fadeIn 0.5s ease forwards;
        }
      `}</style>

      <section className="max-w-[1440px]  bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] 
      text-[var(--color-text)] dark:text-[var(--color-text-dark)] mx-auto flex flex-col lg:flex-row justify-between items-center py-16 px-6 md:px-12 bg-gradient-to-br shadow-xl rounded-3xl my-10">
        {/* Image Side with Animation */}
        <div className="flex-1 flex justify-center items-center mb-10 lg:mb-0 lg:mr-10">
          <div className="relative">
            <img
              className="w-full  rounded-2xl h-auto object-cover shadow-xl transform hover:scale-105 transition-transform duration-700"
              src="https://plus.unsplash.com/premium_photo-1678000616480-d4a041e6eba1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8RmFxfGVufDB8fDB8fHww"
              alt="Ezi Courier Service FAQ"
            />
            <div className="absolute -bottom-5 -right-5 bg-indigo-600 text-white p-4 rounded-xl shadow-lg animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* FAQ Content */}
        <div className="flex-1 w-full">
          <div className="flex items-center mb-4">
            <div className="w-12 h-1 bg-blue-600 rounded-full mr-3"></div>
            <p className="text-blue-600 text-sm font-semibold uppercase tracking-wide">
              Frequently Asked Questions
            </p>
          </div>
          <h1 className="text-lg md:text-5xl font-bold mt-2 mb-4 text-base-900">
            Need Help? We've Got Answers
          </h1>
          <p className="text-lg text-base-600 mb-8 max-w-lg">
            Everything you need to know about Ezi Courier & Delivery services. 
            Can't find the answer you're looking for? Please contact our friendly team.
          </p>

          <div className="space-y-2">
            {faqs.map((faq, index) => (
              <div
                className={`faq-item border border-slate-200 rounded-2xl p-5 transition-all cursor-pointer bg-base-400 shadow-sm hover:shadow-md ${openIndex === index ? 'border-indigo-300 shadow-md' : ''}`}
                key={index}
                onClick={() => handleToggle(index)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-base-800 pr-4">
                    {faq.question}
                  </h3>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`flex-shrink-0 transform transition-transform duration-500 ${openIndex === index ? "rotate-180 text-indigo-600" : "text-base-500"}`}
                  >
                    <path
                      d="m5 7.5 5 5 5-5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div
                  ref={el => contentRefs.current[index] = el}
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${openIndex === index ? "mt-4" : ""}`}
                  style={{
                    height: openIndex === index ? `${heights[index]}px` : '0px'
                  }}
                >
                  <p className="text-base text-base-600 answer-text pb-1">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Additional Support CTA */}
          <div className="mt-2 p-6 bg-gradient-to-r from-blue-600 to-violet-400 rounded-2xl text-white shadow-lg transform hover:scale-[1.02] transition-transform duration-300">
            <h3 className="text-xl font-bold mb-2">Still have questions?</h3>
            <p className="mb-4 opacity-90">We're here to help you with all your delivery needs</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="bg-white text-indigo-700 font-medium py-3 px-6 rounded-lg hover:bg-indigo-50 transition-colors">
                Contact Support
              </button>
              <button className="bg-transparent border border-white text-white font-medium py-3 px-6 rounded-lg hover:bg-white/10 transition-colors">
                Live Chat
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}