import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"

export const metadata: Metadata = {
  title: "Ping - Product Authentication & Recycling",
  description: "Authenticate products and earn rewards for recycling on the Internet Computer",
  keywords: ["blockchain", "recycling", "sustainability", "rewards", "authentication"],
  authors: [{ name: "Ping Team" }],
  creator: "Ping",
  publisher: "Ping",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    title: "Ping - Product Authentication & Recycling",
    description: "Authenticate products and earn rewards for recycling on the Internet Computer",
    url: "/",
    siteName: "Ping",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ping - Product Authentication & Recycling",
    description: "Authenticate products and earn rewards for recycling on the Internet Computer",
    creator: "@ping_app",
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
  verification: {
    google: "google-site-verification-code",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <style>{`
          html {
            font-family: ${GeistSans.style.fontFamily};
            --font-sans: ${GeistSans.variable};
            --font-mono: ${GeistMono.variable};
          }
        `}</style>
      </head>
      <body className={`${GeistSans.className} antialiased`}>
        <div id="root">{children}</div>
      </body>
    </html>
  )
}
