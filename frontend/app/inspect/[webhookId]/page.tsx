import Link from "next/link"
import WebhookInspector, {
  type WebhookEvent,
} from "../../../components/WebhookInspector"

type WebhookResponse = {
  webhookId: string
  events: WebhookEvent[]
}

type PageProps = {
  params: Promise<{
    webhookId: string
  }>
}

async function getWebhooks(
  webhookId: string
): Promise<WebhookEvent[]> {
  const apiUrl = process.env.WEBHOOK_API_URL
  const apiSecret = process.env.INSPECTOR_API_SECRET

  if (!apiUrl) {
    throw new Error("WEBHOOK_API_URL is not configured")
  }

  if (!apiSecret) {
    throw new Error(
      "INSPECTOR_API_SECRET is not configured"
    )
  }

  const response = await fetch(
    `${apiUrl}/webhooks/${webhookId}`,
    {
      cache: "no-store",
      headers: {
        "X-Inspector-Secret": apiSecret,
      },
    }
  )

  if (!response.ok) {
    throw new Error(
      `Failed to retrieve webhooks: ${response.status}`
    )
  }

  const data: WebhookResponse = await response.json()

  return data.events
}

export default async function InspectorPage({
  params,
}: PageProps) {
  const { webhookId } = await params
  const events = await getWebhooks(webhookId)

  const webhookUrl =
    `${process.env.WEBHOOK_API_URL}/webhooks/${webhookId}`

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <Link
  href="/"
  className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-gray-900"
>
  <span aria-hidden="true">←</span>
  Back
</Link>
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Webhooked
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Inspect requests sent to your temporary webhook endpoint.
          </p>
        </div>

        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-gray-900">
            Webhook URL
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Send HTTP requests to this endpoint to inspect them below.
          </p>

          <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
            <code className="break-all text-sm text-gray-800">
              {webhookUrl}
            </code>
          </div>
        </section>

        <WebhookInspector events={events} />
      </div>
    </main>
  )
}