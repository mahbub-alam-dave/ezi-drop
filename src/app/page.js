import BannerSection from "@/components/homePageComponents/BannerSection";
import Overview from "@/components/homePageComponents/newsletter/Overview";
import Review from "@/components/homePageComponents/reviewSection/Review";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen">
      <BannerSection/>
      <Overview />
      <Review/>
    </div>
  );
}
