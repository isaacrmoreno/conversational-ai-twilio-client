'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'

export default function CallPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [userPhoneNumbers, setUserPhoneNumbers] = useState<string[]>([])
  const [selectedNumber, setSelectedNumber] = useState<string>('')
  const [toNumber, setToNumber] = useState<string>('')
  const [selectedAgent, setSelectedAgent] = useState<string>('') // New state for agent selection
  const [agents, setAgents] = useState<any[]>([]) // State to hold the list of agents
  const [hasAccess, setHasAccess] = useState<boolean | null>(null) // Store the access status
  const [trialing, setTrialing] = useState(false) // To handle trialing status

  // Fetch the subscription and agents info
  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      try {
        const response = await fetch('/api/stripe/check-subscription')
        const data = await response.json()

        if (data.error) {
          setError(data.error)
          setHasAccess(false)
        } else {
          setHasAccess(data.hasAccess)
          setTrialing(data.trialing || false) // Handle trialing status
        }
      } catch (err) {
        console.error('Error fetching subscription status:', err)
        setError('Failed to check subscription status.')
        setHasAccess(false)
      }
    }

    const fetchAgents = async () => {
      try {
        const response = await fetch('/api/agents/list-agents') // API to fetch agents
        const data = await response.json()

        if (data.success && data.data) {
          setAgents(data.data) // Set the list of agents
        }
      } catch (err) {
        console.error('Error fetching agents:', err)
        setError('Failed to load agents.')
      }
    }

    fetchSubscriptionStatus()
    fetchAgents()
  }, [])

  useEffect(() => {
    // Fetch phone numbers for the user when component mounts
    const fetchUserPhoneNumbers = async () => {
      try {
        const response = await fetch('/api/numbers/fetch-user-numbers')
        const data = await response.json()
        const twilioNumbers = data?.data

        if (data.success && twilioNumbers.length > 0) {
          const cleanedNumbers = twilioNumbers.map((number: any) => number.replace('+1', ''))
          setUserPhoneNumbers(cleanedNumbers)
        } else {
          setUserPhoneNumbers([])
        }
      } catch (err) {
        console.error('Error fetching phone numbers:', err)
      }
    }

    fetchUserPhoneNumbers()
  }, [])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!hasAccess) {
      setError('You do not have access to initiate a call. Please check your subscription.')
      return
    }

    if (!selectedAgent) {
      setError('Please select an agent for the call.')
      return
    }

    setIsLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const callObject = {
      prompt: formData.get('prompt'),
      first_message: formData.get('first_message'),
      from: selectedNumber,
      to: toNumber,
      agent_id: selectedAgent // Add agent_id to the call object
    }

    try {
      const response = await fetch('/api/outbound-call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(callObject)
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data = await response.json()
      setResult(data)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleNumberChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedNumber(event.target.value)
  }

  const handleToNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setToNumber(event.target.value)
  }

  const handleAgentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAgent(event.target.value) // Update the selected agent
  }

  const handleGetNewNumber = () => {
    router.push('/dashboard/number-marketplace')
  }

  if (hasAccess === null) {
    return <div>Loading...</div> // Show loading state while checking access
  }

  return (
    <div className='flex justify-center'>
      <div className='container max-w-2xl py-10'>
        <Card>
          <CardHeader>
            <CardTitle>Create Call</CardTitle>
            <CardDescription>Fill out the form below to initiate an outbound call.</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className='mt-6 p-4 bg-red-50 text-red-600 rounded-md'>
                <p className='font-medium'>Error</p>
                <p>{error}</p>
              </div>
            )}

            {!hasAccess && (
              <div className='mt-6 p-4 bg-yellow-50 text-yellow-600 rounded-md'>
                <p className='font-medium'>Subscription Issue</p>
                <p>
                  Your team does not have access to initiate calls. Please ensure your subscription is active.{' '}
                  {trialing && <span>(You are currently on a trial.)</span>}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className='space-y-6'>
              <div className='space-y-2'>
                <label htmlFor='prompt' className='text-sm font-medium'>
                  Prompt
                </label>
                <Textarea
                  id='prompt'
                  name='prompt'
                  placeholder='Enter call instructions...'
                  className='min-h-[100px]'
                  required
                />
                <p className='text-sm text-muted-foreground'>Instructions for the call.</p>
              </div>

              <div className='space-y-2'>
                <label htmlFor='first_message' className='text-sm font-medium'>
                  First Message
                </label>
                <Input id='first_message' name='first_message' placeholder='Enter first message...' required />
                <p className='text-sm text-muted-foreground'>The initial message to send.</p>
              </div>

              <div className='space-y-2'>
                <label htmlFor='agent' className='text-sm font-medium'>
                  Select Agent
                </label>
                <select
                  id='agent'
                  name='agent'
                  value={selectedAgent}
                  onChange={handleAgentChange}
                  className='w-full p-2 border rounded-md'
                  required>
                  <option value='' disabled>
                    Select an agent
                  </option>
                  {agents.map((agent) => (
                    <option key={agent.agent_id} value={agent.agent_id}>
                      {agent.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className='space-y-2'>
                <label htmlFor='fromNumber' className='text-sm font-medium'>
                  From Number (Select your number)
                </label>

                {userPhoneNumbers.length > 0 ? (
                  <select
                    id='fromNumber'
                    name='fromNumber'
                    value={selectedNumber}
                    onChange={handleNumberChange}
                    className='w-full p-2 border rounded-md'>
                    <option value='' disabled>
                      Select a phone number
                    </option>
                    {userPhoneNumbers.map((number) => (
                      <option key={number} value={number}>
                        {number}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className='flex justify-between items-center'>
                    <p className='text-sm text-muted-foreground'>
                      You don't have any phone numbers. Get one to proceed.
                    </p>
                    <Button onClick={handleGetNewNumber} className='ml-4'>
                      Get Number
                    </Button>
                  </div>
                )}
              </div>

              <div className='space-y-2'>
                <label htmlFor='toNumber' className='text-sm font-medium'>
                  To Number (Enter the number you want to call)
                </label>
                <Input
                  id='toNumber'
                  name='toNumber'
                  type='tel'
                  pattern='[0-9]{10}'
                  title='Please enter a valid 10-digit phone number'
                  value={toNumber}
                  onChange={handleToNumberChange}
                  placeholder='Enter the phone number to call'
                  required
                />
              </div>

              <Button
                type='submit'
                className='w-full'
                disabled={isLoading || !selectedNumber || !toNumber || !selectedAgent || !hasAccess}>
                {isLoading ? 'Initiating Call...' : 'Initiate Call'}
              </Button>
            </form>

            {result && (
              <div className='mt-6'>
                <h3 className='text-lg font-medium mb-2'>Response:</h3>
                <pre className='bg-muted p-4 rounded-md w-full overflow-auto'>{JSON.stringify(result, null, 2)}</pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
