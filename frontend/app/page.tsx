import CreateWebhookButton from "../components/CreateWebhookButton"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Webhook Inspector
        </h1>

        <p className="mt-3 text-gray-600">
          Create a temporary endpoint and inspect incoming webhook requests.
        </p>

        <CreateWebhookButton />
      </div>
    </main>
  )
}