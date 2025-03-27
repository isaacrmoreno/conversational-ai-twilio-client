import { ElevenLabsClient } from 'elevenlabs'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const conversation_id = url.searchParams.get('conversation_id')

    if (!conversation_id) {
      return NextResponse.json({ success: false, message: 'Conversation ID is required' }, { status: 400 })
    }

    const client = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY })
    const response = await client.conversationalAi.getConversation(conversation_id)

    return NextResponse.json({ success: true, data: response })
  } catch (error) {
    console.error('Error fetching conversations:', error)
    return NextResponse.json({ success: false, message: 'Failed to fetch conversations' }, { status: 500 })
  }
}
