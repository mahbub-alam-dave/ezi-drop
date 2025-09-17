import AboutFeatures from "@/components/AboutSection/AboutFeatures";
import AboutSection from "@/components/AboutSection/AboutSection";


export default function AboutsPage() {
    return (
        <main >
            <div className="space-y-4 p-6">
                <h1 className="text-3xl text-[#51aca4] dark:text-[#25524e] font-bold text-center">About Us</h1>
                <p className="text-center font-semibold">
                    A crucial part of every business is cash flow. If a business doesn’t have proper cash flow, then the chances of it working out are slim to none. The whole concept of cash flow might seem incredibly mind-boggling. If you are someone who’s starting a new business or if you are someone who has a business but doesn’t exactly know what cash flow is then this blog is  definitely for you. This blog will give you a complete idea regarding cash flow, the types of cash flow there are and how it affects a business. So, for a complete guide about cash flow, keep on reading!
                </p>
            </div>

            <AboutSection />
            <AboutFeatures />
        </main>
    );
}
