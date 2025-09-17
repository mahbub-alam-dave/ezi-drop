'use client'
import React from "react";

export default function Faq() {
  const [openIndex, setOpenIndex] = React.useState(null);

  const faqs = [
    {
      question: "How can I book a courier?",
      answer:
        "You can book a courier by filling out the Send Parcel form on our website. Just provide sender details, receiver details, parcel type, and choose your preferred service center.",
    },
    {
      question: "How do I track my parcel?",
      answer:
        "After booking, you’ll receive a unique Tracking ID. You can enter this ID in the Track Parcel section to see real-time delivery updates.",
    },
    {
      question: "What types of delivery services do you provide?",
      answer:
        "We offer same-day, next-day, and inter-district delivery services. International shipping is also available in selected regions.",
    },
    {
      question: "How is the delivery cost calculated?",
      answer:
        "Delivery cost depends on parcel type, weight, service region, and delivery speed. Our system will automatically calculate the exact cost before you confirm the booking.",
    },
    {
      question: "Is my parcel safe during delivery?",
      answer:
        "Yes! We ensure secure handling with verified riders, real-time tracking, and optional insurance for high-value parcels.",
    },
  ];

  return (
    <>
      <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');
          * { font-family: 'Poppins', sans-serif; }
      `}</style>
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start justify-center gap-8 px-4 md:px-0 py-12">
        {/* Image Side */}
        <img
          className="max-w-sm w-full rounded-xl h-[420px] shadow-md"
          src="https://plus.unsplash.com/premium_photo-1678000616480-d4a041e6eba1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8RmFxfGVufDB8fDB8fHww"
          alt="Courier service FAQ"
        />

        {/* FAQ Content */}
        <div>
          <p className="text-indigo-600 text-sm font-medium">FAQ's</p>
          <h1 className="text-3xl font-semibold">Have Questions?</h1>
          <p className="text-sm text-slate-500 mt-2 pb-4">
            Here are the most common questions about our courier & delivery
            service. We’re here to make your delivery experience smooth and
            reliable.
          </p>

          {faqs.map((faq, index) => (
            <div
              className="border-b border-slate-200 py-4 cursor-pointer"
              key={index}
              onClick={() =>
                setOpenIndex(openIndex === index ? null : index)
              }
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-medium">{faq.question}</h3>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={`${
                    openIndex === index ? "rotate-180" : ""
                  } transition-all duration-500 ease-in-out`}
                >
                  <path
                    d="m4.5 7.2 3.793 3.793a1 1 0 0 0 1.414 0L13.5 7.2"
                    stroke="#1D293D"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p
                className={`text-sm text-slate-500 transition-all duration-500 ease-in-out max-w-md ${
                  openIndex === index
                    ? "opacity-100 max-h-[300px] translate-y-0 pt-4"
                    : "opacity-0 max-h-0 -translate-y-2"
                }`}
              >
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
