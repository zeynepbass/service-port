import { Geist } from "next/font/google";
import { Toaster } from "@/shared/providers/Toaster";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin", "latin-ext"] });

export const metadata = {
  title: { default: "Hizmet Kap", template: "%s | Hizmet Kap" },
  description: "İhtiyacın olan hizmet için adım adım talep oluştur, hizmet verenlerle mesajlaş.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body className={`${geistSans.variable} antialiased`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:bg-white focus:p-2"
        >
          İçeriğe geç
        </a>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
