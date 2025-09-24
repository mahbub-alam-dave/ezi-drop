// Implement By Abu Bokor(fontend) and Yasin(Backend).
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

const BeARider = () => {
  const { register, handleSubmit, reset } = useForm();

 const onSubmit = async (data) => {
  try {
    const res = await fetch("/api/riders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (result.success) {
      Swal.fire("Success!", "Application submitted successfully.", "success");
      reset(); // form reset hobe
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
          {/* Personal Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Full Name"
              register={register("fullName", { required: true })}
            />
            <InputField
              label="Phone Number"
              type="tel"
              placeholder="+8801XXXXXXXXX"
              register={register("phone", { required: true })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Email Address"
              type="email"
              register={register("email", { required: true })}
            />
            <InputField
              label="Date of Birth"
              type="date"
              register={register("dob", { required: true })}
            />
          </div>

          {/* Address */}
          <TextAreaField
            label="Current Address"
            register={register("address", { required: true })}
          />

          {/* Vehicle Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SelectField
              label="Vehicle Type"
              register={register("vehicleType", { required: true })}
              options={["Motorbike", "Bicycle", "Car", "Other"]}
            />
            <InputField
              label="Vehicle Model"
              register={register("vehicleModel", { required: true })}
            />
          </div>
          <InputField
            label="Vehicle Registration Number"
            register={register("vehicleReg", { required: true })}
          />

          {/* License */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Driving License Number"
              register={register("licenseNo", { required: true })}
            />
            <InputField
              label="National ID Number"
              register={register("nid", { required: true })}
            />
          </div>

          <TextAreaField
            label="Additional Notes (optional)"
            register={register("notes")}
          />

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

const SelectField = ({ label, register, options }) => (
  <div>
    <label className="block mb-1 font-medium">{label}</label>
    <select
      {...register}
      className="w-full rounded-lg border border-[var(--border-color)]
         dark:border-[var(--border-color-two)]
         bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)]
         px-4 py-3 focus:outline-none
         focus:ring-2 focus:ring-[var(--color-primary)]
         dark:focus:ring-[var(--color-primary-dark)]"
    >
      <option value="">Select {label}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

export default BeARider;
