'use client'

import useSWR from 'swr'
import { useState } from 'react'
import { fetcher } from '@/utils'

const ConversationsPage = () => {
  const [agentId, setAgentId] = useState('DscGwQp86RNwSIoKkssa')
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)

  // Fetch conversations list
  const { data, error, isLoading } = useSWR(`/api/conversations/list-conversations?agent_id=${agentId}`, fetcher)

  // Fetch detailed conversation info (like transcript summary)
  const {
    data: conversationData,
    error: conversationError,
    isLoading: isConversationLoading
  } = useSWR(
    selectedConversationId
      ? `/api/conversations/get-conversation-details?conversation_id=${selectedConversationId}`
      : null,
    fetcher
  )

  // Extract conversations data
  const conversations = data?.data?.conversations

  // Handle loading and error states
  if (isLoading) return <div>Loading conversations...</div>
  if (error) return <div>Failed to load conversations</div>

  // Handle conversation details loading
  if (isConversationLoading) return <div>Loading conversation details...</div>
  if (conversationError) return <div>Failed to load conversation details</div>

  return (
    <div>
      <h1>Conversations</h1>
      <input type='text' value={agentId} onChange={(e) => setAgentId(e.target.value)} placeholder='Enter agent ID' />
      <ul>
        {conversations?.map((conversation: any) => (
          <li
            key={conversation.conversation_id}
            className='border'
            onClick={() => setSelectedConversationId(conversation.conversation_id)} // Set conversation ID on click
          >
            <strong>{conversation.agent_name}</strong>
            <br />
            <strong>Conversation ID:</strong> {conversation.conversation_id}
            <br />
            <strong>Status:</strong> {conversation.status}
            <br />
            <strong>Start Time:</strong> {new Date(conversation.start_time_unix_secs * 1000).toLocaleString()}
            <br />
            <strong>Call Duration:</strong> {conversation.call_duration_secs} seconds
            <br />
            <strong>Messages Count:</strong> {conversation.message_count}
          </li>
        ))}
      </ul>

      {selectedConversationId && (
        <div>
          <h2>Transcript Summary</h2>
          <p>{conversationData?.data?.analysis?.transcript_summary}</p>
        </div>
      )}
    </div>
  )
}

export default ConversationsPage
