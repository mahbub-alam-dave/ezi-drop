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
  const [activeTab, setActiveTab] = useState("domestic");
  const { register, handleSubmit, reset, watch, setValue } = useForm();
  const [cost, setCost] = useState(null);
  const [parcelId, setParcelId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState([]);
  const fileInputRef = useRef();
  console.log(parcelId)

  // Domestic form fields
  const pickupDistrictId = watch("pickupDistrictId");
  const deliveryDistrictId = watch("deliveryDistrictId");
  const parcelType = watch("parcelType");
  const weight = watch("weight");

  // Overseas form fields
  const internationalWeight = watch("internationalWeight");
  const internationalParcelType = watch("internationalParcelType");
  const destinationCountry = watch("destinationCountry");
  const serviceType = watch("serviceType");

  // Domestic district data
  const pickupDistrictData = useMemo(
    () => districts.find((d) => d.districtId === pickupDistrictId),
    [pickupDistrictId, districts]
  );

  const deliveryDistrictData = useMemo(
    () => districts.find((d) => d.districtId === deliveryDistrictId),
    [deliveryDistrictId, districts]
  );

  // Cost calculation for domestic shipments (BDT)
  useEffect(() => {
    if (activeTab === "domestic") {
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
      setCost({ amount: baseCost, currency: "BDT" });
    }
  }, [pickupDistrictId, deliveryDistrictId, parcelType, weight, activeTab]);

  // Cost calculation for international shipments (USD)
  useEffect(() => {
    if (activeTab === "overseas") {
      let baseCost = 0;
      if (internationalWeight && destinationCountry && serviceType) {
        const weight = parseFloat(internationalWeight);

        // Base rates by service type
        const serviceRates = {
          express: { base: 45, perKg: 25 },
          standard: { base: 30, perKg: 18 },
          economy: { base: 20, perKg: 12 }
        };

        const rates = serviceRates[serviceType];

        // Country-specific multipliers
        const countryMultipliers = {
          usa: 1.2,
          canada: 1.15,
          uk: 1.1,
          australia: 1.0,
          germany: 0.95,
          france: 0.95,
          japan: 1.05,
          singapore: 0.9,
          uae: 0.85,
          saudi: 0.85,
          other: 0.8
        };

        const multiplier = countryMultipliers[destinationCountry] || countryMultipliers.other;

        // Calculate base cost
        baseCost = rates.base + (Math.max(weight - 1, 0) * rates.perKg);
        baseCost *= multiplier;

        // Parcel type surcharges
        const parcelSurcharges = {
          Electronics: 15,
          Fragile: 25,
          Pharmaceuticals: 35,
          Documents: 0,
          Clothes: 5,
          Others: 10
        };

        baseCost += parcelSurcharges[internationalParcelType] || 0;

        // Insurance (optional)
        const insurance = watch("insurance") === "yes" ? 20 : 0;
        baseCost += insurance;

        // Round to 2 decimal places
        baseCost = Math.round(baseCost * 100) / 100;
      }
      setCost({ amount: baseCost, currency: "USD" });
    }
  }, [internationalWeight, internationalParcelType, destinationCountry, serviceType, activeTab, watch]);

  const saveUserDistrict = async () => {
    if (!userData?.districtId && pickupDistrictData) {
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

  // Upload images with proper state management
  const uploadImages = async (files) => {
    setUploading(true);
    const urls = [];
    
    try {
      for (const file of files) {
        // Validate file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
          toast.error(`File ${file.name} is too large. Maximum size is 10MB.`);
          continue;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast.error(`File ${file.name} is not an image.`);
          continue;
        }

        const formData = new FormData();
        formData.append("image", file);
        
        const res = await axios.post(
          `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMAGE_UPLOAD_KEY}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            timeout: 30000, // 30 seconds timeout
          }
        );
        
        if (res?.data?.data?.url) {
          urls.push(res.data.data.url);
        } else {
          console.error('Upload failed for file:', file.name);
          toast.error(`Failed to upload ${file.name}`);
        }
      }
      
      return urls;
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error('Failed to upload images. Please try again.');
      return urls; // Return whatever URLs were successfully uploaded
    } finally {
      setUploading(false);
    }
  };

  // Handle preview
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setPreview(files.map((file) => URL.createObjectURL(file)));
    }
  };

  const handleRemovePreview = (index) => {
    const newPreview = [...preview];
    URL.revokeObjectURL(newPreview[index]); // Clean up memory
    newPreview.splice(index, 1);
    setPreview(newPreview);
    const dt = new DataTransfer();
    const files = fileInputRef.current.files;
    Array.from(files)
      .filter((_, i) => i !== index)
      .forEach((f) => dt.items.add(f));
    fileInputRef.current.files = dt.files;
  };

  const onSubmitDomestic = async (data) => {
    if (!session?.user && status === "unauthenticated") {
      alert("Please login to book a parcel");
      redirect("/login");
    }

    if (!pickupDistrictData || !deliveryDistrictData) {
      alert("Please select both pickup and delivery districts");
      return;
    }

    setIsSubmitting(true);
    try {
      // Upload images first
      const imageFiles = fileInputRef.current.files;
      let imageUrls = [];
      if (imageFiles.length > 0) {
        imageUrls = await uploadImages(imageFiles);
      }

      const parcelData = {
        ...data,
        pickupDistrict: pickupDistrictData.district,
        deliveryDistrict: deliveryDistrictData.district,
        shipmentType: "domestic",
        parcelImages: imageUrls,
      };

      console.log("Submitting domestic parcel:", parcelData);

      // Pickup location
      const pickupRes = await fetch(
        `/api/geocode?address=${encodeURIComponent(
          parcelData.pickupUpazila + ", " + parcelData.pickupDistrict
        )}`
      );
      if (!pickupRes.ok) {
        const err = await pickupRes.json();
        throw new Error(err.error || "Pickup location fetch failed");
      }

      const pickupData = await pickupRes.json();

      // Delivery location
      const deliveryRes = await fetch(
        `/api/geocode?address=${encodeURIComponent(
          parcelData.deliveryUpazila + ", " + parcelData.deliveryDistrict
        )}`
      );
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
          ...parcelData,
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
          shipmentType: "domestic",
        }),
      });

      if (parcelRes.ok) {
        await saveUserDistrict();
        setShowModal(true);
        const data = await parcelRes.json();
        setParcelId(data?.parcelId);
        console.log(data?.parcelId)
        reset();
        setPreview([]); // Clear preview after successful submission
      } else {
        const resultData = await parcelRes.json();
        toast.error(resultData.message || "Something went wrong");
      }
    } catch (err) {
      console.error("Domestic submission error:", err);
      alert(err.message || "Failed to fetch location");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmitOverseas = async (data) => {
    if (!session?.user && status === "unauthenticated") {
      alert("Please login to book a parcel");
      redirect("/login");
    }

    // Validate required fields for international
    if (!pickupDistrictData) {
      alert("Please select pickup district");
      return;
    }

    if (!data.pickupUpazila) {
      alert("Please select pickup upazila");
      return;
    }

    if (!data.destinationCountry) {
      alert("Please select destination country");
      return;
    }

    setIsSubmitting(true);
    try {
      // Upload images first
      const imageFiles = fileInputRef.current.files;
      let imageUrls = [];
      if (imageFiles.length > 0) {
        imageUrls = await uploadImages(imageFiles);
      }

      const parcelData = {
        ...data,
        pickupDistrict: pickupDistrictData.district,
        shipmentType: "international",
        cost: cost?.amount || 0,
        currency: cost?.currency || "USD",
        parcelImages: imageUrls,
      };

      console.log("Submitting international parcel:", parcelData);

      // Pickup location for international
      const pickupAddress = `${parcelData.pickupUpazila}, ${parcelData.pickupDistrict}, Bangladesh`;
      console.log("Fetching pickup location for:", pickupAddress);

      const pickupRes = await fetch(
        `/api/geocode?address=${encodeURIComponent(pickupAddress)}`
      );

      if (!pickupRes.ok) {
        const errorText = await pickupRes.text();
        console.error("Geocode API error:", errorText);
        throw new Error("Failed to fetch pickup location coordinates");
      }

      const pickupData = await pickupRes.json();
      console.log("Pickup location data:", pickupData);

      if (!pickupData.lat || !pickupData.lon) {
        throw new Error("Could not determine pickup location coordinates");
      }

      // International parcel submit
      const parcelRes = await fetch("/api/parcels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...parcelData,
          pickupLocation: {
            lat: pickupData.lat,
            lon: pickupData.lon,
            display_name: pickupData.display_name,
          },
          deliveryLocation: {
            lat: null,
            lon: null,
            display_name: `${data.receiverAddress}, ${data.receiverCity}, ${data.receiverState}, ${data.destinationCountry}`
          },
          shipmentType: "international",
          internationalDetails: {
            destinationCountry: data.destinationCountry,
            serviceType: data.serviceType,
            insurance: data.insurance || "no",
            customsValue: data.customsValue || 0,
            contentsDescription: data.contentsDescription
          },
          // For international, we still need delivery address but no coordinates
          deliveryDistrict: "International",
          deliveryUpazila: "International"
        }),
      });

      const responseData = await parcelRes.json();
      console.log("Parcel API response:", responseData);

      if (parcelRes.ok) {
        await saveUserDistrict();
        setShowModal(true);
        setParcelId(responseData.parcelId);

        // Reset form
        reset();
        setPreview([]); // Clear preview after successful submission
        // Reset international specific fields
        setValue("destinationCountry", "");
        setValue("internationalWeight", "");
        setValue("internationalParcelType", "");
        setValue("serviceType", "");
        setValue("receiverName", "");
        setValue("receiverPhone", "");
        setValue("receiverEmail", "");
        setValue("receiverAddress", "");
        setValue("receiverCity", "");
        setValue("receiverState", "");
        setValue("receiverZipCode", "");
        setValue("contentsDescription", "");
        setValue("customsValue", "");
        setValue("insurance", "");

      } else {
        throw new Error(responseData.message || "Failed to submit international parcel");
      }
    } catch (err) {
      console.error("International submission error:", err);
      alert(err.message || "Failed to process international shipment. Please check all fields and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = (data) => {
    if (activeTab === "domestic") {
      onSubmitDomestic(data);
    } else {
      onSubmitOverseas(data);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCost(null);
  };

  return (
    <>

      {/* ✅ Full Screen Loading Overlay */}
      {isSubmitting && (
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
      {/* Success Modal */}
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
              Your {activeTab === "domestic" ? "domestic" : "international"} parcel has been submitted successfully.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push("/dashboard/my-bookings")}
                className="flex-1 rounded-lg bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)]
                 text-white font-medium py-3 transition-colors"
              >
                My Bookings
              </button>
              <button
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

      {/* Main Container */}
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

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 dark:border-gray-700 mb-8">
            <button
              onClick={() => handleTabChange("domestic")}
              className={`py-3 px-6 font-medium text-lg transition-colors ${activeTab === "domestic"
                  ? "border-b-2 border-[var(--color-primary)] text-[var(--color-primary)]"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
            >
              🇧🇩 Domestic
            </button>
            <button
              onClick={() => handleTabChange("overseas")}
              className={`py-3 px-6 font-medium text-lg transition-colors ${activeTab === "overseas"
                  ? "border-b-2 border-[var(--color-primary)] text-[var(--color-primary)]"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
            >
              🌍 International
            </button>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Left Column - Common Fields */}
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-3 flex items-center">
                  <span className="mr-2">👤</span> Sender Information
                </h3>
                <div className="space-y-4">
                  <InputField
                    label="Full Name"
                    register={register("senderName", { required: true })}
                    defaultValue={userData?.name || ""}
                    readOnly={status === "authenticated"}
                  />
                  <InputField
                    label="Phone Number"
                    type="tel"
                    placeholder="+8801XXXXXXXXX"
                    register={register("senderPhone", { required: true })}
                  />
                  <InputField
                    label="Email Address"
                    type="email"
                    placeholder="sender@example.com"
                    register={register("senderEmail", { required: true })}
                    defaultValue={userData?.email || ""}
                    readOnly={status === "authenticated"}
                  />
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <h3 className="font-semibold text-green-800 dark:text-green-300 mb-3 flex items-center">
                  <span className="mr-2">📦</span> Pickup Location
                </h3>
                <div className="space-y-4">
                  <SelectFieldDistrict
                    label="District"
                    name="pickupDistrictId"
                    register={register}
                    required
                    districts={districts}
                    defaultValue={userData?.districtId || ""}
                  />
                  <SelectFieldUpazila
                    label="Upazila/Thana"
                    name="pickupUpazila"
                    register={register}
                    required
                    upazilas={pickupDistrictData?.subDistricts || []}
                    disabled={!pickupDistrictData}
                  />
                  <TextAreaField
                    label="Full Address"
                    register={register("pickupAddress", { required: true })}
                    placeholder="House #, Road #, Area details..."
                  />
                  <TextAreaField
                    label="Special Instructions for Pickup"
                    register={register("special")}
                    placeholder="Any specific instructions for the delivery person..."
                  />
                  <div className="">
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
              </div>
            </div>

            {/* Right Column - Dynamic based on active tab */}
            <div className="space-y-4">
              {activeTab === "domestic" ? (
                // Domestic Fields
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                  <h3 className="font-semibold text-purple-800 dark:text-purple-300 mb-3 flex items-center">
                    <span className="mr-2">🏠</span> Domestic Delivery Details
                  </h3>
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
                  </div>
                </div>
              ) : (
                // Overseas Fields
                <>
                  <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                    <h3 className="font-semibold text-orange-800 dark:text-orange-300 mb-3 flex items-center">
                      <span className="mr-2">🌎</span> International Shipment Details
                    </h3>
                    <div className="space-y-4">
                      <SelectField
                        label="Destination Country *"
                        register={register("destinationCountry", { required: true })}
                        options={[
                          { value: "usa", label: "🇺🇸 United States" },
                          { value: "canada", label: "🇨🇦 Canada" },
                          { value: "uk", label: "🇬🇧 United Kingdom" },
                          { value: "australia", label: "🇦🇺 Australia" },
                          { value: "germany", label: "🇩🇪 Germany" },
                          { value: "france", label: "🇫🇷 France" },
                          { value: "japan", label: "🇯🇵 Japan" },
                          { value: "singapore", label: "🇸🇬 Singapore" },
                          { value: "uae", label: "🇦🇪 UAE" },
                          { value: "saudi", label: "🇸🇦 Saudi Arabia" },
                          { value: "other", label: "🌍 Other Country" },
                        ]}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <SelectField
                          label="Service Type *"
                          register={register("serviceType", { required: true })}
                          options={[
                            { value: "express", label: "🚀 Express (3-5 days)" },
                            { value: "standard", label: "📦 Standard (7-10 days)" },
                            { value: "economy", label: "💰 Economy (12-15 days)" },
                          ]}
                        />
                        <SelectField
                          label="Weight (kg) *"
                          register={register("internationalWeight", { required: true })}
                          options={[
                            { value: 0.5, label: "0.5 kg" },
                            { value: 1, label: "1 kg" },
                            { value: 2, label: "2 kg" },
                            { value: 5, label: "5 kg" },
                            { value: 10, label: "10 kg" },
                            { value: 20, label: "20 kg" },
                          ]}
                        />
                      </div>

                      <SelectField
                        label="Parcel Contents *"
                        register={register("internationalParcelType", { required: true })}
                        options={[
                          "Documents",
                          "Electronics",
                          "Clothes",
                          "Fragile Items",
                          "Pharmaceuticals",
                          "Others"
                        ]}
                      />

                      <TextAreaField
                        label="Detailed Contents Description *"
                        register={register("contentsDescription", { required: true })}
                        placeholder="Detailed description of items for customs declaration..."
                      />

                      <InputField
                        label="Customs Declared Value (USD) *"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        register={register("customsValue", {
                          required: true,
                          valueAsNumber: true
                        })}
                      />
                    

                      <div className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg border">
                        <input
                          type="checkbox"
                          {...register("insurance")}
                          value="yes"
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <label className="text-sm font-medium">
                          📦 Add Insurance Coverage (+$20)
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                    <h3 className="font-semibold text-red-800 dark:text-red-300 mb-3 flex items-center">
                      <span className="mr-2">👤</span> International Receiver Details
                    </h3>
                    <div className="space-y-4">
                      <InputField
                        label="Receiver Full Name *"
                        register={register("receiverName", { required: true })}
                        placeholder="As per official ID"
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <InputField
                          label="Phone Number *"
                          type="tel"
                          placeholder="International format"
                          register={register("receiverPhone", { required: true })}
                        />
                        <InputField
                          label="Email Address *"
                          type="email"
                          placeholder="receiver@example.com"
                          register={register("receiverEmail", { required: true })}
                        />
                      </div>

                      <TextAreaField
                        label="Full Street Address *"
                        register={register("receiverAddress", { required: true })}
                        placeholder="House/Apartment number, Street name"
                      />

                      <div className="grid grid-cols-3 gap-4">
                        <InputField
                          label="City *"
                          register={register("receiverCity", { required: true })}
                        />
                        <InputField
                          label="State/Province *"
                          register={register("receiverState", { required: true })}
                        />
                        <InputField
                          label="ZIP/Postal Code *"
                          register={register("receiverZipCode", { required: true })}
                        />
                      </div>
                    </div>
                  </div>
                </>
                
              )}
            </div>

            {/* Cost Display and Submit Button */}
            {cost !== null && cost.amount > 0 && (
              <div className="lg:col-span-2 mt-4">
                <div className={`p-4 rounded-lg border ${cost.currency === "USD"
                    ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
                    : "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                  }`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-lg">
                        Estimated Cost
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {activeTab === "domestic" ? "Domestic shipping" : "International shipping with customs handling"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">
                        {cost.currency === "USD" ? "$" : "৳"}{cost.amount}
                        <span className="text-sm font-normal ml-1">{cost.currency}</span>
                      </p>
                      {cost.currency === "USD" && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          ≈ ৳{Math.round(cost.amount * 110)} BDT
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Submit */}
            <div className="lg:col-span-2 mt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full mt-4 rounded-lg border border-[var(--border-color)]
                 dark:border-[var(--border-color-two)]
                 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)]
                 text-white font-medium py-3 transition-colors text-lg
                 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? (
                  "⏳ Processing..."
                ) : activeTab === "domestic" ? (
                  "📦 Submit Domestic Parcel"
                ) : (
                  "🌍 Submit International Shipment"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

// Helper Components
const InputField = ({ label, register, type = "text", defaultValue, readOnly, placeholder = "" }) => (
  <div>
    <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">{label}</label>
    <input
      {...register}
      type={type}
      defaultValue={defaultValue}
      placeholder={placeholder}
      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                 bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                 transition-colors duration-200"
      readOnly={readOnly}
    />
  </div>
);

const SelectField = ({ label, register, options = [], disabled = false }) => (
  <div>
    <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">{label}</label>
    <select
      {...register}
      disabled={disabled}
      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                 bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                 transition-colors duration-200"
    >
      <option value="">Select {label}</option>
      {options.map((opt) =>
        typeof opt === "object" ? (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ) : (
          <option key={opt} value={opt}>
            {opt}
          </option>
        )
      )}
    </select>
  </div>
);

const TextAreaField = ({ label, register, placeholder = "" }) => (
  <div>
    <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">{label}</label>
    <textarea
      {...register}
      placeholder={placeholder}
      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                 bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                 transition-colors duration-200 resize-none"
      rows={3}
    />
  </div>
);

// Updated FileInputField Component
const FileInputField = ({ 
  label, 
  fileInputRef, 
  uploading, 
  preview = [], 
  handleFileChange, 
  handleRemovePreview 
}) => (
  <div className="flex flex-col gap-3">
    <label className="block font-medium text-gray-700 dark:text-gray-300">
      {label}
    </label>

    {/* Drag & Drop Area */}
    <div
      onClick={() => !uploading && fileInputRef.current?.click()}
      className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 cursor-pointer transition-all duration-200 ${
        uploading 
          ? 'border-gray-300 bg-gray-100 dark:border-gray-600 dark:bg-gray-700 cursor-not-allowed' 
          : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 bg-white dark:bg-gray-800'
      }`}
    >
      {uploading ? (
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
            Uploading images...
          </p>
        </div>
      ) : (
        <>
          <FiUploadCloud className="text-3xl text-blue-500 mb-3" />
          <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-2">
            <span className="text-blue-600 dark:text-blue-400 font-medium">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            PNG, JPG, JPEG up to 10MB each
          </p>
        </>
      )}
    </div>

    {/* Hidden Input */}
    <input
      type="file"
      accept="image/*"
      multiple
      ref={fileInputRef}
      onChange={handleFileChange}
      className="hidden"
      disabled={uploading}
    />

    {/* Preview Images */}
    {preview.length > 0 && (
      <div className="mt-4">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Selected Images ({preview.length})
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {preview.map((src, index) => (
            <div 
              key={index} 
              className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
            >
              <img 
                src={src} 
                alt={`Preview ${index + 1}`} 
                className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105" 
              />
              
              {/* Remove Button */}
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemovePreview(index);
                }}
                disabled={uploading}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiTrash2 size={14} />
              </button>
              
              {/* Image Number Badge */}
              <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Upload Status */}
    {uploading && (
      <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm mt-2">
        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        Processing images... Please wait
      </div>
    )}
  </div>
);

export default SendParcel;