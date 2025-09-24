// Implement By Abu Bokor (Frontend) and Yasin (Backend)
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

const BeARider = () => {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    try {// Send data to database...
      const res = await fetch("/api/riders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.success) {
        Swal.fire(
          "Success!",
          "Application submitted successfully. Please wait for admin approval.",
          "success"
        );
        reset();
      } else {
        Swal.fire("Error!", result.error || "Something went wrong.", "error");
      }
    } catch (err) {
      Swal.fire("Error!", err.message, "error");
    }
  };

  return (
    <section
      className="min-h-screen flex justify-center items-center px-4 py-10
         text-[var(--color-text)] dark:text-[var(--color-text-dark)]"
    >
      <div
        className="w-full max-w-3xl rounded-2xl shadow-xl p-6
          bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)]
          transition-colors duration-300"
      >
        <h1
          className="text-center text-2xl md:text-3xl font-bold mb-8
             text-[var(--color-primary)] dark:text-[var(--color-primary-dark)]"
        >
          Become a Rider
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Applicant Name */}
          <InputField
            label="Applicant Name"
            register={register("applicantName", { required: true })}
          />

          {/* Applicant Email */}
          <InputField
            label="Applicant Email"
            type="email"
            register={register("applicantEmail", { required: true })}
          />

          {/* Mobile Number */}
          <InputField
            label="Mobile Number"
            type="tel"
            placeholder="+8801XXXXXXXXX"
            register={register("mobileNumber", { required: true })}
          />

          {/* Application Title */}
          <InputField
            label="Application Title"
            register={register("applicationTitle", { required: true })}
          />

          {/* Profile Summary */}
          <TextAreaField
            label="Profile Summary"
            register={register("profileSummary", { required: true })}
          />

          {/* Educational Qualification */}
          <TextAreaField
            label="Educational Qualification"
            register={register("education", { required: true })}
          />

          {/* Resume/CV (Link or Upload) */}
          <div>
            <label className="block mb-1 font-medium">Resume/CV Link</label>
            <input
              type="url"
              placeholder="Paste your CV/Resume link here"
              {...register("resumeLink", { required: true })}
              className="w-full rounded-lg border border-[var(--border-color)]
                 dark:border-[var(--border-color-two)]
                 bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)]
                 px-4 py-3 focus:outline-none
                 focus:ring-2 focus:ring-[var(--color-primary)]
                 dark:focus:ring-[var(--color-primary-dark)]"
            />
            <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">
              * You can also share a Google Drive/Dropbox link of your CV.
            </p>
          </div>

          <button
            type="submit"
            className="w-full mt-4 rounded-lg border border-[var(--border-color)]
               dark:border-[var(--border-color-two)]
               bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)]
               text-white font-medium py-3 transition-colors"
          >
            Submit Application
          </button>
        </form>
      </div>
    </section>
  );
};

/* ----- Reusable Fields ----- */
const InputField = ({ label, register, type = "text", placeholder = "" }) => (
  <div>
    <label className="block mb-1 font-medium">{label}</label>
    <input
      {...register}
      type={type}
      placeholder={placeholder || label}
      className="w-full rounded-lg border border-[var(--border-color)]
         dark:border-[var(--border-color-two)]
         bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)]
         px-4 py-3 focus:outline-none
         focus:ring-2 focus:ring-[var(--color-primary)]
         dark:focus:ring-[var(--color-primary-dark)]"
    />
  </div>
);

const TextAreaField = ({ label, register }) => (
  <div>
    <label className="block mb-1 font-medium">{label}</label>
    <textarea
      {...register}
      placeholder={label}
      className="w-full rounded-lg border border-[var(--border-color)]
         dark:border-[var(--border-color-two)]
         bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)]
         px-4 py-3 focus:outline-none
         focus:ring-2 focus:ring-[var(--color-primary)]
         dark:focus:ring-[var(--color-primary-dark)]"
    />
  </div>
);

export default BeARider;
