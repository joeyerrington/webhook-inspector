"use client"

import { useRouter } from "next/navigation"

export default function CreateWebhookButton() {
  const router = useRouter()

  function createWebhook() {
    const webhookId = crypto.randomUUID()

    router.push(`/inspect/${webhookId}`)
  }

  return (
    <button
      type="button"
      onClick={createWebhook}
      className="mt-8 rounded-lg bg-black px-5 py-3 font-medium text-white hover:bg-gray-800"
    >
      Create Webhook
    </button>
  )
}