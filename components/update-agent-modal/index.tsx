'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import axios from 'axios'
import { mutate } from 'swr'
import VoiceSelect from '@/components/voice-select'

interface Props {
  agentId: string
  name: string
}

export default function UpdateAgentModal({ agentId, name }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [agentName, setAgentName] = useState<string>(name)
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>('')

  interface requestBody {
    name: string
    voice_id: string
    agent_id: string
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
        voice_id: selectedVoiceId,
        agent_id: agentId
      }

      const response = await axios.patch('/api/eleven-labs/agents/update-agent', body)

      if (!response.status) {
        throw new Error('Failed to update agent')
      }

      toast.success('Agent updated successfully!')
      setAgentName('')
      mutate('/api/eleven-labs/agents/list-agents')
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Error updating agent:', error)
      toast.error('Failed to update agent')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isDialogOpen) {
      setAgentName(name)
    }
  }, [isDialogOpen, name])

  return (
    <section>
      <div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className='cursor-pointer'>Update Agent</Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-[425px]'>
            <DialogHeader>
              <DialogTitle>Update Agent</DialogTitle>
            </DialogHeader>
            <div>
              <Input
                id='agent-name'
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                className='col-span-3'
                placeholder='Update agent name'
              />
            </div>
            <VoiceSelect selectedVoiceId={selectedVoiceId} setSelectedVoiceId={setSelectedVoiceId} />
            <DialogFooter>
              <Button onClick={createAgent} disabled={isLoading || !name || !selectedVoiceId}>
                {isLoading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Updating...
                  </>
                ) : (
                  'Update Agent'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}
