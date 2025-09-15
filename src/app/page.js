import BannerSection from "@/components/homePageComponents/BannerSection";
import Overview from "@/components/homePageComponents/newsletter/Overview";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen">
      <BannerSection/>
      <Overview />
    </div>
  );
}
