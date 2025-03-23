'use client'

import type React from 'react'

import { fetcher } from '@/utils'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Phone, PhoneCall, PhoneForwarded, PhoneIncoming, PhoneOff, PhoneMissed } from 'lucide-react'
import useSWR from 'swr'

// Define call status types for better type safety
type CallStatus =
  | 'queued'
  | 'ringing'
  | 'in-progress'
  | 'completed'
  | 'busy'
  | 'failed'
  | 'no-answer'
  | 'canceled'
  | string

// Define call log type
interface CallLog {
  sid: string
  from: string
  to: string
  status: CallStatus
  duration: number
  timestamp?: string
}

// Status badge component with appropriate colors and icons
function StatusBadge({ status }: { status: CallStatus }) {
  // Define status configurations
  const statusConfig: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
    completed: {
      color: 'bg-green-100 text-green-800 hover:bg-green-100',
      icon: <PhoneCall className='h-3 w-3 mr-1' />,
      label: 'Completed'
    },
    failed: {
      color: 'bg-red-100 text-red-800 hover:bg-red-100',
      icon: <PhoneOff className='h-3 w-3 mr-1' />,
      label: 'Failed'
    },
    busy: {
      color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
      icon: <PhoneMissed className='h-3 w-3 mr-1' />,
      label: 'Busy'
    },
    'no-answer': {
      color: 'bg-orange-100 text-orange-800 hover:bg-orange-100',
      icon: <PhoneMissed className='h-3 w-3 mr-1' />,
      label: 'No Answer'
    },
    canceled: {
      color: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
      icon: <PhoneOff className='h-3 w-3 mr-1' />,
      label: 'Canceled'
    },
    'in-progress': {
      color: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
      icon: <PhoneIncoming className='h-3 w-3 mr-1' />,
      label: 'In Progress'
    },
    ringing: {
      color: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
      icon: <PhoneIncoming className='h-3 w-3 mr-1' />,
      label: 'Ringing'
    },
    queued: {
      color: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
      icon: <PhoneIncoming className='h-3 w-3 mr-1' />,
      label: 'Queued'
    }
  }

  // Default configuration for unknown statuses
  const config = statusConfig[status.toLowerCase()] || {
    color: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
    icon: <Phone className='h-3 w-3 mr-1' />,
    label: status
  }

  return (
    <Badge className={`flex items-center ${config.color}`} variant='outline'>
      {config.icon}
      {config.label}
    </Badge>
  )
}

// Format phone number for better readability
function formatPhoneNumber(phoneNumber: string) {
  // Basic formatting, can be enhanced based on your needs
  if (!phoneNumber) return ''

  // Remove any non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '')

  // Format based on length
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`
  }

  // Return original if no formatting applied
  return phoneNumber
}

// Format duration to minutes:seconds
function formatDuration(seconds: number) {
  if (!seconds) return '0:00'

  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export default function CallLogs() {
  const { data, error, isLoading } = useSWR<{ success: boolean; calls: CallLog[] }>('/api/twilio/calls', fetcher)

  // Loading state with skeletons for better UX
  if (isLoading) {
    return (
      <div className='space-y-4'>
        <h2 className='text-2xl font-bold'>Call Logs</h2>
        {[1, 2, 3].map((i) => (
          <Card key={i} className='overflow-hidden transition-all'>
            <CardContent className='p-0'>
              <div className='p-6 space-y-4'>
                <div className='flex justify-between items-center'>
                  <Skeleton className='h-4 w-1/3' />
                  <Skeleton className='h-6 w-20' />
                </div>
                <div className='space-y-2'>
                  <Skeleton className='h-4 w-1/4' />
                  <Skeleton className='h-4 w-1/4' />
                  <Skeleton className='h-4 w-1/5' />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <Card className='border-red-200 bg-red-50'>
        <CardContent className='pt-6'>
          <div className='flex items-center text-red-800'>
            <PhoneOff className='h-5 w-5 mr-2' />
            <p className='font-medium'>Error loading call logs</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Empty state
  if (!data?.success || !data.calls?.length) {
    return (
      <Card>
        <CardContent className='pt-6 flex flex-col items-center justify-center text-center p-10'>
          <Phone className='h-12 w-12 text-muted-foreground mb-4' />
          <h3 className='text-lg font-medium'>No call logs available</h3>
          <p className='text-muted-foreground mt-2'>When you make or receive calls, they will appear here.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-bold'>Call Logs</h2>
        <Badge variant='outline' className='px-2 py-1'>
          {data.calls.length} {data.calls.length === 1 ? 'call' : 'calls'}
        </Badge>
      </div>

      <div className='grid gap-4'>
        {data.calls.map((call: CallLog) => (
          <Card key={call.sid} className='overflow-hidden transition-all hover:shadow-md'>
            <CardContent className='p-0'>
              <div className='p-4 space-y-2'>
                <div className='flex justify-between items-center flex-wrap gap-2'>
                  <div className='flex items-center'>
                    {call.from === call.to ? (
                      <Badge variant='outline' className='mr-2 bg-purple-100 text-purple-800'>
                        <PhoneCall className='h-3 w-3 mr-1' /> Internal
                      </Badge>
                    ) : call.from.startsWith('+') ? (
                      <Badge variant='outline' className='mr-2 bg-blue-100 text-blue-800'>
                        <PhoneIncoming className='h-3 w-3 mr-1' /> Incoming
                      </Badge>
                    ) : (
                      <Badge variant='outline' className='mr-2 bg-indigo-100 text-indigo-800'>
                        <PhoneForwarded className='h-3 w-3 mr-1' /> Outgoing
                      </Badge>
                    )}
                    <StatusBadge status={call.status} />
                  </div>
                  <div className='text-sm text-muted-foreground'>
                    {call.timestamp ? new Date(call.timestamp).toLocaleString() : 'No timestamp'}
                  </div>
                </div>

                <div className='grid md:grid-cols-3 gap-4'>
                  <div className='flex flex-row items-center'>
                    <p className='text-sm font-medium text-muted-foreground mr-1'>From</p>
                    <p className='text-sm font-medium'>{formatPhoneNumber(call.from)}</p>
                  </div>
                  <div className='flex flex-row items-center'>
                    <p className='text-sm font-medium text-muted-foreground mr-1'>To</p>
                    <p className='text-sm font-medium'>{formatPhoneNumber(call.to)}</p>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-muted-foreground mb-1'>Duration</p>
                    <div className='flex items-center'>
                      <p className='font-medium'>{formatDuration(call.duration)}</p>
                      {call.status === 'completed' && call.duration > 300 && (
                        <Badge className='ml-2 bg-green-100 text-green-800' variant='outline'>
                          Long call
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
