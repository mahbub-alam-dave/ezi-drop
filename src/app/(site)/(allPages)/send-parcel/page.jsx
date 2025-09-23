// implement by abu bokor and yasin..
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

const SendParcel = () => {
  const { register, handleSubmit, reset, watch } = useForm();
  const [districtData, setDistrictData] = useState({});
  const [cost, setCost] = useState(null);

  const pickupDistrict = watch("pickupDistrict");
  const deliveryDistrict = watch("deliveryDistrict");
  const parcelType = watch("parcelType");
  const weight = watch("weight");

  // zilla/upozilla data load
  useEffect(() => {
    fetch("/districts.json")
      .then((res) => res.json())
      .then((data) => setDistrictData(data))
      .catch((err) => console.error("District data load failed", err));
  }, []);

  // cost calculation
  useEffect(() => {
    let baseCost = 0;
    if (
      pickupDistrict === deliveryDistrict &&
      parcelType === "Documents" &&
      weight <= 5
    ) {
      baseCost += 60;
    } else {
      if (pickupDistrict && deliveryDistrict) {
        baseCost = pickupDistrict === deliveryDistrict ? 60 : 120;
      }
      if (baseCost !== 0 && weight) {
        const w = parseFloat(weight);
        if (w <= 5) baseCost += 0;
        else if (w <= 15) baseCost += 40;
        else if (w <= 30) baseCost += 80;
        else baseCost += 100;
      }
    }
    setCost(baseCost);
  }, [pickupDistrict, deliveryDistrict, parcelType, weight]);

  const onSubmit = async (data) => {
  try {
    const res = await fetch("/api/parcels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      Swal.fire({
        title: "Success!",
        text: "Your parcel request has been submitted.",
        icon: "success",
        confirmButtonColor: "var(--color-primary)",
        background: "var(--color-bg)",
        color: "var(--color-text)",
      });
      reset();
    } else {
      const errData = await res.json();
      Swal.fire("Error", errData.message || "Something went wrong", "error");
    }
  } catch (err) {
    console.error(err);
    Swal.fire("Error", "Network error", "error");
  }
};


  const districts = Object.keys(districtData);

  return (
    <div
      className="min-h-screen my-16 flex justify-center items-center p-4
       bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)]
       text-[var(--color-text)] dark:text-[var(--color-text-dark)]"
    >
      <div
        className="w-full max-w-6xl rounded-2xl shadow-xl p-6
        bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)]
        transition-colors duration-300"
      >
        <h1
          className="text-2xl md:text-3xl font-bold mb-6 text-center
           text-[var(--color-primary)] dark:text-[var(--color-primary-dark)]"
        >
          Send Your Parcel
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Left column */}
          <div className="space-y-4">
            <InputField
              label="Sender Name"
              register={register("senderName", { required: true })}
            />
            <InputField
              label="Sender Phone"
              type="tel"
              placeholder="+8801XXXXXXXXX"
              register={register("senderPhone", { required: true })}
            />

            <SelectField
              label="Pickup District"
              register={register("pickupDistrict", { required: true })}
              options={districts}
            />
            <SelectField
              label="Pickup Upazila"
              register={register("pickupUpazila", { required: true })}
              options={pickupDistrict ? districtData[pickupDistrict] : []}
              disabled={!pickupDistrict}
            />

            <TextAreaField
              label="Pickup Address"
              register={register("pickupAddress", { required: true })}
            />
            <TextAreaField
              label="Special Instructions"
              register={register("special")}
            />
          </div>

          {/* Right column */}
          <div className="space-y-4">
            <InputField
              label="Receiver Name"
              register={register("receiverName", { required: true })}
            />
            <InputField
              label="Receiver Phone"
              type="tel"
              placeholder="+8801XXXXXXXXX"
              register={register("receiverPhone", { required: true })}
            />

            <SelectField
              label="Delivery District"
              register={register("deliveryDistrict", { required: true })}
              options={districts}
            />
            <SelectField
              label="Delivery Upazila"
              register={register("deliveryUpazila", { required: true })}
              options={deliveryDistrict ? districtData[deliveryDistrict] : []}
              disabled={!deliveryDistrict}
            />

            <TextAreaField
              label="Delivery Address"
              register={register("deliveryAddress", { required: true })}
            />

            <SelectField
              label="Parcel Type"
              register={register("parcelType", { required: true })}
              options={["Documents", "Electronics", "Clothes", "Others"]}
            />
            <SelectField
              label="Weight (kg)"
              register={register("weight", { required: true })}
              options={[
                { value: 5, label: "Under 5kg" },
                { value: 15, label: "Under 15kg" },
                { value: 30, label: "Under 30kg" },
                { value: 60, label: "Over 30kg" },
              ]}
            />
          </div>

          {cost !== null && (
            <p
              className="lg:col-span-2 mt-2 text-xl font-semibold
                          text-[var(--color-primary)] dark:text-[var(--color-primary-dark)]"
            >
              Estimated Cost: {cost}৳
            </p>
          )}

          <div className="lg:col-span-2">
            <button
              type="submit"
              className="w-full mt-4 rounded-lg border border-[var(--border-color)]
               dark:border-[var(--border-color-two)]
               bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)]
               text-white font-medium py-3 transition-colors"
            >
              Submit Parcel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ----- Helper Components -----
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

const SelectField = ({ label, register, options = [], disabled = false }) => (
  <div>
    <label className="block mb-1 font-medium">{label}</label>
    <select
      {...register}
      disabled={disabled}
      className="w-full rounded-lg border border-[var(--border-color)]
                 dark:border-[var(--border-color-two)]
                 bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)]
                 px-4 py-3 focus:outline-none
                 focus:ring-2 focus:ring-[var(--color-primary)]
                 dark:focus:ring-[var(--color-primary-dark)]"
    >
      <option value="">Select {label}</option>
      {options.map((opt) =>
        typeof opt === "object" ? (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ) : (
          <option key={opt}>{opt}</option>
        )
      )}
    </select>
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

export default SendParcel;
