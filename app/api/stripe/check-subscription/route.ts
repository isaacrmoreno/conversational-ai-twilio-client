import { db } from '@/lib/db/drizzle'
import { teams, teamMembers } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { getUser } from '@/lib/db/queries'

export async function GET() {
  try {
    const user = await getUser()

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not authenticated' }, { status: 401 })
    }

    const userTeam = await db
      .select()
      .from(teamMembers)
      .where(eq(teamMembers.userId, Number(user.id)))
      .limit(1)

    if (userTeam.length === 0) {
      return NextResponse.json({ error: 'User is not a member of any team.' }, { status: 404 })
    }

    const teamId = userTeam[0].teamId

    const team = await db.select().from(teams).where(eq(teams.id, teamId)).limit(1)

    if (team.length === 0) {
      return NextResponse.json({ error: 'Team not found.' }, { status: 404 })
    }

    const { subscriptionStatus } = team[0]

    if (subscriptionStatus === 'active') {
      return NextResponse.json({ hasAccess: true })
    } else if (subscriptionStatus === 'trialing') {
      return NextResponse.json({ hasAccess: true, trialing: true })
    } else {
      return NextResponse.json({ hasAccess: false })
    }
  } catch (error) {
    console.error('Error processing request:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
