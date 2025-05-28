import type {Metadata} from "next";
import {Geist} from "next/font/google";
import {ToastContainer} from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import "./globals.css";

import {cn} from "@/lib/utils";
import {FirebaseProvider} from "@/firebase/auth-context";
import Navbar from "@/components/navbar";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: "Reddit Clone",
  description: "A Reddit clone built with Next.js and Firebase",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          geist.variable
        )}
      >
        <FirebaseProvider>
          <Navbar />
          <main>{children}</main>
          <ToastContainer />
        </FirebaseProvider>
      </body>
    </html>
  );
}
