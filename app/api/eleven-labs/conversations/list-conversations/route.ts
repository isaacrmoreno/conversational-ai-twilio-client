import { ElevenLabsClient } from 'elevenlabs'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const agent_id = url.searchParams.get('agent_id')

    if (!agent_id) {
      return NextResponse.json({ success: false, message: 'Agent ID is required' }, { status: 400 })
    }

    const client = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY })
    const response = await client.conversationalAi.getConversations({
      agent_id: agent_id,
      call_successful: 'success',
      page_size: 30
    })

    return NextResponse.json({ success: true, data: response })
  } catch (error) {
    console.error('Error fetching conversations:', error)
    return NextResponse.json({ success: false, message: 'Failed to fetch conversations' }, { status: 500 })
  }
}
