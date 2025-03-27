import { ElevenLabsClient } from 'elevenlabs'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const agent_id = url.searchParams.get('agent_id')

    const client = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY })

    if (!agent_id) {
      return NextResponse.json({ success: false, message: 'Agent ID is required' }, { status: 400 })
    }

    const response = await client.conversationalAi.deleteAgent(agent_id)

    if (!response) {
      return NextResponse.json({ success: false, message: 'No agent found' }, { status: 404 })
    }

    // need to delete association in db too! and see how this affects conversations history.

    return NextResponse.json({ success: true, data: response })
  } catch (error) {
    console.error('Error retrieving agent:', error)
    return NextResponse.json({ success: false, message: 'Failed to retrieve agent' }, { status: 500 })
  }
}
