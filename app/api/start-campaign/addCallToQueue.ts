import { db } from '@/lib/db/drizzle'
import { calls } from '@/lib/db/schema'

export async function addCallToQueue(
  agentId: number,
  from_number: string,
  to_number: string,
  prompt: string,
  firstMessage: string
) {
  try {
    const newCall = {
      agent_id: agentId,
      from_number: from_number,
      to_number: to_number,
      prompt: prompt,
      first_message: firstMessage,
      status: 'queued',
      created_at: new Date(),
      updated_at: new Date()
    }

    const result = await db.insert(calls).values(newCall).returning().execute()

    console.log('Call added to queue:', result)
    return result
  } catch (error) {
    console.error('Error inserting call into database:', error)
    throw new Error('Failed to add call to queue')
  }
}
