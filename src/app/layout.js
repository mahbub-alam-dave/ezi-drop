import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
// import Navbar from "@/components/sharedComponents/navbar/Navbar";
// import Footer from "@/components/sharedComponents/footer/Footer";
import NextAuthProvider from "@/providers/NextAuthProvider";
import ChatBoxUi from "@/components/customerServicesComponents/ChatBoxUi";
import { Suspense } from "react";
import SiteSkeleton from "@/components/loaders/skeletons/SiteSkeleton";
import { Toaster } from "react-hot-toast"; // ✅ Import Toast

const poppins = Poppins({
  weight: "400",
});

export const metadata = {
  title: "Ezi Drop",
  description: "Smart Courier and Delivery application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
        <Suspense fallback={<SiteSkeleton />}>
          <NextAuthProvider>
            {children}

            {/* ✅ Global Toast Notifications */}
            <Toaster
              position="top-right"
              reverseOrder={false}
              toastOptions={{
                duration: 4000,
                style: {
                  borderRadius: "8px",
                  padding: "12px 16px",
                  fontWeight: "500",
                  fontSize: "14px",
                  background: "var(--color-bg)", // Matches your site theme
                  color: "var(--color-text)",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
                },
              }}
            />

            <ChatBoxUi />
          </NextAuthProvider>
        </Suspense>
      </body>
    </html>
  );
}
