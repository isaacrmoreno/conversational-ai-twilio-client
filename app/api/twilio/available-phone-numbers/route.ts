import { NextRequest, NextResponse } from 'next/server'
import twilio from 'twilio'

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const client = twilio(accountSid, authToken)

export async function GET(req: NextRequest) {
  const areaCodeParam = req.nextUrl.searchParams.get('areaCode')

  const areaCode = areaCodeParam ? parseInt(areaCodeParam, 10) : undefined

  if (!areaCode || isNaN(areaCode)) {
    return NextResponse.json({ success: false, message: 'Invalid or missing area code' }, { status: 400 })
  }

  try {
    const locals = await client.availablePhoneNumbers('US').local.list({
      areaCode: areaCode,
      limit: 10
    })

    return NextResponse.json({ success: true, data: locals })
  } catch (error) {
    console.error('Error fetching calls:', error)
    return NextResponse.json({ success: false, message: 'Failed to fetch calls' }, { status: 500 })
  }
}
