import { ElevenLabsClient } from 'elevenlabs'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const client = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY })
    await client.conversationalAi.createAgent({
      use_tool_ids: true,
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
          voice_id: 'cjVigY5qzO86Huf0OWal',
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
        }
      }
    })

    // For now, we'll just simulate a successful response
    return NextResponse.json({ success: true, message: 'Agent created successfully' })
  } catch (error) {
    console.error('Error creating agent:', error)
    return NextResponse.json({ success: false, message: 'Failed to create agent' }, { status: 500 })
  }
}
