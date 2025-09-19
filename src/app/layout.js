import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/sharedComponents/navbar/Navbar";
import Footer from "@/components/sharedComponents/footer/Footer";
// import NextAuthProvider from "@/providers/NextAuthProvider";




const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Ezi Drop",
  description: "Smart Courier and Delivery application",
};

export default function RootLayout({ children }) {

  return (
    <html lang="en" >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* <NextAuthProvider> */}
        <div className="bg-gray-50 dark:bg-black text-[var(--color-text)] dark:text-[var(--color-text-dark)]">
        <Navbar/>
        {children}
        <Footer/>
        </div>
        {/* </NextAuthProvider> */}
      </body>
    </html>
  );
}
