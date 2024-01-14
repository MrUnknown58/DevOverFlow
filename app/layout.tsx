import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import type { Metadata } from "next";
// eslint-disable-next-line camelcase
import { Inter, Space_Grotesk } from "next/font/google";
import React from "react";
import { ThemeProvider } from "@/context/ThemeProvider";
import NextTopLoader from "nextjs-toploader";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  variable: "--font-inter",
});
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "DevOverFlow",
  description:
    "An open source Q&A platform for developers by developers. Ask questions, get answers, and share your knowledge with the community. Built with Next.js, TypeScript, and Tailwind CSS. Hosted on Vercel. Here you can ask any question related to programming and get answers from the community. You can also answer questions asked by others. You can also upvote or downvote questions and answers. You can also comment on questions and answers. You can also follow other users. You can also bookmark questions. You can also report questions and answers. You can also edit your profile. You can also edit your questions and answers. You can also delete your questions and answers. You can also delete your account. You can also search for questions. You can also filter questions by tags. You can also filter questions by users. You can also filter questions by votes. You can also filter questions by date. You can also filter questions by unanswered.z",
  icons: {
    icon: "/assets/images/site-icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable}`}>
        <NextTopLoader />
        <ClerkProvider
          appearance={{
            elements: {
              formButtonPrimary: "primary-gradient",
              footerActionLink: "primary-text-gradient hover:text-primary-500",
            },
          }}
        >
          <ThemeProvider>{children}</ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
