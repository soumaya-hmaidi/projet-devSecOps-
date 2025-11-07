import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from '@/components/providers/Providers';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "QuizKids - Fun Learning Platform for Children",
  description: "Make learning an adventure! Create engaging quizzes, challenge friends, and discover new knowledge in the most fun way possible.",
  keywords: ["quiz", "learning", "children", "education", "games", "kids"],
  authors: [{ name: "QuizKids Team" }],
  openGraph: {
    title: "QuizKids - Fun Learning Platform for Children",
    description: "Make learning an adventure! Create engaging quizzes, challenge friends, and discover new knowledge in the most fun way possible.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "QuizKids - Fun Learning Platform for Children",
    description: "Make learning an adventure! Create engaging quizzes, challenge friends, and discover new knowledge in the most fun way possible.",
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
