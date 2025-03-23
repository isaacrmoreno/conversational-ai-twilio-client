import { NextResponse } from 'next/server'
import twilio from 'twilio'

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const client = twilio(accountSid, authToken)

export async function GET() {
  try {
    const calls = await client.calls.list({ limit: 20 })

    return NextResponse.json({ success: true, calls })
  } catch (error) {
    console.error('Error fetching calls:', error)
    return NextResponse.json({ success: false, message: 'Failed to fetch calls' }, { status: 500 })
  }
}
