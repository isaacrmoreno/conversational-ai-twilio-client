import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/drizzle'
import { user_numbers } from '@/lib/db/schema'
import { getUser } from '@/lib/db/queries'

import twilio from 'twilio'

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const client = twilio(accountSid, authToken)

export async function POST(req: NextRequest) {
  const user = await getUser()

  if (!user) {
    return NextResponse.json({ success: false, message: 'User not authenticated' }, { status: 401 })
  }

  const { phoneNumber } = await req.json()

  if (!phoneNumber) {
    return NextResponse.json({ success: false, message: 'Invalid or missing incoming phone number' }, { status: 400 })
  }

  try {
    const response = await client.incomingPhoneNumbers.create({
      phoneNumber: phoneNumber
    })

    await db.insert(user_numbers).values({
      user_id: user.id,
      twilio_number: response.phoneNumber,
      status: response.status,
      created_at: new Date(response.dateCreated),
      updated_at: new Date(response.dateUpdated)
    })

    return NextResponse.json({ success: true, data: response })
  } catch (error) {
    console.error('Error fetching calls:', error)
    return NextResponse.json({ success: false, message: 'Failed to fetch calls' }, { status: 500 })
  }
}
