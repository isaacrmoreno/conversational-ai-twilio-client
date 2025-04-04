'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Loader2, Plus } from 'lucide-react'
import { toast } from 'sonner'
import axios from 'axios'
import { mutate } from 'swr'
import VoiceSelect from '@/components/voice-select'

export default function AddAgentModal() {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [agentName, setAgentName] = useState<string>('')
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>('')

  interface requestBody {
    name: string
    voice_id: string
  }

  const createAgent = async () => {
    if (!agentName.trim()) {
      toast.error('Agent name cannot be blank.')
      return
    }

    setIsLoading(true)
    try {
      const body: requestBody = {
        name: agentName,
        voice_id: selectedVoiceId
      }

      const response = await axios.post('/api/eleven-labs/agents/create-agent', body)

      if (!response.status) {
        throw new Error('Failed to create agent')
      }

      toast.success('Agent created successfully!')
      setAgentName('')
      mutate('/api/eleven-labs/agents/list-agents')
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Error creating agent:', error)
      toast.error('Failed to create agent')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section>
      <div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className='cursor-pointer'>
              <Plus className='h-4 w-4 mr-2' />
              Create Agent
            </Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-[425px]'>
            <DialogHeader>
              <DialogTitle>Create New Agent</DialogTitle>
            </DialogHeader>
            <div>
              <Input
                id='agent-name'
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                className='col-span-3'
                placeholder='Enter agent name'
              />
            </div>
            <VoiceSelect selectedVoiceId={selectedVoiceId} setSelectedVoiceId={setSelectedVoiceId} />
            <DialogFooter>
              <Button onClick={createAgent} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Creating...
                  </>
                ) : (
                  'Create Agent'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}
