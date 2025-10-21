import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const FirstBookingBanner = ({ userEmail }) => {
  const [eligible, setEligible] = useState(false);
  const [loading, setLoading] = useState(true);

  const {data: session} = useSession();
  console.log(session?.user)

  console.log(userEmail)

  useEffect(() => {
    const checkFirstBooking = async () => {
      try {
        const res = await fetch(`/api/user-booking-check?email=${userEmail}`);
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
    <div className="background-color-primary text-gray-100 p-8 text-xl text-center mt-8 shadow-md">
      🎉 You’re eligible for <strong>100% free delivery</strong> on your first booking <span className="">(Only domestic)</span>!
    </div>
  );
};

export default FirstBookingBanner;
