"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Aos from "aos";


const slides = [
  {
    title: "Fastest & Secured Logistics Solution & Services",
    subtitle: "International Logistics",
    desc: "Lorem ipsum dolor sit amet consectetur. Ut tellus suspendisse nulla aliquam. Risus rutrum as tellus eget ultrices pretium nisi amet facilisis egestas cursus any is vivamus.",
    button: "All Services ↗",
    phone: "+025 757 576 560",
    image:"https://i.ibb.co.com/JwgcQm4V/delivery2-generated.jpg",
  },
  {
    title: "Track Your Packages in Real-Time",
    subtitle: "Reliable Delivery",
    desc: "Easily track your shipments with our real-time tracking system. Stay updated and always informed about your deliveries.",
    button: "Track Now ↗",
    phone: "+025 757 576 561",
    image: "https://i.ibb.co/9pMJ1tN/courier2.jpg",
  },
  {
    title: "Worldwide Shipping Services",
    subtitle: "Global Reach",
    desc: "Send parcels anywhere in the world with our secure and fast global logistics services. Peace of mind guaranteed.",
    button: "Ship Now ↗",
    phone: "+025 757 576 562",
    image: "https://i.ibb.co/zXY0PLX/courier3.jpg",
  },
];

export default function BannerSection() {
  const [index, setIndex] = useState(0);
 useEffect(() => {
    Aos.init({
      duration: 1000,   
      once: false,
      offset: 100,         
    });
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const slide = slides[index];

  return (
    <section className="relative h-[90vh] flex overflow-hidden">
      {/* Left Panel with D-shaped Clip Path */}
      <div
        className="w-full md:w-1/2 bg-red-600 flex items-center justify-center p-8 md:p-16 text-white relative z-10"
        style={{
          clipPath:
            "circle(100% 50% at 50%)", // D-shape curve
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            className="max-w-lg"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 1 }}
          >
            <p data-aos="fade-up"
     data-aos-anchor-placement="top-center" className="uppercase tracking-wider mb-2">{slide.subtitle}</p>
            <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-snug">
              {slide.title}
            </h1>
            <p className="mb-6 text-base md:text-lg">{slide.desc}</p>

            <div className="flex items-center gap-4">
              <button className="border border-white px-5 py-3 rounded-lg hover:bg-white hover:text-red-600 transition">
                {slide.button}
              </button>

              <div className="flex items-center gap-2">
                <span className="bg-white text-red-600 rounded-full p-3">
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

      {/* Right Image Section */}
      <div className="absolute md:relative md:w-1/2 h-full right-0 top-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={index}
            src={slide.image}
            alt="Courier Banner"
            className="h-full w-full object-cover"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          />
        </AnimatePresence>
      </div>
    </section>
  );
}
