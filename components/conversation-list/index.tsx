'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { fetcher } from '@/utils'
import { Card, CardContent } from '@/components/ui/card'
import { MessageSquare, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'
import { formatDate, formatTime } from '@/utils'
import LoadingBlock from '../loading-block'
import DangerBlock from '../danger-block'
import ConversationModal from '../conversation-modal'
import { Conversation } from '@/types'

interface Props {
  agentId: string
}

export default function ConversationList({ agentId }: Props) {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  const { data, error, isLoading } = useSWR(
    `/api/eleven-labs/conversations/list-conversations?agent_id=${agentId}`,
    fetcher
  )

  const conversations = data?.data?.conversations

  if (isLoading) return <LoadingBlock />

  if (error) return <DangerBlock text='Failed to load conversations. Please Try again' />

  const handleCardClick = (conversationId: string) => {
    setSelectedConversationId(conversationId)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  return (
    <div className='container mx-auto'>
      <h1 className='text-2xl font-bold mb-4 cursor-default'>Conversations</h1>
      <div className='space-y-2'>
        {conversations.map((conversation: Conversation) => (
          <Card
            key={conversation.conversation_id}
            className={cn(
              'cursor-pointer hover:bg-accent transition-colors',
              selectedConversationId === conversation.conversation_id ? 'border-primary' : ''
            )}
            onClick={() => handleCardClick(conversation.conversation_id)}>
            <CardContent className='p-3 flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='bg-muted rounded-md p-2'>
                  <MessageSquare className='h-5 w-5 text-muted-foreground' />
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
      <ConversationModal conversationId={selectedConversationId} onClose={handleCloseModal} open={isModalOpen} />
    </div>
  )
}
