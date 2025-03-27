'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { fetcher } from '@/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { MessageSquare, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'

interface ConversationsPageProps {
  agentId: string
}

interface Conversation {
  agent_id: string
  agent_name: string
  conversation_id: string
  start_time_unix_secs: number
  call_duration_secs: number
  message_count: number
  status: string
  call_successful: string
}

export default function Conversations({ agentId }: ConversationsPageProps) {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)

  const { data, error, isLoading } = useSWR(
    `/api/eleven-labs/conversations/list-conversations?agent_id=${agentId}`,
    fetcher
  )

  const {
    data: conversationData,
    error: conversationError,
    isLoading: isConversationLoading
  } = useSWR(
    selectedConversationId
      ? `/api/eleven-labs/conversations/get-conversation-details?conversation_id=${selectedConversationId}`
      : null,
    fetcher
  )

  const conversations = data?.data?.conversations

  if (error) return <div className='text-red-500'>Failed to load conversations</div>
  if (conversationError) return <div className='text-red-500'>Failed to load conversation details</div>

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000)
    return date.toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    })
  }

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4 cursor-default'>Conversations</h1>

      {selectedConversationId && conversationData?.data?.analysis?.transcript_summary && (
        <Card className='my-4'>
          <CardContent className='p-4 cursor-default'>
            <p>{conversationData.data.analysis.transcript_summary}</p>
          </CardContent>
        </Card>
      )}

      <div className='space-y-2'>
        {isLoading
          ? Array(3)
              .fill(0)
              .map((_, i) => <Skeleton key={i} className='h-[60px] w-full' />)
          : conversations.map((conversation: Conversation) => (
              <Card
                key={conversation.conversation_id}
                className={cn(
                  'cursor-pointer hover:bg-accent transition-colors',
                  selectedConversationId === conversation.conversation_id ? 'border-primary' : ''
                )}
                onClick={() => setSelectedConversationId(conversation.conversation_id)}>
                <CardContent className='p-3 flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <div className='bg-muted rounded-md p-2'>
                      <MessageSquare className='h-5 w-5 text-muted-foreground' />
                    </div>
                    <div>
                      <p className='text-sm font-medium'>Today, {formatDate(conversation.start_time_unix_secs)}</p>
                    </div>
                  </div>

                  <div className='flex items-center gap-4'>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge variant='outline' className='bg-background cursor-pointer'>
                            {conversation.agent_name}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Agent name: {conversation.agent_name}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className='flex items-center gap-1'>
                            <MessageSquare className='h-4 w-4 text-muted-foreground' />
                            <span className='text-sm text-muted-foreground'>{conversation.message_count}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Message count: {conversation.message_count}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className='flex items-center gap-1'>
                            <Clock className='h-4 w-4 text-muted-foreground' />
                            <span className='text-sm text-muted-foreground'>
                              {formatTime(conversation.call_duration_secs)}
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Call duration in seconds: {formatTime(conversation.call_duration_secs)}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge
                            variant={conversation.call_successful === 'success' ? 'default' : 'destructive'}
                            className='ml-2'>
                            {conversation.call_successful === 'success' ? 'Success' : 'Failed'}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Evaluation result: {conversation.call_successful === 'success' ? 'Success' : 'Failed'}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>
    </div>
  )
}
