'use client'

import type React from 'react'

import { useState } from 'react'
import { Check, ChevronsUpDown, Play, Square } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'

// Define the voice data type based on the provided structure
type VoiceData = {
  voice_id: string
  name: string
  labels: {
    accent: string
    description: string
    age: string
    gender: string
    use_case: string
  }
  preview_url: string
}

// Sample data from the provided JSON
const voiceData: VoiceData = {
  voice_id: '9BWtsMINqrJLrRacOk9x',
  name: 'Aria',
  labels: {
    accent: 'American',
    description: 'expressive',
    age: 'middle-aged',
    gender: 'female',
    use_case: 'social media'
  },
  preview_url:
    'https://storage.googleapis.com/eleven-public-prod/premade/voices/9BWtsMINqrJLrRacOk9x/405766b8-1f4e-4d3c-aba1-6f25333823ec.mp3'
}

// You would typically have an array of voices
const voices: VoiceData[] = [voiceData]

export default function VoiceSelect() {
  const [open, setOpen] = useState(false)
  const [selectedVoice, setSelectedVoice] = useState<VoiceData | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)

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
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant='outline' role='combobox' aria-expanded={open} className='w-full justify-between'>
            {selectedVoice ? selectedVoice.name : 'Select voice...'}
            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-full p-0'>
          <Command>
            <CommandInput placeholder='Search voices...' />
            <CommandList>
              <CommandEmpty>No voice found.</CommandEmpty>
              <CommandGroup>
                {voices.map((voice) => (
                  <CommandItem
                    key={voice.voice_id}
                    value={voice.voice_id}
                    onSelect={() => {
                      setSelectedVoice(voice)
                      setOpen(false)
                    }}
                    className='flex items-center justify-between'>
                    <div>
                      <div className='flex items-center'>
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            selectedVoice?.voice_id === voice.voice_id ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                        <span>{voice.name}</span>
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
                      {isPlaying && selectedVoice?.voice_id === voice.voice_id ? (
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
        </PopoverContent>
      </Popover>

      {selectedVoice && (
        <div className='mt-4 rounded-md border p-4'>
          <h3 className='font-medium'>Selected Voice</h3>
          <div className='mt-2 grid grid-cols-2 gap-2 text-sm'>
            <div>
              <span className='font-medium'>Voice ID:</span>
            </div>
            <div>{selectedVoice.voice_id}</div>

            <div>
              <span className='font-medium'>Name:</span>
            </div>
            <div>{selectedVoice.name}</div>

            <div>
              <span className='font-medium'>Gender:</span>
            </div>
            <div>{selectedVoice.labels.gender}</div>

            <div>
              <span className='font-medium'>Accent:</span>
            </div>
            <div>{selectedVoice.labels.accent}</div>

            <div>
              <span className='font-medium'>Age:</span>
            </div>
            <div>{selectedVoice.labels.age}</div>

            <div>
              <span className='font-medium'>Description:</span>
            </div>
            <div>{selectedVoice.labels.description}</div>

            <div>
              <span className='font-medium'>Use Case:</span>
            </div>
            <div>{selectedVoice.labels.use_case}</div>
          </div>

          <div className='mt-4'>
            <Button
              variant='outline'
              className='flex items-center gap-2'
              onClick={(e) => handlePlayPreview(selectedVoice.preview_url, e)}>
              {isPlaying ? (
                <>
                  <Square className='h-4 w-4' />
                  Stop Preview
                </>
              ) : (
                <>
                  <Play className='h-4 w-4' />
                  Play Preview
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
