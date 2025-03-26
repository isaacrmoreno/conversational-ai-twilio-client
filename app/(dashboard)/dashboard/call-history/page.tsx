'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, User } from 'lucide-react'
import { fetcher, formatDate } from '@/utils'
import ConversationsPage from '@/components/Conversations'

export default function AgentPage() {
  const { data, error } = useSWR(`/api/agents/list-agents`, fetcher)
  const { data: subscriptionData } = useSWR(`/api/stripe/check-subscription`, fetcher)

  const agents = data?.data
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null)

  const isLoaded = Boolean(data)
  const hasAgents = isLoaded && Array.isArray(agents) && agents.length > 0

  if (subscriptionData?.hasAccess === null) {
    return <div>Loading subscription status...</div>
  }

  return (
    <div className='container mx-auto py-10'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold cursor-default'>Call History</h1>
      </div>

      {error && (
        <div className='p-4 mb-6 bg-red-50 border border-red-200 rounded-md'>
          <p className='text-red-800'>Error loading agents. Please try again.</p>
        </div>
      )}

      {!data ? (
        <div className='flex justify-center items-center h-40'>
          <Loader2 className='h-8 w-8 animate-spin text-primary' />
        </div>
      ) : !hasAgents ? (
        <Card className='max-w-md mx-auto'>
          <CardContent className='pt-6'>
            <div className='flex flex-col items-center justify-center text-center p-6'>
              <User className='h-12 w-12 text-muted-foreground mb-4' />
              <p className='text-muted-foreground'>No agents found. Create one to get started.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className=''>
          {agents.map((agent: any) => (
            <Card
              key={agent.agent_id}
              className='cursor-default flex justify-between items-center px-4 py-2'
              onClick={() => setSelectedAgentId(agent.agent_id)}>
              <div>
                <p className='font-bold'>{agent.name}</p>
                <p>ID: {agent.agent_id}</p>
              </div>
              <div>
                <div>
                  <span className='text-muted-foreground mr-1'>Created by:</span>
                  <span className='font-medium'>{agent.creator_name}</span>
                </div>
                <div>
                  <span className='text-muted-foreground mr-1'>Created on:</span>
                  <span className='font-medium'>{formatDate(agent.created_at)}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {selectedAgentId && <ConversationsPage agentId={selectedAgentId} />}
    </div>
  )
}
