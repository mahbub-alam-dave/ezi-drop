"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const slides = [
  {
    title: "Fast & Secure Courier Service Across Bangladesh",
    subtitle: "Nationwide Delivery",
    desc: "Send parcels anywhere in Bangladesh quickly and safely. Affordable, reliable delivery for every district and city.",
    button: "View All Services ↗",
    btnlink:"/",
    phone: "+880 1711 000000",
    image: "https://i.ibb.co/YF3t0Nhk/delivery2-generated-removebg-preview.png",
  },
  {
    title: "Track Your Parcel in Real-Time",
    subtitle: "Reliable Nationwide Tracking",
    desc: "Stay updated with our real-time tracking system. Always know exactly where your package is across Bangladesh.",
    button: "Track Now ↗",
    btnlink:"/dashboard/user/my-bookings",
    phone: "+880 1711 000001",
    image: "https://i.ibb.co/v4xSRby3/Screenshot-2025-09-16-192322-removebg-preview.png",
  },
  {
    title: "Complete Coverage Across the Country",
    subtitle: "From Dhaka to Every District",
    desc: "We deliver to every corner of Bangladesh—from major cities to rural areas—fast and securely.",
    button: "Parcel Booking ↗",
    btnlink:"/send-parcel",
    phone: "+880 1711 000002",
    image: "https://i.ibb.co.com/yBPK7hz4/bangladesh-map-all-divisions-3d-600nw-2271167587-removebg-preview.png",
  },
];

export default function BannerSection() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const slide = slides[index];

  return (
    <section className="w-full min-h-screen md:h-[90vh] lg:h-[80vh] xl:h-[75vh] relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-950 dark:to-gray-800">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10% left-5% w-60 h-60 bg-blue-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10% right-5% w-80 h-80 bg-purple-400 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-400 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Main Container */}
      <div className="max-w-1440px mx-auto h-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full items-center gap-8 lg:gap-12 xl:gap-16">
          
          {/* Text Content - Left Side */}
          <div className="flex flex-col justify-center space-y-6 lg:space-y-8 z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="space-y-4 lg:space-y-6"
              >
                {/* Subtitle */}
                <motion.p 
                  className="text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-widest text-xs sm:text-sm lg:text-base"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {slide.subtitle}
                </motion.p>
                
                {/* Title */}
                <motion.h1 
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-800 dark:text-white leading-tight lg:leading-tight xl:leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {slide.title}
                </motion.h1>
                
                {/* Description */}
                <motion.p 
                  className="text-base sm:text-lg md:text-xl lg:text-xl text-gray-600 dark:text-gray-300 leading-relaxed lg:leading-loose max-w-2xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {slide.desc}
                </motion.p>

                {/* CTA Buttons */}
                <motion.div 
                  className="flex flex-col sm:flex-row gap-4 lg:gap-6 items-start sm:items-center pt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  {/* Primary Button */}
                  <Link href={slide.btnlink} >
                  <button className="group bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 lg:py-4 rounded-xl font-semibold text-sm sm:text-base lg:text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform flex items-center gap-2 border-2 border-transparent hover:border-blue-300">
                    {slide.button}
                    <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </button>
                  </Link>
                  
                  {/* Phone Section */}
                  <div className="flex items-center gap-3 lg:gap-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-3 lg:p-4 rounded-xl shadow-lg border border-white/20">
                    <div className="bg-blue-100 dark:bg-blue-900 p-2 lg:p-3 rounded-full">
                      <span className="text-blue-600 dark:text-blue-400 text-lg lg:text-xl">📞</span>
                    </div>
                    <div>
                      <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">Call Us Now</p>
                      <p className="text-base lg:text-lg xl:text-xl font-bold text-gray-800 dark:text-white">{slide.phone}</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Slide Indicators */}
            <motion.div 
              className="flex gap-2 lg:gap-3 mt-6 lg:mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`flex-1 max-w-8 h-2 lg:h-3 rounded-full transition-all duration-500 ${
                    i === index 
                      ? 'bg-blue-600 dark:bg-blue-400' 
                      : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                  }`}
                />
              ))}
            </motion.div>
          </div>

          {/* Image Content - Right Side */}
          <div className="flex items-center justify-center h-full relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 1.1, rotate: 2 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="relative w-full max-w-2xl"
              >
                {/* Floating Background Elements */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-200 dark:bg-blue-800 rounded-full blur-2xl opacity-50 animate-float"></div>
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-purple-200 dark:bg-purple-800 rounded-full blur-2xl opacity-50 animate-float delay-1000"></div>
                
                {/* Main Image */}
                <motion.img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-auto max-h-[400px] sm:max-h-[450px] lg:max-h-[500px] xl:max-h-[550px] object-contain drop-shadow-2xl relative z-10"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white/50 to-transparent dark:from-gray-900/50 pointer-events-none"></div>
    </section>
  

  );
}