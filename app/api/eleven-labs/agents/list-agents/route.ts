import { ElevenLabsClient } from 'elevenlabs'
import { NextResponse } from 'next/server'
import { getUser } from '@/lib/db/queries'
import { agents } from '@/lib/db/schema'
import { db } from '@/lib/db/drizzle'
import { eq } from 'drizzle-orm'

export async function GET() {
  try {
    const user = await getUser()

    if (!user?.id) {
      return NextResponse.json({ success: false, message: 'User not authenticated' }, { status: 401 })
    }

    const client = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY })

    const response = await client.conversationalAi.getAgents()

    if (!response.agents) {
      return NextResponse.json({ success: false, message: 'No agents found' }, { status: 404 })
    }

    const userAgentsFromDB = await db.select().from(agents).where(eq(agents.creator_email, user.email)).execute()

    if (userAgentsFromDB.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No agents found for the user in the database' },
        { status: 404 }
      )
    }

    const formattedAgents = userAgentsFromDB.map((agent) => ({
      agent_id: agent.agent_id,
      name: agent.name,
      created_at: agent.created_at,
      creator_email: agent.creator_email,
      creator_name: user.name
    }))

    return NextResponse.json({ success: true, data: formattedAgents })
  } catch (error) {
    console.error('Error retrieving agents:', error)
    return NextResponse.json({ success: false, message: 'Failed to retrieve agents' }, { status: 500 })
  }
}
