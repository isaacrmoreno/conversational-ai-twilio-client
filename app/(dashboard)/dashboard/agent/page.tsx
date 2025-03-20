'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
// import { useToast } from '@/components/ui/use-toast'

export default function AgentPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [agentCreated, setAgentCreated] = useState(false)
  // const { toast } = useToast()

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

      // toast({
      //   title: 'Success',
      //   description: 'Agent created successfully!'
      // })
    } catch (error) {
      console.error('Error creating agent:', error)
      // toast({
      //   title: 'Error',
      //   description: 'Failed to create agent. Please try again.',
      //   variant: 'destructive'
      // })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='container mx-auto py-10'>
      <Card className='max-w-md mx-auto'>
        <CardHeader>
          <CardTitle>Agent Management</CardTitle>
          <CardDescription>Create and manage your Ai agents</CardDescription>
        </CardHeader>
        <CardContent>
          {agentCreated ? (
            <div className='p-4 bg-green-50 border border-green-200 rounded-md'>
              <p className='text-green-800'>Agent created successfully!</p>
            </div>
          ) : (
            <p className='text-muted-foreground'>No agent found. Create one to get started.</p>
          )}
        </CardContent>
        <CardFooter>
          {!agentCreated && (
            <Button onClick={createAgent} disabled={isLoading} className='w-full'>
              {isLoading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Creating...
                </>
              ) : (
                'Create Agent'
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
