'use client'

import useSWR from 'swr'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Plus, User } from 'lucide-react'
import { fetcher } from '@/utils'

export default function AgentPage() {
  const { data, error, mutate } = useSWR(`/api/list-agents`, fetcher)

  const agents = data?.data.agents

  console.log('data::', data?.data)
  console.log('error:', error)

  const [isLoading, setIsLoading] = useState(false)
  const [agentCreated, setAgentCreated] = useState(false)

  const createAgent = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/create-agent', {
        method: 'POST'
      })

      if (!response.ok) {
        throw new Error('Failed to create agent')
      }

      setAgentCreated(true)
      mutate() // Refresh the data after creating a new agent
    } catch (error) {
      console.error('Error creating agent:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (unixTimestamp: number) => {
    const date = new Date(unixTimestamp * 1000)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const isLoaded = Boolean(data)
  const hasAgents = isLoaded && Array.isArray(agents) && agents.length > 0

  return (
    <div className='container mx-auto py-10'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Agent Management</h1>
        <Button onClick={createAgent} disabled={isLoading}>
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

      {agentCreated && (
        <div className='p-4 mb-6 bg-green-50 border border-green-200 rounded-md'>
          <p className='text-green-800'>Agent created successfully!</p>
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
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {agents.map((agent: any) => (
            <Card key={agent.agent_id} className='overflow-hidden'>
              <CardHeader className='pb-3'>
                <div className='flex justify-between items-start'>
                  <CardTitle className='text-lg'>{agent.name}</CardTitle>
                  {/* <Badge variant='outline'>{agent.access_info.role}</Badge> */}
                </div>
                <CardDescription>ID: {agent.agent_id.substring(0, 8)}...</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-2 text-sm'>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Created by:</span>
                    <span className='font-medium'>{agent.access_info.creator_name}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Created on:</span>
                    <span className='font-medium'>{formatDate(agent.created_at_unix_secs)}</span>
                  </div>
                </div>
              </CardContent>
              {/* <CardFooter className='bg-muted/50 pt-3'>
                <Button variant='outline' className='w-full' size='sm'>
                  Manage Agent
                </Button>
              </CardFooter> */}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
