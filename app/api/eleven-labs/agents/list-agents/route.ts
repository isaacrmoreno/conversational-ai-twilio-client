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

    const userAgentsFromDB = await db.select().from(agents).where(eq(agents.creator_id, user.id)).execute()

    if (userAgentsFromDB.length === 0) {
      return NextResponse.json({ success: true }, { status: 200 })
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
