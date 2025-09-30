"use client";

import { Suspense } from "react";

function CancelContent() {
  return (
    <div className="flex flex-col justify-center items-center h-screen text-center bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] px-6">
      <h1 className="text-3xl font-bold text-[var(--color-warning)]">
        Payment Cancelled
      </h1>
      <p className="mt-4 text-lg text-[var(--color-text)] dark:text-[var(--color-text-dark)]">
        You have cancelled the payment process.
      </p>
    </div>
  );
}

export default function CancelPage() {
  return (
    <Suspense fallback={<div>loading...</div>}>
      <CancelContent />
    </Suspense>
  );
}
