'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { fetcher } from '@/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Clock, MessageSquare, Phone } from 'lucide-react'

export default function ConversationsPage() {
  const [agentId, setAgentId] = useState('DscGwQp86RNwSIoKkssa')
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)

  const { data, error, isLoading } = useSWR(`/api/conversations/list-conversations?agent_id=${agentId}`, fetcher)
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

  const conversations = data?.data?.conversations

  if (error) return <div className='text-red-500'>Failed to load conversations</div>
  if (conversationError) return <div className='text-red-500'>Failed to load conversation details</div>

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Conversations</h1>

      {selectedConversationId && (
        <Card className='my-4'>
          <CardHeader>
            <CardTitle>Transcript Summary</CardTitle>
          </CardHeader>
          <CardContent>
            {isConversationLoading ? (
              <Skeleton className='h-[100px] w-full' />
            ) : (
              <p>{conversationData?.data?.analysis?.transcript_summary}</p>
            )}
          </CardContent>
        </Card>
      )}

      <Input
        type='text'
        value={agentId}
        onChange={(e) => setAgentId(e.target.value)}
        placeholder='Enter agent ID'
        className='mb-4'
      />
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {isLoading
          ? Array(6)
              .fill(0)
              .map((_, i) => <Skeleton key={i} className='h-[200px] w-full' />)
          : conversations?.map((conversation: any) => (
              <Card
                key={conversation.conversation_id}
                className='cursor-pointer hover:shadow-lg transition-shadow'
                onClick={() => setSelectedConversationId(conversation.conversation_id)}>
                <CardHeader>
                  <CardTitle>{conversation.agent_name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='flex items-center gap-2 text-sm text-muted-foreground mb-2'>
                    <Clock className='h-4 w-4' />
                    {new Date(conversation.start_time_unix_secs * 1000).toLocaleString()}
                  </div>
                  <div className='flex items-center gap-2 text-sm text-muted-foreground mb-2'>
                    <Phone className='h-4 w-4' />
                    {conversation.call_duration_secs} seconds
                  </div>
                  <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                    <MessageSquare className='h-4 w-4' />
                    {conversation.message_count} messages
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>
    </div>
  )
}
