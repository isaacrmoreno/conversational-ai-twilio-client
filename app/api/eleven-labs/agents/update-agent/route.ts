import { ElevenLabsClient } from 'elevenlabs'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/drizzle'
import { agents } from '@/lib/db/schema'

import { getUser } from '@/lib/db/queries'
import { eq } from 'drizzle-orm'

export async function PATCH(req: NextRequest) {
  const { name, voice_id, agent_id } = await req.json()

  const user = await getUser()

  if (!user) {
    return NextResponse.json({ success: false, message: 'User not authenticated' }, { status: 401 })
  }

  try {
    const client = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY })
    const response = await client.conversationalAi.updateAgent(agent_id, {
      conversation_config: {
        asr: {
          user_input_audio_format: 'ulaw_8000',
          keywords: []
        },
        turn: {
          turn_timeout: 7,
          mode: 'turn'
        },
        tts: {
          model_id: 'eleven_turbo_v2',
          voice_id: voice_id,
          agent_output_audio_format: 'ulaw_8000',
          optimize_streaming_latency: 3,
          stability: 0.5,
          speed: 1,
          similarity_boost: 0.8,
          pronunciation_dictionary_locators: []
        },
        conversation: {
          max_duration_seconds: 600,
          client_events: ['audio', 'interruption', 'user_transcript', 'agent_response', 'agent_response_correction']
        },
        language_presets: {},
        agent: {
          first_message: '/n',
          language: 'en',
          dynamic_variables: {
            dynamic_variable_placeholders: {}
          },
          prompt: {
            prompt: 'Helpful Assistant',
            llm: 'gemini-2.0-flash-001',
            temperature: 0.5,
            max_tokens: -1,
            tools: [
              {
                type: 'system',
                name: 'end_call',
                description: ''
              }
            ],
            tool_ids: ['26WH23vqPKNRVUtee3RW'],
            knowledge_base: [],
            rag: {
              enabled: false,
              embedding_model: 'e5_mistral_7b_instruct',
              max_vector_distance: 0.6,
              max_documents_length: 50000
            }
          }
        }
      },
      platform_settings: {
        auth: {
          enable_auth: true,
          allowlist: [],
          shareable_token: ''
        },
        overrides: {
          conversation_config_override: {
            agent: {
              prompt: {
                prompt: true
              },
              first_message: true
            },
            tts: {
              voice_id: true
            }
          }
        }
      },
      name: name
    })

    const agentId = response.agent_id

    await db
      .update(agents)
      .set({
        name: name
      })
      .where(eq(agents.agent_id, agentId))

    return NextResponse.json({ success: true, message: 'Agent updated successfully' })
  } catch (error) {
    console.error('Error updating agent:', error)
    return NextResponse.json({ success: false, message: 'Failed to update agent' }, { status: 500 })
  }
}
