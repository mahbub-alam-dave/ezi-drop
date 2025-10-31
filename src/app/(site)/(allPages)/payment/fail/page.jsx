"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Suspense } from "react";

function FailContent() {
  const searchParams = useSearchParams();
  const gateway = searchParams.get("gateway");
  const session_id = searchParams.get("session_id");

  useEffect(() => {
    const saveFailedPayment = async () => {
      if (gateway === "stripe") {
        await fetch("/api/payment/stripe-save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id }),
        });
      } else if (gateway === "sslcommerz") {
        await fetch("/api/payment/sslcommerz-save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(Object.fromEntries(new URLSearchParams(window.location.search))),
        });
      }
    };
    saveFailedPayment();
  }, [gateway, session_id]);

  return (
    <div className="flex flex-col justify-center items-center h-screen text-center bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] px-6">
      <h1 className="text-3xl font-bold text-[var(--color-danger)]">
        Payment Failed ❌
      </h1>
      <p className="mt-4 text-lg text-[var(--color-text)] dark:text-[var(--color-text-dark)]">
        Something went wrong with your payment.
      </p>
    </div>
  );
}

export default function FailPage() {
  return (
    <Suspense fallback={<div>loading...</div>}>
      <FailContent />
    </Suspense>
  );
}
