"use client";
import { motion } from "framer-motion";

export default function DiscountSection() {
  return (
    <section
      className="
        max-w-[1440px] mx-auto relative py-16 px-4 md:px-10
        bg-center bg-cover bg-no-repeat
      "
      style={{
        backgroundImage:
          "url('https://i.ibb.co.com/KxcqfHnt/online-delivery-phone-concept-fast-260nw-1609947532.webp')",
      }}
    >
      {/* Overlay that adapts to theme */}
      <div className="
        absolute inset-0
        bg-[rgba(0,0,0,0.4)]
        dark:bg-[rgba(0,0,0,0.6)]
      "></div>

      <div className="relative text-center">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="
            text-3xl md:text-4xl font-bold mb-4
            text-color
          "
        >
          Special Discount for New Customers!
        </motion.h2>

        {/* Short description */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          viewport={{ once: true }}
          className="
            mb-8 text-lg md:text-xl
            text-color-soft
          "
        >
          Get <span className="font-extrabold">20% OFF</span> on your first parcel delivery
          across Bangladesh. Fast, secure & reliable courier service.
        </motion.p>

        {/* Call-to-action button */}
        <motion.a
          href="/book-parcel"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          viewport={{ once: true }}
          className="
            inline-block font-semibold px-8 py-3 rounded-full shadow-md transition
            background-color-primary hover:bg- text-[var(--color-bg)]
            hover:opacity-90
          "
        >
          Book Your Parcel Now
        </motion.a>
      </div>
    </section>
  );
}
