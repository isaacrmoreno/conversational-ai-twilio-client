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
    const existingNumber = await db
      .select()
      .from(user_numbers)
      .where(eq(user_numbers.user_id, Number(user.id)))
      .limit(1)

    if (existingNumber.length > 0) {
      return NextResponse.json({ success: true, hasNumber: true, message: 'User already has a phone number' })
    }

    return NextResponse.json({ success: true, hasNumber: false, message: 'User does not have a phone number' })
  } catch (error) {
    console.error('Error checking phone number:', error)
    return NextResponse.json({ success: false, message: 'Error checking phone number' }, { status: 500 })
  }
}
