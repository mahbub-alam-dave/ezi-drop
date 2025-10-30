"use client";
import React from "react";
import { motion } from "framer-motion";

// Framer Motion Variants
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

// Item component for list readability
const PolicyItem = ({ children }) => (
  <li className="flex items-start mb-2">
    <span className="text-[var(--color-primary)] dark:text-[var(--color-primary-dark)] mr-3 mt-1 text-lg">
      •
    </span>
    <span className="text-[var(--color-text-soft)] dark:text-[var(--color-text-soft-dark)]">
      {children}
    </span>
  </li>
);

const ReturnRefundPolicy = () => {
  return (
    <main className="bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] min-h-screen py-20 px-6 md:px-10">
      <div className="max-w-[1000px] mx-auto space-y-16">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-4 border-b pb-8 border-[var(--color-border)] dark:border-[var(--color-border)]"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] bg-clip-text text-transparent">
            Return & Refund Policy
          </h1>
          <p className="text-lg md:text-xl text-[var(--color-text-soft)] dark:text-[var(--color-text-soft-dark)]">
            Effective Date: October 30, 2025
          </p>
          <p className="max-w-3xl mx-auto text-[var(--color-text-soft)] dark:text-[var(--color-text-soft-dark)] pt-4">
            At EziDrop, we are committed to customer satisfaction and a
            transparent delivery process. This policy applies in cases of parcel
            damage, loss, or incorrect delivery.
          </p>
        </motion.div>

        {/* 1. Conditions for Refund/Return */}
        <motion.section
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="space-y-6"
        >
          <h2 className="text-3xl font-bold text-[var(--color-text)] dark:text-[var(--color-text-dark)]">
            1. Conditions for Refund and Return
          </h2>
          <div className="overflow-x-auto rounded-lg border border-[var(--color-border)] dark:border-[var(--color-border)]">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--color-primary)] text-white">
                <tr>
                  <th scope="col" className="p-4 text-base font-semibold">
                    Condition
                  </th>
                  <th scope="col" className="p-4 text-base font-semibold">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)] dark:divide-[var(--color-border)]">
                <tr className="bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)]">
                  <td className="p-4 font-bold text-[var(--color-text)] dark:text-[var(--color-text-dark)]">
                    Lost Parcel
                  </td>
                  <td className="p-4 text-[var(--color-text-soft)] dark:text-[var(--color-text-soft-dark)]">
                    If the parcel is lost before delivery, according to the
                    EziDrop tracking status.
                  </td>
                </tr>
                <tr className="bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)]">
                  <td className="p-4 font-bold text-[var(--color-text)] dark:text-[var(--color-text-dark)]">
                    Damaged Parcel
                  </td>
                  <td className="p-4 text-[var(--color-text-soft)] dark:text-[var(--color-text-soft-dark)]">
                    If the parcel is damaged or destroyed during delivery or
                    transit (Digital Proofing of the damaged parcel is
                    mandatory).
                  </td>
                </tr>
                <tr className="bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)]">
                  <td className="p-4 font-bold text-[var(--color-text)] dark:text-[var(--color-text-dark)]">
                    Wrong Delivery
                  </td>
                  <td className="p-4 text-[var(--color-text-soft)] dark:text-[var(--color-text-soft-dark)]">
                    If the parcel is delivered to an incorrect address, other
                    than the one confirmed by the recipient or sender.
                  </td>
                </tr>
                <tr className="bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)]">
                  <td className="p-4 font-bold text-[var(--color-text)] dark:text-[var(--color-text-dark)]">
                    Time Limit
                  </td>
                  <td className="p-4 text-[var(--color-text-soft)] dark:text-[var(--color-text-soft-dark)]">
                    A claim must be filed within **48 hours (48h)** of the
                    confirmed delivery failure or damage.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.section>

        {/* 2. Refund Process */}
        <motion.section
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="space-y-6"
        >
          <h2 className="text-3xl font-bold text-[var(--color-text)] dark:text-[var(--color-text-dark)]">
            2. Refund Process
          </h2>

          <h3 className="text-xl font-semibold text-[var(--color-text)] dark:text-[var(--color-text-dark)] mt-4">
            A. Refundable Amount
          </h3>
          <ul className="list-disc pl-6 space-y-2">
            <PolicyItem>
              **Delivery Charge:** If the parcel is lost or damaged before
              delivery, the full delivery charge will be refunded.
            </PolicyItem>
            <PolicyItem>
              **Compensation:** Compensation will be provided based on the
              parcel value and according to the terms of EziDrop's Compensation
              Policy.
            </PolicyItem>
          </ul>

          <h3 className="text-xl font-semibold text-[var(--color-text)] dark:text-[var(--color-text-dark)] mt-4">
            B. Refund Timeline
          </h3>
          <ul className="list-disc pl-6 space-y-2">
            <PolicyItem>
              After the refund process is initiated, the full amount is
              typically returned within **7 to 14 working days**.
            </PolicyItem>
            <PolicyItem>
              This period may vary depending on the refund method (Bank Transfer
              / Mobile Banking).
            </PolicyItem>
          </ul>
        </motion.section>

        {/* 3. Exclusions */}
        <motion.section
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="space-y-6"
        >
          <h2 className="text-3xl font-bold text-[var(--color-text)] dark:text-[var(--color-text-dark)]">
            3. Exclusions from Return/Refund
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <PolicyItem>
              **Packaging Defects:** Damage due to faulty or weak packaging
              provided by the sender.
            </PolicyItem>
            <PolicyItem>
              **Prohibited Items:** Issues arising from sending goods prohibited
              by the government or EziDrop.
            </PolicyItem>
            <PolicyItem>
              **Incorrect Information:** Submission of wrong delivery address or
              incorrect recipient contact information by the sender.
            </PolicyItem>
            <PolicyItem>
              **Customer Error:** Parcel damage caused by the buyer or
              recipient's personal error after receiving the delivery.
            </PolicyItem>
          </ul>
        </motion.section>

        {/* 4. Parcel Return */}
        <motion.section
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="space-y-6"
        >
          <h2 className="text-3xl font-bold text-[var(--color-text)] dark:text-[var(--color-text-dark)]">
            4. Parcel Return (Return to Sender)
          </h2>
          <p className="text-[var(--color-text-soft)] dark:text-[var(--color-text-soft-dark)]">
            If a delivery attempt fails (e.g., recipient refusal or unable to
            locate the address):
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <PolicyItem>
              The parcel will be automatically returned to the sender.
            </PolicyItem>
            <PolicyItem>
              A **Return Charge** will be applicable for sending the parcel back
              to the sender, which is generally equivalent to the initial
              delivery charge.
            </PolicyItem>
          </ul>
        </motion.section>

        {/* 5. Claim Submission */}
        <motion.section
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="space-y-6"
        >
          <h2 className="text-3xl font-bold text-[var(--color-text)] dark:text-[var(--color-text-dark)]">
            5. Claim Submission
          </h2>
          <p className="text-[var(--color-text-soft)] dark:text-[var(--color-text-soft-dark)]">
            To file a refund or damage claim:
          </p>
          <ol className="list-decimal pl-6 space-y-2">
            <PolicyItem>
              Contact our Customer Support **(AI Chatbot or Live Messaging)**
              within **48 hours** of the failed delivery.
            </PolicyItem>
            <PolicyItem>
              Clearly state the parcel's **Tracking Number** and detailed
              description of the damage (if applicable).
            </PolicyItem>
            <PolicyItem>
              Provide **photos** (digital proof) of the damaged parcel.
            </PolicyItem>
          </ol>
        </motion.section>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1 }}
          className="text-center pt-10 pb-20 text-sm italic text-[var(--color-secondary)] dark:text-[var(--color-secondary-dark)]"
        >
          **Please Note:** EziDrop reserves the right to make any changes to
          this policy.
        </motion.div>
      </div>
    </main>
  );
};

export default ReturnRefundPolicy;
