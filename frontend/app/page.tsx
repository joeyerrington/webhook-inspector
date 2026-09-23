import CreateWebhookButton from "../components/CreateWebhookButton"

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-4xl font-bold">
        Webhook Inspector
      </h1>

      <p className="mt-4 text-lg text-gray-500">
        Create a temporary endpoint and inspect incoming webhook requests.
      </p>

      <CreateWebhookButton />
    </main>
  )
}