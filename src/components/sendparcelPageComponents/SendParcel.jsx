"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { redirect, useRouter } from "next/navigation";
import axios from "axios";
import {
  SelectFieldDistrict,
  SelectFieldUpazila,
} from "@/utility/selectDistrict";
import { useSession } from "next-auth/react";
import { FiUploadCloud, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";

const SendParcel = ({ districts, userData }) => {
  const { data: session, status } = useSession();
  const { register, handleSubmit, reset, watch } = useForm();
  const [cost, setCost] = useState(null);
  const [parcelId, setParcelId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState([]);
  const [loading, setLoading] = useState(false); // Add loading state
  const router = useRouter();
  const fileInputRef = useRef();

  const pickupDistrictId = watch("pickupDistrictId");
  const deliveryDistrictId = watch("deliveryDistrictId");
  const parcelType = watch("parcelType");
  const weight = watch("weight");

  const pickupDistrictData = useMemo(
    () => districts.find((d) => d.districtId === pickupDistrictId),
    [pickupDistrictId, districts]
  );
  const deliveryDistrictData = useMemo(
    () => districts.find((d) => d.districtId === deliveryDistrictId),
    [deliveryDistrictId, districts]
  );

  // Calculate cost
  useEffect(() => {
    let baseCost = 0;
    if (
      pickupDistrictId === deliveryDistrictId &&
      parcelType === "Documents" &&
      weight <= 5
    ) {
      baseCost += 60;
    } else {
      if (pickupDistrictId && deliveryDistrictId) {
        baseCost = pickupDistrictId === deliveryDistrictId ? 60 : 120;
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
  }, [pickupDistrictId, deliveryDistrictId, parcelType, weight]);

  // Save user district if not saved
  const saveUserDistrict = async () => {
    if (!userData?.districtId) {
      await fetch("/api/update-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userData.email,
          districtId: pickupDistrictData?.districtId,
          district: pickupDistrictData?.district,
        }),
      });
    }
  };

  // Upload images
  const uploadImages = async (files) => {
    const urls = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append("image", file);
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMAGEAPI_KEY}`,
        formData
      );
      urls.push(res?.data?.data?.url);
    }
    return urls;
  };

  // Handle preview
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setPreview(files.map((file) => URL.createObjectURL(file)));
  };

  const handleRemovePreview = (index) => {
    const newPreview = [...preview];
    newPreview.splice(index, 1);
    setPreview(newPreview);
    const dt = new DataTransfer();
    const files = fileInputRef.current.files;
    Array.from(files)
      .filter((_, i) => i !== index)
      .forEach((f) => dt.items.add(f));
    fileInputRef.current.files = dt.files;
  };

  // Submit
  const onSubmit = async (data) => {
    if (!session?.user && status === "unauthenticated") {
      toast.error("Please login to book a parcel");
      redirect("/login");
      return;
    }

    try {
      setLoading(true); // Start loading
      setUploading(true);
      const imageFiles = fileInputRef.current.files;
      const imageUrls = await uploadImages(imageFiles);
      setUploading(false);

      const parcelData = {
        ...data,
        pickupDistrict: pickupDistrictData.district,
        deliveryDistrict: deliveryDistrictData.district,
        parcelImages: imageUrls,
      };

      // Geocode
      const pickupRes = await fetch(`/api/geocode?address=${encodeURIComponent(parcelData.pickupUpazila + ", " + parcelData.pickupDistrict)}`);
      const pickupData = await pickupRes.json();

      const deliveryRes = await fetch(`/api/geocode?address=${encodeURIComponent(parcelData.deliveryUpazila + ", " + parcelData.deliveryDistrict)}`);
      const deliveryData = await deliveryRes.json();

      const parcelRes = await fetch("/api/parcels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...parcelData,
          pickupLocation: { lat: pickupData.lat, lon: pickupData.lon, display_name: pickupData.display_name },
          deliveryLocation: { lat: deliveryData.lat, lon: deliveryData.lon, display_name: deliveryData.display_name },
        }),
      });

      const resultData = await parcelRes.json();

      if (parcelRes.ok) {
        await saveUserDistrict();
        setParcelId(resultData.parcelId);
        reset();
        setPreview([]);
        setShowModal(true);
        toast.success("Parcel submitted successfully!");
      } else {
        toast.error(resultData.message || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to submit parcel");
    } finally {
      setLoading(false); // Stop loading in all cases
      setUploading(false);
    }
  };

  return (
    <>
      {/* ✅ Full Screen Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              Submitting your parcel...
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              Please wait while we process your request
            </p>
          </div>
        </div>
      )}

      {/* ✅ Success Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] text-center p-8 rounded-2xl shadow-2xl border border-[var(--color-border)] w-[90%] max-w-md animate-zoomIn">
            <h2 className="text-3xl font-bold mb-4 text-[var(--color-primary)] dark:text-[var(--color-primary-dark)]">
              🎉 Thanks for choosing Ezi Drop!
            </h2>
            <p className="mb-8 text-[var(--color-text-soft)] dark:text-[var(--color-text-soft-dark)]">
              Your parcel has been submitted successfully.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push("/dashboard/track-parcel")}
                className="flex-1 rounded-lg bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-medium py-3 transition-all hover:scale-105"
              >
                Track Parcel
              </button>
              <button
                onClick={() =>
                  router.push(`/payment/method?parcelId=${parcelId}`)
                }
                className="flex-1 rounded-lg border border-[var(--border-color)] dark:border-[var(--border-color-two)] text-[var(--color-text)] dark:text-[var(--color-text-dark)] hover:bg-[var(--color-primary)] hover:text-white transition-all hover:scale-105 py-3 font-medium"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Main Parcel Form */}
      <section className="min-h-screen py-20 px-4 flex justify-center items-center bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] transition-all duration-300">
        <div className="w-full max-w-7xl rounded-3xl shadow-2xl p-8 md:p-12 lg:p-16 border border-[var(--color-border)] dark:border-[var(--border-color-two)]">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-10 text-[var(--color-primary)] dark:text-[var(--color-primary-dark)] story-script-regular">
            Send Your Parcel 🚚
          </h1>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Left Column */}
            <div className="space-y-5">
              <InputField
                label="Sender Name"
                register={register("senderName", { required: true })}
                defaultValue={userData?.name || ""}
                readOnly={status === "authenticated"}
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
                defaultValue={userData?.email || ""}
                readOnly={status === "authenticated"}
              />
              <SelectFieldDistrict
                label="Pickup District"
                name="pickupDistrictId"
                register={register}
                required
                districts={districts}
                defaultValue={userData?.districtId || ""}
              />
              <SelectFieldUpazila
                label="Pickup Upazila"
                name="pickupUpazila"
                register={register}
                required
                upazilas={pickupDistrictData?.subDistricts || []}
                disabled={!pickupDistrictData}
              />
              <TextAreaField
                label="Pickup Address"
                register={register("pickupAddress", { required: true })}
              />
              <TextAreaField
                label="Special Instructions"
                register={register("special")}
              />
              <div className="hidden lg:block">
                <FileInputField
                  label="Upload Parcel Images (Multiple)"
                  fileInputRef={fileInputRef}
                  uploading={uploading}
                  preview={preview}
                  handleFileChange={handleFileChange}
                  handleRemovePreview={handleRemovePreview}
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-5">
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
              <SelectFieldDistrict
                label="Delivery District"
                name="deliveryDistrictId"
                register={register}
                required
                districts={districts}
              />
              <SelectFieldUpazila
                label="Delivery Upazila"
                name="deliveryUpazila"
                register={register}
                required
                upazilas={deliveryDistrictData?.subDistricts || []}
                disabled={!deliveryDistrictData}
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
              <div className="lg:hidden">
                <FileInputField
                  label="Upload Parcel Images (Multiple)"
                  fileInputRef={fileInputRef}
                  uploading={uploading}
                  preview={preview}
                  handleFileChange={handleFileChange}
                  handleRemovePreview={handleRemovePreview}
                />
              </div>
            </div>

            {/* Cost */}
            {cost && (
              <p className="lg:col-span-2 mt-4 text-2xl font-semibold text-center text-[var(--color-primary)] dark:text-[var(--color-primary-dark)] animate-fadeIn">
                Estimated Cost: {cost}৳
              </p>
            )}

            {/* Submit */}
            <div className="lg:col-span-2 mt-6">
              <button
                type="submit"
                disabled={loading}
                className={`w-full rounded-xl py-4 font-semibold text-lg text-white shadow-lg transition-all duration-300 ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] hover:shadow-[0_0_20px_rgba(52,105,252,0.5)] hover:scale-[1.02]"
                }`}
              >
                {loading ? "Submitting..." : "Submit Parcel"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

// Helper Components (unchanged)
const InputField = ({ label, register, type = "text", defaultValue = "", readOnly = false, placeholder = "" }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
    <input
      {...register}
      type={type}
      defaultValue={defaultValue}
      readOnly={readOnly}
      placeholder={placeholder || `Enter ${label}`}
      className="w-full rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
    />
  </div>
);

const SelectField = ({ label, register, options = [], disabled = false }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
    <select
      {...register}
      disabled={disabled}
      className="w-full rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
    >
      <option value="">Select {label}</option>
      {options.map((opt) =>
        typeof opt === "object" ? (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ) : (
          <option key={opt} value={opt}>{opt}</option>
        )
      )}
    </select>
  </div>
);

const TextAreaField = ({ label, register }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
    <textarea
      {...register}
      placeholder={`Enter ${label}`}
      className="w-full rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
      rows="4"
    />
  </div>
);

const FileInputField = ({ label, fileInputRef, uploading, preview = [], handleFileChange, handleRemovePreview }) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>

    {/* Drag & Drop Wrapper */}
    <div
      onClick={() => fileInputRef.current?.click()}
      className="relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 cursor-pointer hover:border-blue-400 transition-all duration-200 bg-white dark:bg-gray-800"
    >
      <FiUploadCloud className="text-4xl text-blue-500 mb-2" />
      <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
        Drag & drop or <span className="text-blue-600 font-medium">browse</span> to upload
      </p>
    </div>

    {/* Hidden Input */}
    <input
      type="file"
      accept="image/*"
      multiple
      ref={fileInputRef}
      onChange={handleFileChange}
      className="hidden"
    />

    {uploading && <p className="text-blue-500 text-sm mt-2 animate-pulse">Uploading images...</p>}

    {preview.length > 0 && (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
        {preview.map((src, i) => (
          <div key={i} className="relative group overflow-hidden rounded-lg border border-gray-300 dark:border-gray-700">
            <img src={src} alt="preview" className="w-full h-24 object-cover transition-transform duration-200 group-hover:scale-105" />
            {handleRemovePreview && (
              <button onClick={() => handleRemovePreview(i)} className="absolute top-1 right-1 bg-red-500 p-1 rounded-full opacity-0 group-hover:opacity-100 text-white transition-opacity">
                <FiTrash2 size={14} />
              </button>
            )}
          </div>
        ))}
      </div>
    )}
  </div>
);

export default SendParcel;