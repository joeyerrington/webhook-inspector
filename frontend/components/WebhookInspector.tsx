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
  if (!body) return "No request body"

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
    if (!autoRefresh) return

    const interval = setInterval(() => {
      router.refresh()
    }, 5000)

    return () => clearInterval(interval)
  }, [autoRefresh, router])

  useEffect(() => {
    if (
      events.length > 0 &&
      !events.some((event) => event.eventId === selectedEventId)
    ) {
      setSelectedEventId(events[0].eventId)
    }
  }, [events, selectedEventId])

  const selectedEvent = events.find(
    (event) => event.eventId === selectedEventId
  )

  function selectEvent(eventId: string) {
    setSelectedEventId(eventId)
    setActiveTab("body")
  }

  const tabs: { id: DetailTab; label: string }[] = [
    { id: "body", label: "Body" },
    { id: "headers", label: "Headers" },
    { id: "query", label: "Query parameters" },
  ]

  return (
    <div className="mt-6 grid gap-4 lg:grid-cols-[320px_1fr]">
      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                Recent requests
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                {events.length} captured{" "}
                {events.length === 1 ? "event" : "events"}
              </p>
            </div>

            <button
              type="button"
              onClick={refreshEvents}
              disabled={isPending}
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50"
            >
              {isPending ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          <label className="mt-4 flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(event) =>
                setAutoRefresh(event.target.checked)
              }
              className="h-4 w-4 rounded border-gray-300 accent-green-700"
            />
            Auto refresh
          </label>
        </div>

        <div className="max-h-[650px] overflow-y-auto">
          {events.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-sm font-medium text-gray-700">
                No requests yet
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Send a request to your webhook URL.
              </p>
            </div>
          ) : (
            events.map((event) => {
              const isSelected =
                event.eventId === selectedEventId

              return (
                <button
                  key={event.eventId}
                  type="button"
                  onClick={() => selectEvent(event.eventId)}
                  className={`w-full border-b border-gray-100 px-4 py-3 text-left transition ${
                    isSelected
                      ? "bg-gray-100"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-md bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
                      {event.method ?? "Unknown"}
                    </span>

                    <span className="text-xs text-gray-500">
                      {event.receivedAt
                        ? new Date(
                            event.receivedAt
                          ).toLocaleTimeString()
                        : "Unknown"}
                    </span>
                  </div>

                  <p className="mt-2 truncate text-xs text-gray-500">
                    {event.path ?? event.eventId}
                  </p>
                </button>
              )
            })
          )}
        </div>
      </section>

      <section className="min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {selectedEvent ? (
          <>
            <div className="border-b border-gray-200 px-6 py-5">
              <div className="flex items-center gap-3">
                <h2 className="text-base font-semibold text-gray-900">
                  Request details
                </h2>

                <span className="rounded-md bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
                  {selectedEvent.method ?? "Unknown"}
                </span>
              </div>

              <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-medium text-gray-500">
                    Received
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {selectedEvent.receivedAt
                      ? new Date(
                          selectedEvent.receivedAt
                        ).toLocaleString()
                      : "Unknown"}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs font-medium text-gray-500">
                    Path
                  </dt>
                  <dd className="mt-1 break-all text-sm text-gray-900">
                    {selectedEvent.path ?? "Unknown"}
                  </dd>
                </div>

                <div className="sm:col-span-2">
                  <dt className="text-xs font-medium text-gray-500">
                    Event ID
                  </dt>
                  <dd className="mt-1 break-all font-mono text-xs text-gray-700">
                    {selectedEvent.eventId}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="px-6 pt-4">
              <div className="flex gap-1 border-b border-gray-200">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative px-3 py-2 text-sm font-medium ${
                      activeTab === tab.id
                        ? "text-gray-900"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    {tab.label}

                    {activeTab === tab.id && (
                      <span className="absolute inset-x-2 bottom-0 h-0.5 rounded bg-green-700" />
                    )}
                  </button>
                ))}
              </div>

              <pre className="my-5 max-h-[450px] overflow-auto rounded-lg bg-gray-950 p-5 font-mono text-sm leading-6 text-gray-100">
                {activeTab === "body" &&
                  formatBody(selectedEvent.body)}

                {activeTab === "headers" &&
                  formatObject(selectedEvent.headers)}

                {activeTab === "query" &&
                  formatObject(
                    selectedEvent.queryParameters
                  )}
              </pre>
            </div>
          </>
        ) : (
          <div className="p-10 text-center">
            <p className="text-sm font-medium text-gray-700">
              No request selected
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Select a request to inspect its details.
            </p>
          </div>
        )}
      </section>
    </div>
  )
}