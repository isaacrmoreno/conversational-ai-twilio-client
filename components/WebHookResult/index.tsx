'use client'

import { useEffect, useState } from 'react'

export default function WebhookResult() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [eventData, setEventData] = useState(null)

  useEffect(() => {
    async function fetchWebhookData() {
      try {
        const response = await fetch('/api/convai-webhook', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
            // Optionally add authorization headers if needed
          },
          body: JSON.stringify({
            // Add any additional data you want to send with the request if necessary
          })
        })

        if (!response.ok) {
          throw new Error('Failed to fetch webhook data')
        }

        const data = await response.json()
        if (data.received) {
          setEventData(data.eventData) // Store the event data
        } else {
          setError('No event data received')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchWebhookData()
  }, [])

  return (
    <div>
      {isLoading && <p>Loading...</p>}

      {error && (
        <div className='error'>
          <p>Error: {error}</p>
        </div>
      )}

      {eventData && (
        <div className='event-data'>
          <h3>Received Webhook Event</h3>
          <pre>{JSON.stringify(eventData, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
