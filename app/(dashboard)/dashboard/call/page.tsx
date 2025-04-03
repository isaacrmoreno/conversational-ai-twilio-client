'use client'

import type React from 'react'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import useSWR from 'swr'
import { fetcher } from '@/utils'
import Link from 'next/link'
import { toast } from 'sonner'
import axios from 'axios'
import DangerBlock from '@/components/danger-block'
import LoadingBlock from '@/components/loading-block'

export default function CallPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [result, setResult] = useState<any>(null)
  const [outboundPhoneNumbers, setOutboundPhoneNumbers] = useState<string[]>([])

  const { data: userAgents } = useSWR('/api/eleven-labs/agents/list-agents', fetcher)
  // const { data: userNumbers } = useSWR('/api/numbers/fetch-user-numbers', fetcher)
  const { data: subscriptionData, isLoading: loadingSubscriptionData } = useSWR(
    `/api/stripe/check-subscription`,
    fetcher
  )

  const agents = userAgents?.data
  // const twilioNumbers = userNumbers?.data
  // const userTwilioNumbers = twilioNumbers?.map((number: any) => number.replace('+1', ''))

  // 9717152650

  const handleStartCampaign = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setIsLoading(true)
    setResult(null)

    const formData = new FormData(event.currentTarget)
    const body = {
      prompt: formData.get('prompt'),
      first_message: formData.get('first_message'),
      from: formData.get('from_number'),
      numbers: outboundPhoneNumbers,
      agent_id: formData.get('selected_agent')
    }

    try {
      const response = await axios.post('/api/start-campaign', body)

      setResult(response.data.campaign_result)
    } catch (err: any) {
      toast.error(err.message || 'Failed to start campaign.')
    } finally {
      setIsLoading(false)
    }
  }

  if (loadingSubscriptionData) return <LoadingBlock />

  const hasAccess = subscriptionData?.hasAccess

  if (!hasAccess) return <DangerBlock text='You cannot make calls without an active subscription.' redirect={true} />

  return (
    <section className='flex-1 p-4 lg:p-8'>
      <div className='flex justify-between'>
        <h1 className='text-lg lg:text-2xl font-medium bold text-gray-900 mb-6'>Start Call Campaign</h1>
      </div>
      <Card>
        <CardHeader>
          <CardDescription>Send a call to multiple numbers using your AI agent.</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <form onSubmit={handleStartCampaign} className='space-y-6'>
            <Input
              placeholder='Paste phone numbers separated by commas'
              onChange={(e) => setOutboundPhoneNumbers(e.target.value.split(',').map((n) => n.trim()))}
              required
            />
            <select id='selected_agent' name='selected_agent' className='w-full p-2 border rounded-lg' required>
              <option value=''>Select an Agent</option>
              {agents?.map((agent: any) => (
                <option key={agent.agent_id} value={agent.agent_id}>
                  {agent.name || agent.agent_id}
                </option>
              ))}
            </select>

            <div className='space-y-2'>
              <select id='from_number' name='from_number' className='w-full p-2 border rounded-lg' required>
                <option value=''>Select a phone number</option>
                <option key={9717152650} value={9717152650}>
                  {9717152650}
                </option>
              </select>
              {/* {userTwilioNumbers?.length > 0 ? (
                <select id='from_number' name='from_number' className='w-full p-2 border rounded-lg' required>
                  <option value=''>Select a phone number</option>
                  {userTwilioNumbers?.map((number: number) => (
                    <option key={number} value={number}>
                      {number}
                    </option>
                  ))}
                </select>
              ) : (
                <div className='flex justify-between items-center'>
                  <Link href='/dashboard/number-marketplace'>
                    <Button>Get Number</Button>
                  </Link>
                  <p className='text-sm text-muted-foreground'>You don't have any phone numbers. Get one to proceed.</p>
                </div>
              )} */}
            </div>
            <Textarea id='prompt' name='prompt' placeholder='Enter the AI prompt or call script' required />
            <Textarea
              id='first_message'
              name='first_message'
              placeholder='First thing the AI says on the call'
              required
            />
            <Button disabled={isLoading} type='submit'>
              {isLoading ? 'Starting...' : 'Start Campaign'}
            </Button>
          </form>
        </CardContent>
      </Card>
      {result && Array.isArray(result) && (
        <div className='mt-4 space-y-2'>
          <h3 className='text-lg font-semibold'>Campaign Result:</h3>
          {result.map((r, idx) => (
            <p key={idx} className='text-sm'>
              {r.to}: {r.status}
            </p>
          ))}
        </div>
      )}
    </section>
  )
}
