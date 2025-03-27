import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()
  const { numbers, agent_id, prompt, first_message, from } = body

  if (!numbers?.length || !agent_id || !prompt || !first_message || !from) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const results = []

  for (const to of numbers) {
    // Delay between calls
    await new Promise((r) => setTimeout(r, 3000))

    const res = await fetch(`${process.env.RENDER_URL}/outbound-call`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, first_message, from, to, agent_id })
    })

    const data = await res.json()
    results.push({ to, status: res.ok ? 'success' : 'error', response: data })
  }

  return NextResponse.json({ campaign_result: results })
}
