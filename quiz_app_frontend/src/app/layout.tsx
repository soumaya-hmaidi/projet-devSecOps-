import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from '@/components/providers/Providers';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "CCNA Quiz - Cisco Networking Practice Platform | ESPRIT",
  description: "Prepare for your Cisco CCNA certification with interactive quizzes covering networking fundamentals, routing, switching, security, and more.",
  keywords: ["CCNA", "Cisco", "networking", "quiz", "certification", "ESPRIT", "routing", "switching"],
  authors: [{ name: "ESPRIT University" }],
  openGraph: {
    title: "CCNA Quiz - Cisco Networking Practice Platform | ESPRIT",
    description: "Prepare for your Cisco CCNA certification with interactive quizzes covering networking fundamentals, routing, switching, security, and more.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "CCNA Quiz - Cisco Networking Practice Platform | ESPRIT",
    description: "Prepare for your Cisco CCNA certification with interactive quizzes covering networking fundamentals, routing, switching, security, and more.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
