// implement by abu bokor and yasin..
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

const SendParcel = () => {
  const { register, handleSubmit, reset, watch } = useForm();
  const [districtData, setDistrictData] = useState({});
  const [cost, setCost] = useState(null);
  const [parcelId, setParcelId] = useState(null);
  const [showModal, setShowModal] = useState(false); // NEW: modal toggle
  const router = useRouter();

  const pickupDistrict = watch("pickupDistrict");
  const deliveryDistrict = watch("deliveryDistrict");
  const parcelType = watch("parcelType");
  const weight = watch("weight");

  // load districts.json
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
    // Pickup location
    const pickupRes = await fetch(`/api/geocode?address=${encodeURIComponent(data.pickupUpazila + ", " + data.pickupDistrict)}`);
    if (!pickupRes.ok) {
      const err = await pickupRes.json();
      throw new Error(err.error || "Pickup location fetch failed");
    }
    const pickupData = await pickupRes.json();

    // Delivery location
    const deliveryRes = await fetch(`/api/geocode?address=${encodeURIComponent(data.deliveryUpazila + ", " + data.deliveryDistrict)}`);
    if (!deliveryRes.ok) {
      const err = await deliveryRes.json();
      throw new Error(err.error || "Delivery location fetch failed");
    }
    const deliveryData = await deliveryRes.json();

    // Parcel submit
    const parcelRes = await fetch("/api/parcels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        pickupLocation: {
          lat: pickupData.lat,
          lon: pickupData.lon,
          display_name: pickupData.display_name,
        },
        deliveryLocation: {
          lat: deliveryData.lat,
          lon: deliveryData.lon,
          display_name: deliveryData.display_name,
        },
      }),
    });

    if (parcelRes.ok) {
      // alert("Parcel submitted successfully!");
      setShowModal(true)
      const data = await parcelRes.json();
      setParcelId(data.parcelId)
      reset();
    } else {
      const errData = await parcelRes.json();
      alert(errData.message || "Something went wrong");
    }
  } catch (err) {
    console.error(err);
    alert(err.message || "Failed to fetch location");
  }
};


  const districts = Object.keys(districtData);

  return (
    <>
      {/* ---------- Fullscreen Success Modal ---------- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div
            className="bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] 
            text-center p-8 rounded-2xl shadow-2xl w-[90%] max-w-md"
          >
            <h2
              className="text-2xl md:text-3xl font-bold mb-4 
               text-[var(--color-primary)] dark:text-[var(--color-primary-dark)]"
            >
              Thanks for choosing Ezi Drop!
            </h2>
            <p className="mb-8 text-[var(--color-text)] dark:text-[var(--color-text-dark)]">
              Your parcel has been submitted successfully.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push("/user-dashboard/my-bookings")}
                className="flex-1 rounded-lg bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)]
                 text-white font-medium py-3 transition-colors"
              >
                See Your Booking
              </button>
              <button
                //
                onClick={() =>
                  router.push(`/payment/method?parcelId=${parcelId}`)
                }
                className="flex-1 rounded-lg border border-[var(--border-color)]
                 dark:border-[var(--border-color-two)]
                 text-[var(--color-text)] dark:text-[var(--color-text-dark)]
                 hover:bg-[var(--color-primary)] hover:text-white
                 transition-colors py-3 font-medium"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------- Main Form ---------- */}
      <div
        className="min-h-screen my-16 flex justify-center items-center p-4
         text-[var(--color-text)] dark:text-[var(--color-text-dark)]"
      >
        <div
          className="w-full max-w-7xl rounded-2xl shadow-xl p-6 sm:-8 md:p-10 lg:p-12
           bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)]
           transition-colors duration-300"
        >
          <h1
            className="text-2xl md:text-3xl font-bold mb-8 text-center
             text-color"
          >
            Send Your Parcel
          </h1>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-10"
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
              <InputField
                label="Sender Email"
                type="email"
                placeholder="sender@example.com"
                register={register("senderEmail", { required: true })}
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
              <InputField
                label="Receiver Email"
                type="email"
                placeholder="receiver@example.com"
                register={register("receiverEmail", { required: true })}
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
    </>
  );
};

// ----- Helper Components -----
const InputField = ({ label, register, type = "text", placeholder = "" }) => (
  <div>
    <label className="block mb-[6px] ">{label}</label>
    <input
      {...register}
      type={type}
      placeholder={placeholder || label}
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
          <option key={opt} className="background-color">{opt}</option>
        )
      )}
    </select>
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

export default SendParcel;
