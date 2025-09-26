"use client";
import { useSearchParams } from "next/navigation";

export default function CancelPage() {
  const searchParams = useSearchParams();
  const tranId = searchParams.get("tran_id");
  const status = searchParams.get("status");

  return (
    <div className="flex flex-col justify-center items-center h-screen text-center bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] px-6">
      <h1 className="text-3xl font-bold text-[var(--color-warning)]">
        Payment Cancelled 
      </h1>
      <p className="mt-4 text-lg text-[var(--color-text)] dark:text-[var(--color-text-dark)]">
        You have cancelled the payment process.
      </p>

      {tranId && (
        <p className="mt-2 text-[var(--color-text-muted)]">
          Transaction ID: <span className="font-semibold">{tranId}</span>
        </p>
      )}

      {status && (
        <p className="mt-1 text-[var(--color-text-muted)]">
          Status: <span className="uppercase">{status}</span>
        </p>
      )}
    </div>
  );
}
