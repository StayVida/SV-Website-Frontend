import type { Metadata } from "next";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "sonner";
import "./globals.css";
import LayoutWrapper from "./LayoutWrapper";
import Footer from "@/layouts/Footer";
import QueryProvider from "@/providers/QueryProvider";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.stayvida.in"),

  title: {
    default: "StayVida | Hotels, Resorts & Villas in Mahabaleshwar",
    template: "%s | StayVida",
  },

  description:
    "Book hotels, resorts and villas in Mahabaleshwar with StayVida. Discover comfortable stays for family holidays, couples, groups and weekend getaways.",

  keywords: [
    "hotels in Mahabaleshwar",
    "resorts in Mahabaleshwar",
    "villas in Mahabaleshwar",
    "Mahabaleshwar hotels",
    "Mahabaleshwar resorts",
    "places to stay in Mahabaleshwar",
  ],

  alternates: {
    canonical: "https://www.stayvida.in",
  },

  openGraph: {
    title: "StayVida | Hotels, Resorts & Villas in Mahabaleshwar",
    description:
      "Discover and book hotels, resorts and villas in Mahabaleshwar with StayVida.",
    url: "https://www.stayvida.in",
    siteName: "StayVida",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "StayVida - Hotels, Resorts and Villas in Mahabaleshwar",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "StayVida | Hotels, Resorts & Villas in Mahabaleshwar",
    description:
      "Book hotels, resorts and villas in Mahabaleshwar with StayVida.",
    images: ["/og-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "StayVida",
    url: "https://www.stayvida.in",
    logo: "https://www.stayvida.in/og-image.jpg",
    sameAs: [
      "https://www.facebook.com/stayvida",
      "https://www.instagram.com/stayvida",
      "https://twitter.com/stayvida"
    ]
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "StayVida",
    url: "https://www.stayvida.in",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.stayvida.in/hotels?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body suppressHydrationWarning>
        <QueryProvider>
          <AuthProvider>
            <div className="min-h-screen flex flex-col">
              <LayoutWrapper>{children}</LayoutWrapper>
              <Footer />
            </div>
            <Toaster position="top-center" richColors />
          </AuthProvider>
        </QueryProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
