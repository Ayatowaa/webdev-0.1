import type { Metadata } from "next";
import "./globals.css";
import { siteUrl } from "@/lib/site";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Allefy Resende — Full Stack Developer",
    template: "%s | Allefy Resende",
  },
  description:
    "Full Stack Developer based in Brazil. Explore personal projects in business websites, web applications and e-commerce. Available for freelance collaborations.",
  icons: { icon: "/favicon.svg" },
  robots: { index: true, follow: true },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
