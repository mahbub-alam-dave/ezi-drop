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
    AOS.init({ duration: 2000, once: false, offset: 100 });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const slide = slides[index];

  return (
    <section className="w-full">
      <div
        className="
        relative mb-16 mt-[100px] h-[60vh] md:h-[80vh] flex overflow-hidden rounded-lg
        bg-[color:var(--color-primary)]/20  mx-auto shadow-[color:var(--color-primary)]/20 shadow-sm
      "
      >
        {/* ---------- LEFT SHAPED TEXT BOX ---------- */}
        <div className="absolute w-full h-full md:w-4/6 flex items-center justify-end p-6 md:p-16 lg:pr-40 xl:p-0">
          <div className="xl:w-[1050px] ml-10">
            <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <polygon
              className="banner-shape"
              points="0,0 90,0 100,50 90,100 0,100"
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
                className="
                uppercase tracking-wider story-script-regular mb-2
                text-[color:var(--color-primary)]
                dark:text-[color:var(--color-primary)]
              "
              >
                {slide.subtitle}
              </p>

              <h1
                className="
                text-2xl md:text-4xl font-extrabold mb-4 leading-snug
                text-[color:var(--color-text)] dark:text-[color:var(--color-text)]
              "
              >
                {slide.title}
              </h1>

              <p
                className="
                mb-6 text-base md:text-lg
                text-[color:var(--color-text-soft)]
                dark:text-[color:var(--color-text-soft)]
              "
              >
                {slide.desc}
              </p>

              <div className="flex items-center gap-4">
                <button
                  className="
                  px-5 py-3 rounded-lg border transition
                  border-[color:var(--color-primary)]
                  text-[color:var(--color-primary)]
                  hover:bg-[color:var(--color-primary)]
                  hover:text-white
                  dark:border-[color:var(--color-primary-dark)]
                  dark:text-[color:var(--color-primary-dark)]
                  dark:hover:bg-[color:var(--color-primary-dark)]
                "
                >
                  {slide.button}
                </button>

                <div className="flex items-center gap-2">
                  <span
                    className="
                    p-3 rounded-full border-2
                    border-[color:var(--color-primary)]
                    hover:bg-[color:var(--color-primary)] hover:text-white
                    dark:border-[color:var(--color-primary-dark)]
                    dark:hover:bg-[color:var(--color-primary-dark)]
                  "
                  >
                    📞
                  </span>
                  <div>
                    <p className="text-sm text-[color:var(--color-text-soft)] dark:text-[color:var(--color-text-soft)]">
                      Call Us Now
                    </p>
                    <p className="font-bold text-lg text-[color:var(--color-text)] dark:text-[color:var(--color-text)]">
                      {slide.phone}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          </div>
        </div>

        {/* ---------- RIGHT IMAGE SECTION ---------- */}
        <div className="absolute md:w-3/6  h-full md:z-10 flex items-center opacity-30 md:opacity-100 right-0 top-0">
          <div className="xl:w-[720px]">
            <AnimatePresence mode="wait">
            <motion.img
              key={index}
              src={slide.image}
              alt="Courier Banner"
              className="h-full w-full p-5 object-center"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 1 }}
            />
          </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
