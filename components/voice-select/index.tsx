'use client'

import type React from 'react'

import { useState } from 'react'
import { Check, Play, Square } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'
import { Badge } from '@/components/ui/badge'
import { fetcher } from '@/utils'
import useSWR from 'swr'
import { Voice } from '@/types'

interface Props {
  selectedVoiceId: string
  setSelectedVoiceId: (voice: string) => void
}

export default function VoiceSelect({ selectedVoiceId, setSelectedVoiceId }: Props) {
  const { data: voiceData } = useSWR('/api/eleven-labs/voices/get-voices', fetcher)

  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)

  const voices = voiceData?.data

  const handlePlayPreview = (previewUrl: string, e: React.MouseEvent) => {
    e.stopPropagation()

    if (isPlaying && audio) {
      audio.pause()
      audio.currentTime = 0
      setIsPlaying(false)
      return
    }

    const newAudio = new Audio(previewUrl)
    setAudio(newAudio)

    newAudio.play()
    setIsPlaying(true)

    newAudio.addEventListener('ended', () => {
      setIsPlaying(false)
    })
  }

  return (
    <div className='w-full max-w-md'>
      <Command>
        <CommandList>
          <CommandEmpty>No voice found.</CommandEmpty>
          <CommandGroup>
            {voices?.map((voice: Voice) => (
              <CommandItem
                key={voice.voice_id}
                value={voice.voice_id}
                onSelect={() => {
                  setSelectedVoiceId(voice.voice_id)
                }}
                className='flex items-center justify-between'>
                <div>
                  <div className='flex items-center'>
                    <span>{voice.name}</span>
                    <Check
                      className={cn('ml-2 h-4 w-4', selectedVoiceId === voice.voice_id ? 'opacity-100' : 'opacity-0')}
                    />
                  </div>
                  <div className='mt-1 flex flex-wrap gap-1'>
                    <Badge variant='outline' className='text-xs'>
                      {voice.labels.gender}
                    </Badge>
                    <Badge variant='outline' className='text-xs'>
                      {voice.labels.accent}
                    </Badge>
                    <Badge variant='outline' className='text-xs'>
                      {voice.labels.age}
                    </Badge>
                    <Badge variant='outline' className='text-xs'>
                      {voice.labels.description}
                    </Badge>
                  </div>
                </div>
                <Button
                  size='icon'
                  variant='ghost'
                  className='h-8 w-8'
                  onClick={(e) => handlePlayPreview(voice.preview_url, e)}>
                  {isPlaying && selectedVoiceId === voice.voice_id ? (
                    <Square className='h-4 w-4' />
                  ) : (
                    <Play className='h-4 w-4' />
                  )}
                </Button>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  )
}
