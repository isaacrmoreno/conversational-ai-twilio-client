import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body.prompt || !body.first_message || !body.from || !body.to) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!/^\d{10}$/.test(body.from) || !/^\d{10}$/.test(body.to)) {
      return NextResponse.json({ error: 'Invalid phone number format. Must be 10 digits.' }, { status: 400 })
    }

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
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error processing request:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
