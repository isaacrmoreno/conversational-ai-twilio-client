'use client'

import type React from 'react'

import { useState } from 'react'
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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)

    const phoneNumbers = formData.get('numbers') as string
    const callObject = {
      prompt: formData.get('prompt'),
      first_message: formData.get('first_message'),
      numbers: phoneNumbers.split(',').map((num) => num.trim()) // Split the input into an array of numbers
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
                <label htmlFor='numbers' className='text-sm font-medium'>
                  Phone Numbers (comma separated)
                </label>
                <Input
                  id='numbers'
                  name='numbers'
                  placeholder='Enter phone numbers separated by commas'
                  type='text'
                  required
                />
                <p className='text-sm text-muted-foreground'>
                  Enter phone numbers separated by commas. E.g., 1234567890, 0987654321.
                </p>
              </div>

              <Button type='submit' className='w-full' disabled={isLoading}>
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
