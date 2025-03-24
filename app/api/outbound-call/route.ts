import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body.prompt || !body.first_message || !body.from || !body.to || !body.agent_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!/^\d{10}$/.test(body.from) || !/^\d{10}$/.test(body.to)) {
      return NextResponse.json({ error: 'Invalid phone number format. Must be 10 digits.' }, { status: 400 })
    }

    // Call the server to initiate the outbound call
    const response = await fetch(`${process.env.RENDER_URL}/outbound-call`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json({ error: `External API error: ${errorText}` }, { status: response.status })
    }

    const data = await response.json()

    // Now initiate the WebSocket connection to the media stream
    const ws = new WebSocket(`wss://${process.env.RENDER_URL}/outbound-media-stream`)

    ws.onopen = () => {
      // Send parameters via WebSocket after connection is established
      const initMessage = {
        agent_id: body.agent_id,
        prompt: body.prompt,
        first_message: body.first_message
      }

      console.log('[Client] Sending initial parameters:', initMessage)
      ws.send(JSON.stringify(initMessage))
    }

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data)
      console.log('[Client] Received message:', message)

      // Handle incoming messages, for example, audio streams or responses
      // You can process the audio stream here or handle other events as needed.
    }

    ws.onerror = (error) => {
      console.error('[Client] WebSocket error:', error)
    }

    ws.onclose = () => {
      console.log('[Client] WebSocket connection closed')
    }

    // Return the response from the POST request to the client
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error processing request:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
