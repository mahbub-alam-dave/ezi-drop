// Implement By Abu Bokor
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

// Send percel
const SendParcel = () => {
  const { register, handleSubmit, reset, watch } = useForm();
  const [cost, setCost] = useState(null);

  const pickupDistrict = watch("pickupDistrict");
  const deliveryDistrict = watch("deliveryDistrict");
  const parcelType = watch("parcelType");
  const weight = watch("weight");

  useEffect(() => {
    let baseCost = 0;

    if (pickupDistrict === deliveryDistrict && parcelType === "Documents") {
      baseCost = 60;
    } else {
      if (pickupDistrict && deliveryDistrict) {
        baseCost = pickupDistrict === deliveryDistrict ? 60 : 120;
      }

      if (baseCost !== 0 && weight) {
        const w = parseFloat(weight);
        if (w <= 5) {
          baseCost += 0;
        } else if (w <= 15) {
          baseCost += 40;
        } else if (w <= 30) {
          baseCost += 80;
        } else {
          baseCost += 100;
        }
      }
    }

    setCost(baseCost);
  }, [pickupDistrict, deliveryDistrict, parcelType, weight]);

  const onSubmit = async (data) => {
    try {
      //   When Fetch or Send Data Use "data" argument here
      Swal.fire({
        title: "Success!",
        text: "Your parcel request has been submitted.",
        icon: "success",
        confirmButtonColor: "var(--color-primary)",
        background: "var(--color-bg)",
        color: "var(--color-text)",
      });

      reset(); // form clear
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.message || "Something went wrong!",
        icon: "error",
        confirmButtonColor: "var(--color-primary)",
        background: "var(--color-bg)",
        color: "var(--color-text)",
      });
    }
  };

  return (
    <div
      className="
        min-h-screen
        my-16
        dark:bg-[var(--color-bg-dark)]
        text-[var(--color-text)] dark:text-[var(--color-text-dark)]
        flex justify-center items-center p-4
      "
    >
      <div className="w-full max-w-6xl rounded-2xl shadow-lg p-6 bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] border border-[var(--border-color)] dark:border-[var(--border-color-two)]">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center text-[var(--color-primary)] dark:text-[var(--color-primary-dark)]">
          Send Your Parcel
        </h1>

        <form
          // Form Handle
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Left column */}
          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Sender Name</label>
              <input
                {...register("senderName", { required: true })}
                placeholder="Your Full Name"
                className="w-full input input-bordered bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] border border-[var(--border-color)] dark:border-[var(--border-color-two)]"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Sender Phone</label>
              <input
                {...register("senderPhone", { required: true })}
                type="tel"
                placeholder="+8801XXXXXXXXX"
                className="w-full input input-bordered bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] border border-[var(--border-color)] dark:border-[var(--border-color-two)]"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Pickup District</label>
              <select
                {...register("pickupDistrict", { required: true })}
                className="select select-bordered w-full bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] border border-[var(--border-color)] dark:border-[var(--border-color-two)]"
              >
                <option value="">Select District</option>
                <option>Dhaka</option>
                <option>Chittagong</option>
                <option>Rajshahi</option>
                {/* Add other district */}
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium">Pickup Address</label>
              <textarea
                {...register("pickup", { required: true })}
                placeholder="Complete Pickup Address"
                className="w-full textarea textarea-bordered bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] border border-[var(--border-color)] dark:border-[var(--border-color-two)]"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">
                Special Instructions
              </label>
              <textarea
                {...register("special")}
                placeholder="Any notes for courier"
                className="w-full textarea textarea-bordered bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] border border-[var(--border-color)] dark:border-[var(--border-color-two)]"
              />
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Receiver Name</label>
              <input
                {...register("receiverName", { required: true })}
                placeholder="Receiver's Full Name"
                className="w-full input input-bordered bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] border border-[var(--border-color)] dark:border-[var(--border-color-two)]"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Receiver Phone</label>
              <input
                {...register("receiverPhone", { required: true })}
                type="tel"
                placeholder="+8801XXXXXXXXX"
                className="w-full input input-bordered bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] border border-[var(--border-color)] dark:border-[var(--border-color-two)]"
              />
            </div>
            <div>
              {/* Delivery District */}
              <label className="block mb-1 font-medium">
                Delivery District
              </label>
              <select
                {...register("deliveryDistrict", { required: true })}
                className="select select-bordered w-full bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] border border-[var(--border-color)] dark:border-[var(--border-color-two)]"
              >
                <option value="">Select District</option>
                <option>Dhaka</option>
                <option>Chittagong</option>
                <option>Rajshahi</option>
                {/* Add other district */}
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium">Delivery Address</label>
              <textarea
                {...register("delivery", { required: true })}
                placeholder="Complete Delivery Address"
                className="w-full textarea textarea-bordered bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] border border-[var(--border-color)] dark:border-[var(--border-color-two)]"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Parcel Type</label>
              <select
                {...register("parcelType", { required: true })}
                className="select select-bordered w-full bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] border border-[var(--border-color)] dark:border-[var(--border-color-two)]"
              >
                <option value="">Select type</option>
                <option>Documents</option>
                <option>Electronics</option>
                <option>Clothes</option>
                <option>Others</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium">Weight (kg)</label>
              <select
                {...register("weight", { required: true })}
                type="number"
                className="w-full input input-bordered bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] border border-[var(--border-color)] dark:border-[var(--border-color-two)]"
              >
                <option value="">Select type</option>
                <option value={5}> Under 5kg</option>
                <option value={15}> Under 15kg</option>
                <option value={30}> Under 30kg</option>
                <option value={60}> Over 30kg</option>
              </select>
            </div>
          </div>

          <div>
            {/* Live Cost Display */}
            {cost !== null && (
              <p className="mt-1 text-xxl font-semibold text-[var(--color-primary)] dark:text-[var(--color-primary-dark)]">
                Estimated Cost: {cost}৳
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="lg:col-span-2">
            <button
              type="submit"
              className="
                w-full mt-2 btn border-none
                bg-[var(--color-primary)]
                hover:bg-[var(--color-primary-dark)]
                text-white
              "
            >
              Submit Parcel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default SendParcel;
