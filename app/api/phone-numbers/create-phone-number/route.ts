import { ElevenLabsClient } from 'elevenlabs'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/drizzle'
import { agents } from '@/lib/db/schema'

import { getUser } from '@/lib/db/queries'

export async function POST(req: NextRequest) {
  const { name } = await req.json()

  const user = await getUser()

  if (!user) {
    return NextResponse.json({ success: false, message: 'User not authenticated' }, { status: 401 })
  }

  try {
    const client = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY })

    await client.conversationalAi.createPhoneNumber({
      phone_number: 'phone_number',
      label: 'label',
      sid: 'sid',
      token: 'token'
    })

    return NextResponse.json({ success: true, message: 'Agent created successfully' })
  } catch (error) {
    console.error('Error creating agent:', error)
    return NextResponse.json({ success: false, message: 'Failed to create agent' }, { status: 500 })
  }
}
