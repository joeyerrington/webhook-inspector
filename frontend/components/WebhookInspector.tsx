"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState, useTransition } from "react"

export type WebhookEvent = {
  webhookId: string
  eventId: string
  method?: string
  path?: string
  body?: string | null
  receivedAt?: string
  headers?: Record<string, string>
  queryParameters?: Record<string, string>
  isBase64Encoded?: boolean
}

type WebhookInspectorProps = {
  events: WebhookEvent[]
}

type DetailTab = "body" | "headers" | "query"

function formatBody(body?: string | null) {
  if (!body) {
    return "No request body"
  }

  try {
    return JSON.stringify(JSON.parse(body), null, 2)
  } catch {
    return body
  }
}

function formatObject(value?: Record<string, string>) {
  if (!value || Object.keys(value).length === 0) {
    return "None"
  }

  return JSON.stringify(value, null, 2)
}

export default function WebhookInspector({
  events,
}: WebhookInspectorProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [activeTab, setActiveTab] = useState<DetailTab>("body")

  const [selectedEventId, setSelectedEventId] = useState<string | null>(
    events[0]?.eventId ?? null
  )

  function refreshEvents() {
    startTransition(() => {
      router.refresh()
    })
  }

  useEffect(() => {
    if (!autoRefresh) {
      return
    }

    const interval = setInterval(() => {
      router.refresh()
    }, 5000)

    return () => clearInterval(interval)
  }, [autoRefresh, router])

  const selectedEvent = events.find(
    (event) => event.eventId === selectedEventId
  )

  function selectEvent(eventId: string) {
    setSelectedEventId(eventId)
    setActiveTab("body")
  }

  return (
    <div className="mt-8 grid gap-6 md:grid-cols-[320px_1fr]">
      <section className="overflow-hidden rounded-lg border border-gray-300">
        <div className="flex items-center justify-between gap-3 border-b border-gray-300 p-4">
          <div>
            <h2 className="font-semibold">Recent requests</h2>

            <p className="text-sm text-gray-500">
              {events.length} captured events
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(event) =>
                  setAutoRefresh(event.target.checked)
                }
              />
              Auto
            </label>

            <button
              type="button"
              onClick={refreshEvents}
              disabled={isPending}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-100 disabled:opacity-50"
            >
              {isPending ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        <div className="max-h-[650px] overflow-y-auto">
          {events.length === 0 ? (
            <p className="p-4 text-sm text-gray-500">
              No webhooks received yet.
            </p>
          ) : (
            events.map((event) => {
              const isSelected =
                event.eventId === selectedEventId

              return (
                <button
                  key={event.eventId}
                  type="button"
                  onClick={() => selectEvent(event.eventId)}
                  className={`w-full border-b border-gray-200 p-4 text-left hover:bg-gray-100 ${
                    isSelected ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold">
                      {event.method ?? "Unknown"}
                    </span>

                    <span className="text-xs text-gray-500">
                      {event.receivedAt
                        ? new Date(
                            event.receivedAt
                          ).toLocaleTimeString()
                        : "Unknown time"}
                    </span>
                  </div>

                  <p className="mt-2 truncate text-xs text-gray-500">
                    {event.eventId}
                  </p>
                </button>
              )
            })
          )}
        </div>
      </section>

      <section className="min-w-0 rounded-lg border border-gray-300 p-6">
        {selectedEvent ? (
          <>
            <h2 className="text-xl font-semibold">
              Request details
            </h2>

            <dl className="mt-6 grid gap-4 text-sm">
              <div>
                <dt className="font-semibold">Method</dt>
                <dd>{selectedEvent.method ?? "Unknown"}</dd>
              </div>

              <div>
                <dt className="font-semibold">Path</dt>
                <dd className="break-all">
                  {selectedEvent.path ?? "Unknown"}
                </dd>
              </div>

              <div>
                <dt className="font-semibold">Received</dt>
                <dd>
                  {selectedEvent.receivedAt ?? "Unknown"}
                </dd>
              </div>

              <div>
                <dt className="font-semibold">Event ID</dt>
                <dd className="break-all">
                  {selectedEvent.eventId}
                </dd>
              </div>
            </dl>

            <div className="mt-8 flex gap-2 border-b border-gray-300">
              <button
                type="button"
                onClick={() => setActiveTab("body")}
                className={`px-4 py-2 text-sm ${
                  activeTab === "body"
                    ? "border-b-2 border-black font-semibold"
                    : "text-gray-500"
                }`}
              >
                Body
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("headers")}
                className={`px-4 py-2 text-sm ${
                  activeTab === "headers"
                    ? "border-b-2 border-black font-semibold"
                    : "text-gray-500"
                }`}
              >
                Headers
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("query")}
                className={`px-4 py-2 text-sm ${
                  activeTab === "query"
                    ? "border-b-2 border-black font-semibold"
                    : "text-gray-500"
                }`}
              >
                Query
              </button>
            </div>

            <pre className="mt-4 max-h-[450px] overflow-auto rounded-lg bg-gray-100 p-4 text-sm text-gray-900">
              {activeTab === "body" &&
                formatBody(selectedEvent.body)}

              {activeTab === "headers" &&
                formatObject(selectedEvent.headers)}

              {activeTab === "query" &&
                formatObject(selectedEvent.queryParameters)}
            </pre>
          </>
        ) : (
          <p className="text-gray-500">
            Select a request to view its details.
          </p>
        )}
      </section>
    </div>
  )
}