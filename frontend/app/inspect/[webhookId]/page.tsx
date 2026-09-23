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

  if (!apiUrl) {
    throw new Error("WEBHOOK_API_URL is not configured")
  }

  const response = await fetch(
    `${apiUrl}/webhooks/${webhookId}`,
    {
      cache: "no-store",
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
    <main className="mx-auto max-w-6xl p-8">
      <h1 className="text-3xl font-bold">
        Webhook Inspector
      </h1>

      <p className="mt-2 text-gray-500">
        Inspect incoming webhook requests.
      </p>

      <div className="mt-8 rounded-lg border border-gray-300 p-4">
        <p className="text-sm font-semibold">
          Your webhook URL
        </p>

        <code className="mt-2 block break-all rounded bg-gray-100 p-3 text-sm text-gray-900">
          {webhookUrl}
        </code>
      </div>

      <WebhookInspector events={events} />
    </main>
  )
}