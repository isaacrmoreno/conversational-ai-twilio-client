import { NextRequest, NextResponse } from 'next/server'
import twilio from 'twilio'

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const client = twilio(accountSid, authToken)

export async function GET(req: NextRequest) {
  const { phoneNumber } = await req.json()

  if (!phoneNumber) {
    return NextResponse.json({ success: false, message: 'Invalid or missing incoming phone number' }, { status: 400 })
  }

  try {
    const response = await client.incomingPhoneNumbers.create({
      phoneNumber: phoneNumber
    })

    return NextResponse.json({ success: true, data: response })
  } catch (error) {
    console.error('Error fetching calls:', error)
    return NextResponse.json({ success: false, message: 'Failed to fetch calls' }, { status: 500 })
  }
}
