'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Plus, User } from 'lucide-react'
import { fetcher, formatDate } from '@/utils'
import { toast } from 'sonner'

export default function AgentPage() {
  const { data, error, mutate } = useSWR(`/api/eleven-labs/agents/list-agents`, fetcher)
  const { data: subscriptionData } = useSWR(`/api/stripe/check-subscription`, fetcher)

  const agents = data?.data
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null)

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [agentName, setAgentName] = useState<string>('')

  const createAgent = async () => {
    if (!agentName.trim()) {
      toast.error('Agent name cannot be blank.')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/eleven-labs/agents/create-agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: agentName
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create agent')
      }

      toast.success('Agent created successfully!')
      setAgentName('')
      mutate()
    } catch (error) {
      console.error('Error creating agent:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const isLoaded = Boolean(data)
  const hasAgents = isLoaded && Array.isArray(agents) && agents.length > 0

  if (subscriptionData?.hasAccess === null) {
    return <div>Loading subscription status...</div>
  }

  return (
    <section className='flex-1 p-4 lg:p-8'>
      <h1 className='text-lg lg:text-2xl font-medium bold text-gray-900 mb-6'>Agent Management</h1>

      <div className='flex items-center'>
        <input
          type='text'
          placeholder='Enter agent name'
          value={agentName}
          onChange={(e) => setAgentName(e.target.value)}
          className='mr-4 p-2 border rounded'
        />
        <Button
          onClick={createAgent}
          disabled={isLoading || !subscriptionData?.hasAccess || agents?.length > 0}
          className='cursor-pointer'>
          {isLoading ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Creating...
            </>
          ) : (
            <>
              <Plus className='h-4 w-4 mr-2' />
              Create Agent
            </>
          )}
        </Button>
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
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6'>
          {agents.map((agent: any) => (
            <Card
              key={agent.agent_id}
              className='overflow-hidden cursor-default'
              onClick={() => setSelectedAgentId(agent.agent_id)}>
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
              <CardFooter>
                <Button>hi</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </section>
  )
}
