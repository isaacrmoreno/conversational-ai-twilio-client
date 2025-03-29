import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { db } from '@/lib/db/drizzle'
import { calls } from '@/lib/db/schema'
import { and, eq, asc } from 'drizzle-orm'

async function getNextQueuedCall(agentId: number) {
  const result = await db
    .select()
    .from(calls)
    .where(and(eq(calls.agent_id, agentId), eq(calls.status, 'queued')))
    .orderBy(asc(calls.created_at))
    .limit(1)
    .execute()

  return result[0] || null // Return the next queued call or null if no call is found
}

async function markCallAsCompleted(conversationId: number) {
  try {
    const result = await db
      .update(calls)
      .set({
        status: 'completed',
        updated_at: new Date()
      })
      .where(eq(calls.id, conversationId))
      .returning()
      .execute()

    if (result.length === 0) {
      throw new Error('No call found to update')
    }

    return { success: true, message: 'Call marked as completed successfully.' }
  } catch (error) {
    console.error('Error marking call as completed:', error)
    return { success: false, message: 'Failed to mark call as completed.' }
  }
}

async function initiateCall(callData: any) {
  await fetch(`${process.env.RENDER_URL}/outbound-call`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(callData)
  })
}

export async function POST(req: NextRequest) {
  const secret = process.env.ELEVENLABS_CONVAI_WEBHOOK_SECRET
  const { event, error } = await constructWebhookEvent(req, secret)

  if (error) {
    return NextResponse.json({ error }, { status: 401 })
  }

  if (event.type === 'post_call_transcription') {
    const { agent_id, conversation_id } = event.data

    console.log(`Call completed for agent: ${agent_id}, conversation: ${conversation_id}`)

    // Mark the completed call in the database
    await markCallAsCompleted(conversation_id)

    // Fetch the next queued call
    const nextCall = await getNextQueuedCall(agent_id)

    if (nextCall) {
      console.log('Initiating next call:', nextCall)
      await initiateCall(nextCall)
    }
  }

  return NextResponse.json({ received: true }, { status: 200 })
}

// Webhook verification helper
const constructWebhookEvent = async (req: NextRequest, secret?: string) => {
  const body = await req.text()
  const signature_header = req.headers.get('ElevenLabs-Signature')

  if (!signature_header) {
    return { event: null, error: 'Missing signature header' }
  }

  const headers = signature_header.split(',')
  const timestamp = headers.find((e) => e.startsWith('t='))?.substring(2)
  const signature = headers.find((e) => e.startsWith('v0='))

  if (!timestamp || !signature) {
    return { event: null, error: 'Invalid signature format' }
  }

  const reqTimestamp = Number(timestamp) * 1000
  const tolerance = Date.now() - 30 * 60 * 1000
  if (reqTimestamp < tolerance) {
    return { event: null, error: 'Request expired' }
  }

  if (!secret) {
    return { event: null, error: 'Webhook secret not configured' }
  }

  const message = `${timestamp}.${body}`
  const digest = 'v0=' + crypto.createHmac('sha256', secret).update(message).digest('hex')

  if (signature !== digest) {
    return { event: null, error: 'Invalid signature' }
  }

  return { event: JSON.parse(body), error: null }
}
