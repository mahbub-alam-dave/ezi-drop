"use client";
import React, { useState } from "react";
import Swal from "sweetalert2";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  // input change handle
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // current time with timezone
      const currentTime = new Date().toLocaleString("en-US", {
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });

      const dataToSend = {
        ...formData,
        time: currentTime,
      };

      // just for now in console
      console.log(" Contact Form Data:", dataToSend);

      setLoading(false);
      setFormData({ name: "", email: "", description: "" });

      Swal.fire({
        title: "Success!",
        text: "Your message has been submitted successfully.",
        icon: "success",
        confirmButtonColor: "var(--color-primary)",
      });
    } catch (error) {
      console.error(" Error submitting form:", error);
      setLoading(false);

      Swal.fire({
        title: " Oops!",
        text: "Something went wrong. Please try again.",
        icon: "error",
        confirmButtonColor: "var(--color-primary)",
      });
    }
  };

  return (
    <div className="bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] py-16 px-6 md:px-8">
      <div className="max-w-[800px] mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-[var(--color-primary)] dark:text-[var(--color-primary-dark)]">
          Contact Us
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block mb-2 font-semibold">Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none 
              border-gray-300 dark:border-gray-700 
              bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)]
              text-gray-800 dark:text-gray-200"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-2 font-semibold">Email</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none 
              border-gray-300 dark:border-gray-700 
              bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)]
              text-gray-800 dark:text-gray-200"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-2 font-semibold">Message</label>
            <textarea
              name="description"
              required
              rows="5"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none 
              border-gray-300 dark:border-gray-700 
              bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)]
              text-gray-800 dark:text-gray-200"
            ></textarea>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[var(--color-primary)] dark:bg-[var(--color-primary-dark)] 
            text-white font-semibold rounded-md hover:opacity-90 transition disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
}
