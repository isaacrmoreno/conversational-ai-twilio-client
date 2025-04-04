'use client'

import useSWR, { mutate } from 'swr'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { fetcher, formatDate } from '@/utils'
import { toast } from 'sonner'
import AddAgentModal from '@/components/add-agent-modal'
import DeleteConfirmationModal from '@/components/delete-confirmation-modal'
import axios from 'axios'
import WarningBlock from '@/components/warning-block'
import DangerBlock from '@/components/danger-block'
import LoadingBlock from '@/components/loading-block'
import UpdateAgentModal from '@/components/update-agent-modal'

export default function AgentPage() {
  const { data, error, isLoading } = useSWR(`/api/eleven-labs/agents/list-agents`, fetcher)
  const { data: subscriptionData, isLoading: loadingSubscriptionData } = useSWR(
    `/api/stripe/check-subscription`,
    fetcher
  )

  const agents = data?.data

  const isLoaded = Boolean(data)
  const hasAgents = isLoaded && Array.isArray(agents) && agents.length > 0

  if (subscriptionData?.hasAccess === null) {
    return <div>Loading subscription status...</div>
  }

  const deleteAgent = async (agent_id: number) => {
    try {
      await axios.delete(`/api/eleven-labs/agents/delete-agent?agent_id=${agent_id}`)
      toast.success('Agent deleted successfully!')
      mutate('/api/eleven-labs/agents/list-agents')
    } catch (error) {
      console.error('Error deleting agent:', error)
      toast.error('Failed to delete agent')
    }
  }

  if (loadingSubscriptionData) return <LoadingBlock />

  const hasAccess = subscriptionData?.hasAccess

  // if (!hasAccess)
  //   return <DangerBlock text='You cannot create an agent without an active subscription.' redirect={true} />

  if (isLoading) return <LoadingBlock />

  if (error) return <DangerBlock text='Error loading agents. Please try again.' />

  return (
    <section className='flex-1 p-4 lg:p-8'>
      <div className='flex justify-between'>
        <h1 className='text-lg lg:text-2xl font-medium bold text-gray-900 mb-6'>Agent Management</h1>
        <AddAgentModal />
      </div>

      {!hasAgents && <WarningBlock text='No agents found. Create one to get started.' />}

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {agents.map((agent: any) => (
          <Card key={agent.agent_id} className='overflow-hidden cursor-default'>
            <CardHeader className='pb-2'>
              <div className='flex justify-between items-start'>
                <CardTitle className='text-lg'>{agent.name}</CardTitle>
              </div>
              <CardDescription>ID: {agent.agent_id}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-2 text-sm'>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Created by:</span>
                  <span className='font-medium'>{agent.creator_name}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Created on:</span>
                  <span className='font-medium'>{formatDate(agent.created_at)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className='flex flex-row justify-between'>
              <UpdateAgentModal agentId={agent.agent_id} name={agent.name} />
              <DeleteConfirmationModal onDelete={() => deleteAgent(agent.agent_id)} />
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}
