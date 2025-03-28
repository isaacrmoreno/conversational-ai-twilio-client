export interface Conversation {
  agent_id: string
  agent_name: string
  conversation_id: string
  start_time_unix_secs: number
  call_duration_secs: number
  message_count: number
  status: string
  call_successful: string
}

export interface PhoneNumber {
  friendlyName: string
  phoneNumber: string
  lata: string
  locality: string
  rateCenter: string
  latitude: string
  longitude: string
  region: string
  postalCode: string | null
  isoCountry: string
  addressRequirements: string
  beta: boolean
  capabilities: {
    voice: boolean
    SMS: boolean
    MMS: boolean
  }
}

export interface Voice {
  voice_id: string
  name: string
  samples: null
  category: string
  fine_tuning: FineTuning
  labels: Labels
  description: string | null
  preview_url: string
  available_for_tiers: any[]
  settings: null
  sharing: null
  high_quality_base_model_ids: string[]
  verified_languages: string[]
  safety_control: null
  voice_verification: VoiceVerification
  permission_on_resource: null
  is_owner: boolean
  is_legacy: boolean
  is_mixed: boolean
  created_at_unix: number | null
}

interface FineTuning {
  is_allowed_to_fine_tune: boolean
  state: Record<string, string>
  verification_failures: any[]
  verification_attempts_count: number
  manual_verification_requested: boolean
  language: string
  progress: Record<string, number>
  message: Record<string, string>
  dataset_duration_seconds: number | null
  verification_attempts: any
  slice_ids: any
  manual_verification: any
  max_verification_attempts: number
  next_max_verification_attempts_reset_unix_ms: number
}

interface Labels {
  accent: string
  description: string
  age: string
  gender: string
  use_case: string
}

interface VoiceVerification {
  requires_verification: boolean
  is_verified: boolean
  verification_failures: any[]
  verification_attempts_count: number
  language: string | null
  verification_attempts: any
}
