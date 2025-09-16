import HowItWorks from "@/components/feature/HowItWorks";
import BannerSection from "@/components/homePageComponents/BannerSection";
import Overview from "@/components/homePageComponents/newsletter/Overview";
import BannerSection from "@/components/homePageComponents/BannerSection";
import Overview from "@/components/homePageComponents/newsletter/Overview";
import Review from "@/components/homePageComponents/reviewSection/Review";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen">
      <h1>Ezi Drop Home Page</h1>
      <div>
      <h1>Hello , My name is Abdul Halim. Welcome our project!</h1>
      </div>
      <main>
        <BannerSection/>
        <Overview />
        <HowItWorks />
      </main>
    </div>
  );
}
