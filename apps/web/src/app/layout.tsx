import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: {
    default: "ResearchHub - Publish and Showcase Student Research",
    template: "%s | ResearchHub"
  },
  description: "The easiest way for students to publish and showcase research, projects, and technical articles.",
  openGraph: {
    title: "ResearchHub",
    description: "Free student research publishing, public profiles, permanent links, and discovery.",
    type: "website"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
