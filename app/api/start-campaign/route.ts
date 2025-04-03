import { NextRequest, NextResponse } from 'next/server'
import { forbiddenPatterns } from './forbiddenPatterns'
// import { addCallToQueue } from './addCallToQueue' // Import the addCallToQueue function
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

function isFraudulentPrompt(prompt: string) {
  return forbiddenPatterns.some((pattern) => pattern.test(prompt))
}

async function checkIntentWithAI(prompt: string): Promise<boolean> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You detect fraudulent intent in user prompts. Answer with "yes" or "no". Fraud includes asking for money, impersonation, or manipulation.'
        },
        { role: 'user', content: `Does this prompt contain fraud or deception? Prompt: "${prompt}"` }
      ],
      max_tokens: 5
    })

    const content = response.choices[0]?.message?.content
    return content ? content.toLowerCase().includes('yes') : false
  } catch (error) {
    console.error('Error checking intent with AI:', error)
    return false // Default to allowing if AI check fails
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { numbers, agent_id, prompt, first_message, from } = body

  if (!numbers?.length || !agent_id || !prompt || !first_message || !from) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // 🚨 Step 1: Quick Keyword Filtering
  if (isFraudulentPrompt(prompt)) {
    return NextResponse.json({ error: 'Blocked: Fraudulent request detected.' }, { status: 403 })
  }

  // 🧠 Step 2: AI-Based Intent Filtering
  const isFraudulent = await checkIntentWithAI(prompt)
  if (isFraudulent) {
    return NextResponse.json({ error: 'Blocked: AI detected fraudulent intent.' }, { status: 403 })
  }

  const results = []
  for (const to of numbers) {
    // Delay between calls
    await new Promise((r) => setTimeout(r, 3000))

    try {
      // await addCallToQueue(agent_id, from, to, prompt, first_message) // Add the call to the queue
      const res = await fetch(`${process.env.RENDER_URL}/outbound-call`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, first_message, from, to, agent_id })
      })

      const data = await res.json()
      results.push({ to, status: res.ok ? 'success' : 'error', response: data })
    } catch (error) {
      console.error('Error adding call to queue:', error)
      results.push({ to, status: 'error', response: 'Failed to add to queue' })
    }
  }

  return NextResponse.json({ campaign_result: results })
}
