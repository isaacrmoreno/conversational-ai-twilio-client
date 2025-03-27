import { ElevenLabsClient } from 'elevenlabs'
import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/db/queries'
import { agents } from '@/lib/db/schema'
import { db } from '@/lib/db/drizzle'
import { eq, and } from 'drizzle-orm'

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const agent_id = url.searchParams.get('agent_id')

    if (!agent_id) {
      return NextResponse.json({ success: false, message: 'Agent ID is required' }, { status: 400 })
    }

    const user = await getUser()

    if (!user?.id) {
      return NextResponse.json({ success: false, message: 'User not authenticated' }, { status: 401 })
    }

    const client = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY })

    await client.conversationalAi.deleteAgent(agent_id)

    await db.delete(agents).where(and(eq(agents.agent_id, agent_id), eq(agents.creator_email, user.email)))

    return NextResponse.json({ success: true, status: 200 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ success: false, message: 'Failed to delete agent' }, { status: 500 })
  }
}
