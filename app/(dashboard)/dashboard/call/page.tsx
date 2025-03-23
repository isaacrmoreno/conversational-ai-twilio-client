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

  useEffect(() => {
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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)

    const callObject = {
      prompt: formData.get('prompt'),
      first_message: formData.get('first_message'),
      from: selectedNumber,
      to: toNumber
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

  const handleGetNewNumber = () => {
    router.push('/dashboard/number-marketplace')
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

                <p className='text-sm text-muted-foreground'>Select an existing phone number or get a new one.</p>
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
                <p className='text-sm text-muted-foreground'>Enter the 10-digit phone number to call.</p>
              </div>

              <Button type='submit' className='w-full' disabled={isLoading || !selectedNumber || !toNumber}>
                {isLoading ? 'Initiating Call...' : 'Initiate Call'}
              </Button>
            </form>

            {error && (
              <div className='mt-6 p-4 bg-red-50 text-red-600 rounded-md'>
                <p className='font-medium'>Error</p>
                <p>{error}</p>
              </div>
            )}

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
