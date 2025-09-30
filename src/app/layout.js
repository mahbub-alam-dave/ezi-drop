import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
// import Navbar from "@/components/sharedComponents/navbar/Navbar";
// import Footer from "@/components/sharedComponents/footer/Footer";
import NextAuthProvider from "@/providers/NextAuthProvider";
import ChatBoxUi from "@/components/customerServicesComponents/ChatBoxUi";




const poppins = Poppins({
  // variable: "--font-geist-sans",
  weight: "400",
  // subsets: [latin],
});

/* const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
}); */

export const metadata = {
  title: "Ezi Drop",
  description: "Smart Courier and Delivery application",
};

export default function RootLayout({ children }) {

  return (
    <html lang="en" >
      <body
        className={`${poppins.className} antialiased`}
      >
        <NextAuthProvider>
        {children}
        <ChatBoxUi />
        </NextAuthProvider>
      </body>
    </html>
  );
}
