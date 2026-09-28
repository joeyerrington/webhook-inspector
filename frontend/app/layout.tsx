import type { Metadata } from "next"
import { GoogleAnalytics } from "@next/third-parties/google"
import "./globals.css"

const gaId = process.env.NEXT_PUBLIC_GA_ID

export const metadata: Metadata = {
  metadataBase: new URL("https://webhooked.net"),

  title: {
    default: "Webhooked | Free Brower-based Webhook Inspector",
    template: "%s | Webhooked",
  },

  description:
    "Create a temporary webhook endpoint, capture HTTP requests, and inspect payloads, headers, and query parameters.",

  applicationName: "Webhooked",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    url: "https://webhooked.net",
    siteName: "Webhooked",
    title: "Webhooked | Free Webhook Inspector",
    description:
      "Create a temporary webhook endpoint and inspect incoming webhook requests.",
  },

  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>

      {gaId && <GoogleAnalytics gaId={gaId} />}
    </html>
  )
}