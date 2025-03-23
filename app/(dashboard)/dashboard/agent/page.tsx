'use client'

import useSWR from 'swr'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Plus, User } from 'lucide-react'
import { fetcher } from '@/utils'

export default function AgentPage() {
  const { data, error, mutate } = useSWR(`/api/agents/list-agents`, fetcher)

  const agents = data?.data

  const [isLoading, setIsLoading] = useState(false)
  const [agentCreated, setAgentCreated] = useState(false)
  const [agentName, setAgentName] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [hasAccess, setHasAccess] = useState<boolean | null>(null) // New state to track access

  // Fetch the subscription status of the user
  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      try {
        const response = await fetch('/api/stripe/check-subscription') // Assuming the API is set up
        const data = await response.json()

        if (data.error) {
          setErrorMessage(data.error)
          setHasAccess(false)
        } else {
          setHasAccess(data.hasAccess)
        }
      } catch (err) {
        console.error('Error fetching subscription status:', err)
        setErrorMessage('Failed to check subscription status.')
        setHasAccess(false)
      }
    }

    fetchSubscriptionStatus()
  }, [])

  const createAgent = async () => {
    if (!agentName.trim()) {
      setErrorMessage('Agent name cannot be blank.')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/agents/create-agent', {
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

      setAgentCreated(true)
      setAgentName('')
      setErrorMessage('')
      mutate()
    } catch (error) {
      console.error('Error creating agent:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const isLoaded = Boolean(data)
  const hasAgents = isLoaded && Array.isArray(agents) && agents.length > 0

  // Early return to prevent rendering before subscription status is loaded
  if (hasAccess === null) {
    return <div>Loading subscription status...</div>
  }

  return (
    <div className='container mx-auto py-10'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Agent Management</h1>
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
            disabled={isLoading || !hasAccess} // Disable if no access
          >
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
      </div>

      {errorMessage && (
        <div className='p-4 mb-6 bg-red-50 border border-red-200 rounded-md'>
          <p className='text-red-800'>{errorMessage}</p>
        </div>
      )}

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
                </div>
                <CardDescription>ID: {agent.agent_id.substring(0, 8)}...</CardDescription>
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
            </Card>
          ))}
        </div>
      )}

      {/* Message if user is not subscribed */}
      {!hasAccess && (
        <div className='p-4 mt-6 bg-yellow-50 border border-yellow-200 rounded-md'>
          <p className='text-yellow-800'>You need to be subscribed to create agents.</p>
        </div>
      )}
    </div>
  )
}
