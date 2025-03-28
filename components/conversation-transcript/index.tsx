'use client'

import { cn } from '@/lib/utils'
import { formatTimeFromSeconds } from '@/utils'
import WarningBlock from '../warning-block'

interface TranscriptItem {
  role: string
  message: string
  time_in_call_secs: number
  tool_calls: any[]
  tool_results: any[]
  feedback: any
  llm_override: any
  conversation_turn_metrics: any
  rag_retrieval_info: any
}

interface ConversationTranscriptProps {
  transcript: TranscriptItem[]
}

export default function ConversationTranscript({ transcript }: ConversationTranscriptProps) {
  if (!transcript || transcript.length === 0) return <WarningBlock text='No transcript available' />

  return (
    <div className='space-y-3 overflow-y-auto max-h-80'>
      <h3 className='text-sm font-medium'>Conversation Transcript</h3>
      <div className='space-y-3'>
        {transcript.map((item, index) => (
          <div
            key={index}
            className={cn(
              'p-4 rounded-lg max-w-3/4',
              item.role === 'agent' ? 'bg-gray-100 text-gray-900 ml-4 mr-auto' : 'bg-blue-400 text-white ml-auto mr-4'
            )}>
            <div className='flex items-center space-x-2'>
              <p className='text-sm whitespace-pre-line flex-1'>{item.message}</p>
              <span className='text-xs text-gray-600 whitespace-nowrap'>
                {formatTimeFromSeconds(item.time_in_call_secs)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
