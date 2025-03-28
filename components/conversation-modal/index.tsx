'use client'
import useSWR from 'swr'
import { fetcher } from '@/utils'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import LoadingBlock from '../loading-block'
import DangerBlock from '../danger-block'
import ConversationTranscript from '@/components/conversation-transcript'

interface Props {
  conversationId: string | null
  onClose: () => void
  open: boolean
}

export default function ConversationModal({ conversationId, onClose, open }: Props) {
  const { data, error, isLoading } = useSWR(
    conversationId ? `/api/eleven-labs/conversations/get-conversation-details?conversation_id=${conversationId}` : null,
    fetcher
  )

  const conversation = data?.data
  const transcript = conversation?.analysis?.transcript_summary

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className='sm:max-w-[600px] max-h-[80vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center justify-between'>
            <span>Conversation Details</span>
          </DialogTitle>
        </DialogHeader>

        {isLoading && <LoadingBlock />}
        {error && <DangerBlock text='Failed to load conversation details. Please try again.' />}

        <Tabs defaultValue='summary'>
          <TabsList>
            <TabsTrigger value='summary'>Summary</TabsTrigger>
            <TabsTrigger value='transcript'>Transcript</TabsTrigger>
          </TabsList>
          <TabsContent value='summary'>
            {conversation && !isLoading && (
              <div className='space-y-4 py-4'>
                {transcript && (
                  <div className='bg-muted/50 p-4 rounded-lg'>
                    <p className='text-sm'>{transcript}</p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
          <TabsContent value='transcript'>
            {conversation?.transcript && <ConversationTranscript transcript={conversation.transcript} />}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant='outline' onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
