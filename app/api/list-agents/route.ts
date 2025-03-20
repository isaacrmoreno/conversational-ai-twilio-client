import { ElevenLabsClient } from 'elevenlabs'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const client = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY })

    const response = await client.conversationalAi.getAgents()

    return NextResponse.json({ success: true, data: response })
  } catch (error) {
    console.error('Error creating agent:', error)
    return NextResponse.json({ success: false, message: 'Failed to create agent' }, { status: 500 })
  }
}
