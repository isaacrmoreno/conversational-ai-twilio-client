import { ElevenLabsClient } from 'elevenlabs'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const client = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY })

    const response = await client.voices.getAll()

    return NextResponse.json({ success: true, data: response })
  } catch (error) {
    console.error('Error fetching voices:', error)
    return NextResponse.json({ success: false, message: 'Failed to fetch voices' }, { status: 500 })
  }
}
