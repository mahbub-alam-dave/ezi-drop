"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";


const slides = [
  {
    title: "Fast & Secure Courier Service Across Bangladesh",
    subtitle: "Nationwide Delivery",
    desc: "Send parcels anywhere in Bangladesh quickly and safely. Affordable, reliable delivery for every district and city.",
    button: "View All Services ↗",
    phone: "+880 1711 000000",
    image: "https://i.ibb.co/YF3t0Nhk/delivery2-generated-removebg-preview.png",
  },
  {
    title: "Track Your Parcel in Real-Time",
    subtitle: "Reliable Nationwide Tracking",
    desc: "Stay updated with our real-time tracking system. Always know exactly where your package is across Bangladesh.",
    button: "Track Now ↗",
    phone: "+880 1711 000001",
    image: "https://i.ibb.co/v4xSRby3/Screenshot-2025-09-16-192322-removebg-preview.png",
  },
  {
    title: "Complete Coverage Across the Country",
    subtitle: "From Dhaka to Every District",
    desc: "We deliver to every corner of Bangladesh—from major cities to rural areas—fast and securely.",
    button: "Send Parcel ↗",
    phone: "+880 1711 000002",
    image: "https://i.ibb.co.com/yBPK7hz4/bangladesh-map-all-divisions-3d-600nw-2271167587-removebg-preview.png",
  },
];

export default function BannerSection() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    AOS.init({ duration: 1000, once: false, offset: 100 });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const slide = slides[index];

  return (
    <section className="relative h-[70vh] flex overflow-hidden bg-[color:var(--color-primary)]/10 max-w-[1600px] mx-auto">
      {/* ---------- LEFT SHAPED TEXT BOX WITH BORDER USING SVG ---------- */}
      <div className="absolute w-full h-full md:w-4/6 flex items-center justify-center p-8 md:p-16">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <polygon
            points="0,0 90,0 100,50 90,100 0,100"
            fill="var(--color-bg)"
          />
        </svg>

        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            className="max-w-lg relative z-10"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 1 }}
          >
            <p
              data-aos="fade-up"
              data-aos-anchor-placement="top-center"
              className="uppercase tracking-wider mb-2 text-[color:var(--color-text-soft)] dark:text-[color:var(--color-text-soft-dark)]"
            >
              {slide.subtitle}
            </p>

            <h1 data-aos="fade-up"
              data-aos-anchor-placement="top-center" className="text-3xl md:text-5xl font-extrabold mb-4 leading-snug">
              {slide.title}
            </h1>

            <p className="mb-6 text-base md:text-lg">{slide.desc}</p>

            <div className="flex items-center gap-4">
              <button className="px-5 py-3 rounded-lg border transition border-[color:var(--color-primary)] text-[color:var(--color-primary)] hover:bg-[color:var(--color-primary)] hover:text-white">
                {slide.button}
              </button>

              <div className="flex items-center gap-2">
                <span className="p-3 rounded-full border-2 border-[color:var(--color-primary)] hover:bg-[color:var(--color-primary)] hover:text-white">
                  📞
                </span>
                <div>
                  <p className="text-sm">Call Us Now</p>
                  <p className="font-bold text-lg">{slide.phone}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ---------- RIGHT IMAGE SECTION ---------- */}
      <div className="absolute md:w-3/6 h-full z-10 right-0 top-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={index}
            src={slide.image}
            alt="Courier Banner"
            className="h-full w-full object-center"
            initial={{ opacity: 0, x: 100 }}  // <-- শুরু অবস্থায় right এর বাইরে
            animate={{ opacity: 1, x: 0 }}    // <-- final position
            exit={{ opacity: 0, x: 100 }}     // <-- exit হলে আবার right চলে যাবে
            transition={{ duration: 1 }}
          />
        </AnimatePresence>
      </div>
    </section>
  );
}
