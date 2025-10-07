// pages/404.js (if using Pages Router)
// or app/404.js (if using App Router)

"use client"; // only needed in App Router

import { motion } from "framer-motion";
import Link from "next/link";
// import { PackageSearch } from "lucide-react"; // simple delivery-related icon
import { LuPackageSearch } from "react-icons/lu";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center bg-gray-50 px-4">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="mb-6"
      >
        <LuPackageSearch className="w-24 h-24 text-red-500" />
      </motion.div>

      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-4xl font-bold text-gray-800"
      >
        404 - Page Not Found
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-gray-600 mt-2"
      >
        Oops! Looks like the page you’re looking for is missing.
      </motion.p>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <Link
          href="/"
          className="mt-6 inline-block rounded-xl bg-blue-600 text-white px-6 py-3 shadow hover:bg-blue-700 transition"
        >
          Go Back Home
        </Link>
      </motion.div>
    </div>
  );
}
