import Navbar from "@/components/custom/Navbar";
import Providers from "@/lib/providers/Providers";
import icon from "@/public/logo.png";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase:
    process.env.NODE_ENV === "production"
      ? new URL("https://easydivmy.danishnasarudin.com")
      : new URL("http://localhost:3000"),
  title: "EasyDivMy - Malaysia's Stock Dividend Tracker",
  description:
    "Your go-to platform for tracking and analyzing Malaysia's stock dividend percentages across multiple years. Stay informed, compare trends, and make smarter investment decisions with ease.",
  icons: {
    icon: "/icon.png",
  },
  appleWebApp: true,
  openGraph: {
    title: "EasyDivMy - Malaysia's Stock Dividend Tracker",
    description:
      "Your go-to platform for tracking and analyzing Malaysia's stock dividend percentages across multiple years.",
    images: [
      {
        url: icon.src,
        width: icon.width,
        height: icon.height,
        alt: "EasyDivMy Logo",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen flex flex-col`}
      >
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <section className="h-[30%] flex-none"></section>
          <footer className="min-h-min w-full flex justify-center py-1 bg-background border-t-border border-t-[1px] text-xs text-secondary-foreground/60">
            © 2025 EasyDivMy, Corp.
          </footer>
        </Providers>
      </body>
    </html>
  );
}
