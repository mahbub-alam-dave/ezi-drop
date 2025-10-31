import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const FirstBookingBanner = ({ userEmail }) => {
  const [eligible, setEligible] = useState(false);
  const [loading, setLoading] = useState(true);

  const {data: session} = useSession();


  useEffect(() => {
    const checkFirstBooking = async () => {
      try {
        const res = await fetch(`/api/user-booking-check?email=${userEmail}`);
        if (!res.ok) {
        const text = await res.text();
        console.error("API error:", res.status, text);
        return; // or handle gracefully
      }
        const data = await res.json();
        if (data.success && data.eligible) {
          setEligible(true);
        }
      } catch (error) {
        console.error("Error checking first booking:", error);
      } finally {
        setLoading(false);
      }
    };
    checkFirstBooking();
  }, [userEmail]);

  if (loading) return null;
  if (!eligible) return null;

  return (
    <div className="relative p-8 text-xl text-center mt-8 shadow-md">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-10"></div>
      <p className="z-10"> 🎉 You’re eligible for <strong>100% free delivery</strong> on your first booking <span className="text-[var(--color-primary)]">(Only domestic)</span>!
</p>
    </div>
  );
};

export default FirstBookingBanner;
