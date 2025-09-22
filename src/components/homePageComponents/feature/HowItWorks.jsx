import React from "react";
import { CheckCircle, Package, Truck, Warehouse, CreditCard } from "lucide-react";

const steps = [
  {
    icon: <Package className="w-10 h-10 text-[var(--color-primary)] hover:text-[var(--color-text-dark)] dark:text-[var(--color-primary-dark)]" />,
    title: "Customer places order",
    desc: "Inspection and quality check of goods",
  },
  {
    icon: <CreditCard className="w-10 h-10 text-[var(--color-primary)] hover:text-[var(--color-text-dark)] dark:text-[var(--color-primary-dark)]" />,
    title: "Payment successful",
    desc: "Pay with Stripe, Paypal or Visa",
  },
  {
    icon: <Warehouse className="w-10 h-10 text-[var(--color-primary)] hover:text-[var(--color-text-dark)] dark:text-[var(--color-primary-dark)]" />,
    title: "Warehouse receives order",
    desc: "Check the accuracy of the goods",
  },
  {
    icon: <Truck className="w-10 h-10 text-[var(--color-primary)] hover:text-[var(--color-text-dark)] dark:text-[var(--color-primary-dark)]" />,
    title: "Item picked, packed & shipped",
    desc: "Ship the goods to a local carrier",
  },
  {
    icon: <CheckCircle className="w-10 h-10 text-[var(--color-primary)] hover:text-[var(--color-text-dark)] dark:text-[var(--color-primary-dark)]" />,
    title: "Delivered & Measure success",
    desc: "Update order status on the system",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16 md:py-24 
      bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] 
      text-[var(--color-text)] dark:text-[var(--color-text-dark)] px-6 md:px-8">
        <div className="max-w-[1440px] mx-auto">
   
      <div className=" text-center mb-12 ">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-5">How We Works</h2>
        <p className="text-[var(--color-text-soft)] dark:text-[var(--color-text-soft-dark)] max-w-5xl mx-auto text-center">
          That cares about customers and keen to meet their needs with very enhanced means that meet their expectations guaranteeing the highest satisfaction standard through its unique service
        </p>
        <div className="mt-3 sm:mt-4 w-14 sm:w-20 md:w-28 h-1 bg-[var(--color-primary)] dark:bg-[var(--color-primary-dark)] mx-auto rounded-full"></div>
      </div>

      <div className="grid md:grid-cols-2 gap-10 items-center">
       
        <div className="relative h-[450px]">
          <img
            src="https://i.ibb.co.com/WvQ38NJf/how-it-work.png"
            alt="containers"
            className="rounded-xl shadow-md w-full object-cover h-full"
          />
          <div className="absolute -bottom-8 right-10 bg-[#286baa] text-white p-6 rounded-lg max-w-sm mx-auto">
            <h3 className="font-bold text-lg mb-2">
              We have 25 years experience in this passion
            </h3>
            <p className="text-sm text-gray-100">
              There are many variations of passages of Lorem Ipsum available,
              but the majority have suffered alteration.
            </p>
            
          </div>
        </div>

        {/* Right Steps */}
        <div className="space-y-4 relative">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="flex-shrink-0 rounded-full flex items-center justify-center hover:bg-[var(--color-primary)] dark:hover:bg-[var(--color-primary-dark)] p-4">
                {step.icon}
              </div>
              <div>
                <h4 className="font-semibold text-xl">{step.title}</h4>
                <p className="text-[var(--color-text-soft)] dark:text-[var(--color-text-soft-dark)] text-sm">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
          {/* Connector line */}
          <div className="absolute top-5 left-6 w-0.5 bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] h-[90%] -z-10"></div>
        </div>
      </div>
      </div>
    </section>
  );
}
