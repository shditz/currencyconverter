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

export const metadata = {
  title: "GlobaRate.co - Real-Time Currency Converter",
  description:
    "Real-time currency conversion with the latest and most accurate exchange rates.",
  keywords:
    "currency converter, konverter mata uang, kurs hari ini, valuta asing, forex, konversi",
  authors: [{ name: "Aditya Kurniawan" }],
  viewport: "width=device-width, initial-scale=1",
  openGraph: {
    title: "GlobaRate.co - Real-Time Currency Converter",
    description:
      "Real-time currency conversion with the latest and most accurate exchange rates",
    url: "https://globarate.vercel.app",
    siteName: "GlobaRate.co",
    images: [
      {
        url: "/public/globarate.co.png",
        width: 800,
        height: 600,
        alt: "GlobaRate.co - Currency Converter",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
