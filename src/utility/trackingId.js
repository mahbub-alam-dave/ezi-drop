// utils/lib/tracking.js

export function generateTrackingNumber() {
  // Generate a random alphanumeric string (8–10 chars)
  const randomPart = Math.random().toString(36).substring(2, 10).toUpperCase();

  // Optional: Add a timestamp to improve uniqueness
  const timestampPart = Date.now().toString().slice(-5);

  // Combine into final format
  return `@ezi_drop-${randomPart}${timestampPart}`;
}
