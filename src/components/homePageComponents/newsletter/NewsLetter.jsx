// Impliment by Abu Bokor...
"use client";
import React, { useState } from "react";
import Swal from "sweetalert2";

const NewsLetter = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Swal.fire({
        icon: "error",
        title: "Worng Email!",
        text: "Try again to another!",
        showConfirmButton: false,
        timer: 2500,
      });
      return;
    }

    Swal.fire({
      icon: "success",
      title: "Subscription Successful!",
      text: "Thank you for subscribing to our newsletter. Stay tuned for the latest updates!",
      showConfirmButton: false,
      timer: 2500,
    }).then(() => {
      setName("");
      setEmail("");
    });
  };

  return (
    <div
      id="Newsletter"
      className="flex h-auto items-center justify-center bg-[--color-bg] p-4 pb-16 text-[--color-text] transition-colors duration-500 dark:bg-[--color-bg-dark] dark:text-[--color-text-dark]"
    >
      <div className="flex w-full max-w-2xl flex-col items-center justify-center rounded-2xl p-6 md:p-12">
        <h2 className="pb-8 text-center font-serif text-3xl font-bold md:text-4xl lg:text-5xl">
          Subscribe Our Newsletter
        </h2>

        <div className="flex w-full flex-col items-center justify-center gap-4 md:flex-row md:gap-2">
          <input
            type="text"
            placeholder="Your name"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
            className="input-style w-full text-color-soft"
          />
          <input
            type="email"
            placeholder="Your email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="input-style w-full text-color-soft"
          />
          {/* input w-full rounded-lg border-2 border-gray-300 bg-white placeholder:text-[--color-text-soft] focus:outline-none focus:ring-1 focus:ring-[--color-primary] dark:border-gray-700 dark:bg-gray-800 dark:placeholder:text-[--color-text-soft-dark] dark:focus:ring-[--color-primary-dark] */}
          <button
            type="button"
            onClick={handleSubmit}
            className="background-color-primary btn rounded-md text-white"
          >
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsLetter;
