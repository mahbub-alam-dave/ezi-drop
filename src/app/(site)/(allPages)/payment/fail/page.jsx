"use client";

import { Suspense } from "react";

function FailContent() {
  return (
    <div className="flex flex-col justify-center items-center h-screen text-center bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] px-6">
      <h1 className="text-3xl font-bold text-[var(--color-danger)]">
        Payment Failed
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
