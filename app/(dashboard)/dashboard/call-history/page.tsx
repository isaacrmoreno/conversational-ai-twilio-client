'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { Card } from '@/components/ui/card'
import { fetcher, formatDate } from '@/utils'
import Conversations from '@/components/conversations'
import DangerBlock from '@/components/danger-block'
import WarningBlock from '@/components/warning-block'
import LoadingBlock from '@/components/loading-block'

export default function AgentPage() {
  const { data, isLoading, error } = useSWR(`/api/eleven-labs/agents/list-agents`, fetcher)

  const agents = data?.data

  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null)

  if (isLoading) return <LoadingBlock />

  if (error) return <DangerBlock text='Error loading agents. Please try again.' />

  if (agents.length <= 0) return <WarningBlock text='No agents found. Create one to get started.' />

  return (
    <section className='flex-1 p-4 lg:p-8'>
      <h1 className='text-lg lg:text-2xl font-medium bold text-gray-900 mb-6'>Call History</h1>
      <div className=''>
        {agents.map((agent: any) => (
          <Card
            key={agent.agent_id}
            className='cursor-default flex justify-between items-center px-4 py-2 my-2'
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

      {selectedAgentId && <Conversations agentId={selectedAgentId} />}
    </section>
  )
}
