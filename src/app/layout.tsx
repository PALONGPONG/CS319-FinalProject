import type { Metadata } from "next";
import localFont from "next/font/local";
import { Mitr } from "next/font/google"; // Import ฟอนต์จาก Google Fonts
import "./globals.css";
import Sidebar from "./componant/sidebar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// เพิ่มการนำเข้า Mitr จาก Google Fonts
const mitr = Mitr({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ERP_Module",
  description: "Final Project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${mitr.className} antialiased`}
      >
        {/* Add the Header component */}
        <div className="flex">
          <div className="">

          <Sidebar />
          </div>
        <main className="pt-20" >{children}</main>
        </div>
      </body>
    </html>
  );
}
