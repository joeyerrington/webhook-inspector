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
      className="mt-8 rounded-lg bg-green-700 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-green-800"
    >
      Create webhook
    </button>
  )
}