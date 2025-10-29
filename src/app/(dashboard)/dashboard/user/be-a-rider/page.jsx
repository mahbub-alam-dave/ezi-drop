// Implement By Abu Bokor (Frontend) and Yasin (Backend)
"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

const BeARider = () => {
  const { register, handleSubmit, reset } = useForm();
  const [districtData, setDistrictData] = useState({});
  const districts = Object.keys(districtData);

  // load districts.json (same as SendParcel)
  useEffect(() => {
    fetch("/districts.json")
      .then((res) => res.json())
      .then((data) => setDistrictData(data))
      .catch((err) => console.error("District data load failed", err));
  }, []);

  const onSubmit = async (data) => {
    try {
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
    <section className="min-h-screen flex justify-center items-center px-6 py-10 text-color">
      <div className="w-full max-w-5xl rounded-2xl shadow-xl p-6 sm:p-10 md:p-14 md:py-18 bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] transition-colors duration-300">
        <h1 className="text-center text-2xl md:text-3xl font-bold mb-8 text-color">
          Become a Rider
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 ">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 xl:gap-10">
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

          {/* Rider District Dropdown */}
          <SelectField
            label="Preferred District"
            register={register("district", { required: true })}
            options={districts}
          />

          {/* Resume/CV (Link or Upload) */}
          <div>
            <label className="block mb-1 font-medium">Resume/CV Link</label>
            <input
              type="url"
              placeholder="Paste your CV/Resume link here"
              {...register("resumeLink", { required: true })}
              className="w-full input-style text-color"
            />
            <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">
              * You can also share a Google Drive/Dropbox link of your CV.
            </p>
          </div>
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
    <label className="block mb-1 ">{label}</label>
    <input
      {...register}
      type={type}
      placeholder={placeholder || label}
      className="w-full input-style text-color"
    />
  </div>
);

const TextAreaField = ({ label, register }) => (
  <div>
    <label className="block mb-1 ">{label}</label>
    <textarea
      {...register}
      placeholder={label}
      className="w-full input-style text-color"
    />
  </div>
);

const SelectField = ({ label, register, options = [], disabled = false }) => (
  <div>
    <label className="block mb-1 ">{label}</label>
    <select
      {...register}
      disabled={disabled}
      className="w-full input-style text-color-soft"
    >
      <option value="">Select {label}</option>
      {options.map((opt) =>
        typeof opt === "object" ? (
          <option key={opt.value} value={opt.value} className="background-color">
            {opt.label}
          </option>
        ) : (
          <option key={opt} value={opt} className="background-color">
            {opt}
          </option>
        )
      )}
    </select>
  </div>
);

export default BeARider;


/* rounded-lg border border-[var(--border-color)]
         dark:border-[var(--border-color-two)]
         bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)]
         px-4 py-3 focus:outline-none
         focus:ring-2 focus:ring-[var(--color-primary)]
         dark:focus:ring-[var(--color-primary-dark)] */
