import type { Metadata } from "next"
import CreateWebhookButton from "../components/CreateWebhookButton"

export const metadata: Metadata = {
  title: "Webhooked | Free Webhook Inspector",
  description:
    "Create a temporary webhook endpoint, capture HTTP requests, and inspect payloads, headers, and query parameters in real time.",
  alternates: {
    canonical: "https://webhooked.net",
  },
  openGraph: {
    title: "Webhooked | Free Webhook Inspector",
    description:
      "Create a temporary webhook endpoint and inspect incoming webhook requests in real time.",
    url: "https://webhooked.net",
    siteName: "Webhooked",
    type: "website",
  },
}

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
        <div className="mx-auto max-w-5xl px-6 py-24 sm:py-32">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-blue-600">
              Free, lightweight webhook tester
            </p>

            <h1 className="text-5xl font-bold tracking-tight text-gray-950 sm:text-6xl">
              Webhooked
            </h1>

            <p className="mt-6 max-w-2xl text-xl leading-8 text-gray-600">
              Create a temporary webhook endpoint and see exactly what gets
              sent to it. Inspect request bodies, headers, query parameters,
              and HTTP methods without building a receiving application first.
            </p>

            <div className="mt-8">
              <CreateWebhookButton />
            </div>

            <p className="mt-4 text-sm text-gray-500">
              No setup required or login required. Webhook events automatically expire after
              24 hours.
            </p>
          </div>
        </div>   
    </main>
  )
}