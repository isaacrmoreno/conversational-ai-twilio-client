import { NextResponse } from 'next/server'
import { db } from '@/lib/db/drizzle'
import { eq } from 'drizzle-orm'
import { user_numbers } from '@/lib/db/schema'
import { getUser } from '@/lib/db/queries'

export async function GET() {
  const user = await getUser()

  if (!user) {
    return NextResponse.json({ success: false, message: 'User not authenticated' }, { status: 401 })
  }

  try {
    const userNumbers = await db
      .select()
      .from(user_numbers)
      .where(eq(user_numbers.user_id, Number(user.id)))

    if (userNumbers.length > 0) {
      return NextResponse.json({ success: true, data: userNumbers.map((number) => number.twilio_number) })
    }

    return NextResponse.json({ success: true, phoneNumbers: [], message: 'User does not have any phone numbers' })
  } catch (error) {
    console.error('Error fetching user phone numbers:', error)
    return NextResponse.json({ success: false, message: 'Error fetching user phone numbers' }, { status: 500 })
  }
}
