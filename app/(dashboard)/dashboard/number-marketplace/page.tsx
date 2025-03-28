'use client'

import type React from 'react'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, RotateCw, Search, Phone, CheckCircle, XCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { fetcher } from '@/utils'
import type { PhoneNumber } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import WarningBlock from '@/components/warning-block'

export default function NumberMarketplacePage() {
  const [areaCode, setAreaCode] = useState<string>('')
  const [shouldFetch, setShouldFetch] = useState<boolean>(false)
  const [hasNumber, setHasNumber] = useState<boolean>(false)
  const [notification, setNotification] = useState<{
    message: string
    type: 'success' | 'error' | null
  } | null>(null)

  // test deployment

  const { data, error, isLoading, mutate } = useSWR(
    shouldFetch ? `/api/twilio/available-phone-numbers?areaCode=${areaCode}` : null,
    fetcher
  )

  const numbers = data?.data
  const hasResults = numbers && numbers.length > 0

  const handleAreaCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAreaCode(e.target.value)
    // Clear notification when user starts a new search
    setNotification(null)
  }

  const handleSearch = () => {
    if (areaCode.length === 3) {
      setShouldFetch(true)
      setNotification(null)
    }
  }

  const handleRotate = () => {
    mutate()
    setNotification(null)
  }

  const handleButtonClick = () => {
    if (hasResults) {
      handleRotate()
    } else {
      handleSearch()
    }
  }

  useEffect(() => {
    const checkIfUserHasNumber = async () => {
      const res = await fetch(`/api/numbers/check-user-number`)
      const data = await res.json()
      if (data.success && data.hasNumber) {
        setHasNumber(true)
      }
    }

    checkIfUserHasNumber()
  }, [])

  return (
    <section className='flex-1 p-4 lg:p-8'>
      <h1 className='text-lg lg:text-2xl font-medium bold text-gray-900 mb-6'>Number Marketplace</h1>

      {notification && (
        <div
          className={`mb-4 p-3 rounded-md ${
            notification.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
          <div className='flex items-center'>
            {notification.type === 'success' ? (
              <CheckCircle className='h-4 w-4 mr-2' />
            ) : (
              <XCircle className='h-4 w-4 mr-2' />
            )}
            {notification.message}
          </div>
        </div>
      )}

      {hasNumber ? (
        <WarningBlock text="You already have a phone number. You can't purchase another one." />
      ) : (
        <div className='flex space-x-2 mb-6'>
          <Input
            type='text'
            value={areaCode}
            onChange={handleAreaCodeChange}
            maxLength={3}
            placeholder='Enter Area Code'
            className='w-32'
          />
          <Button
            onClick={handleButtonClick}
            disabled={!hasResults && areaCode.length !== 3}
            className='flex items-center'>
            {hasResults ? (
              <>
                <RotateCw className='mr-2 h-4 w-4' /> Rotate
              </>
            ) : (
              <>
                <Search className='mr-2 h-4 w-4' /> Search
              </>
            )}
          </Button>
        </div>
      )}

      {isLoading && (
        <div className='space-y-3'>
          <Skeleton className='h-[100px] w-full rounded-lg' />
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            <Skeleton className='h-[120px] rounded-lg' />
            <Skeleton className='h-[120px] rounded-lg' />
            <Skeleton className='h-[120px] rounded-lg' />
          </div>
        </div>
      )}

      {error && (
        <div className='p-3 mb-6 bg-destructive/10 border border-destructive/20 rounded-md'>
          <p className='text-destructive'>Error loading numbers. Please try again.</p>
        </div>
      )}

      {numbers && numbers.length === 0 && (
        <div className='p-3 mb-6 bg-amber-50 border border-amber-200 rounded-md'>
          <p className='text-amber-800'>No numbers found for area code {areaCode}</p>
        </div>
      )}

      {!hasNumber && hasResults && (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4'>
          {numbers.map((number: PhoneNumber) => (
            <PhoneNumberCard
              key={number.friendlyName}
              number={number}
              onPurchaseSuccess={(message) => {
                setNotification({
                  message,
                  type: 'success'
                })
              }}
              onPurchaseError={(message) => {
                setNotification({
                  message,
                  type: 'error'
                })
              }}
            />
          ))}
        </div>
      )}
    </section>
  )
}

interface PhoneNumberCardProps {
  number: PhoneNumber
  onPurchaseSuccess: (message: string) => void
  onPurchaseError: (message: string) => void
}

const PhoneNumberCard = ({ number, onPurchaseSuccess, onPurchaseError }: PhoneNumberCardProps) => {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  const handleGetNumber = async () => {
    setLoading(true)
    setError(null)
    setStatus('idle')

    try {
      const res = await fetch('/api/twilio/create-incoming-phone-number', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phoneNumber: number.friendlyName
        })
      })

      const data = await res.json()

      if (data.success) {
        setStatus('success')
        onPurchaseSuccess(`Successfully purchased ${number.friendlyName}`)
      } else {
        setError(data.message || 'Failed to purchase number')
        setStatus('error')
        onPurchaseError(data.message || 'Failed to purchase number')
      }
    } catch (error) {
      setError('An error occurred while purchasing the number')
      setStatus('error')
      onPurchaseError('An error occurred while purchasing the number')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className='overflow-hidden border-muted'>
      <CardContent className='p-0'>
        <div className='flex items-center p-3 bg-muted/30'>
          <Phone className='h-4 w-4 mr-2 text-muted-foreground' />
          <span className='font-medium'>{number.friendlyName}</span>
        </div>
        <div className='p-3 pt-2'>
          <div className='flex flex-wrap gap-2 mb-3'>
            <Badge variant='outline' className='text-xs'>
              {number.region}
            </Badge>
            {number.locality && (
              <Badge variant='outline' className='text-xs'>
                Locality: {number.locality}
              </Badge>
            )}
          </div>

          {status === 'success' ? (
            <div className='flex items-center text-green-600 text-sm p-2 bg-green-50 rounded-md'>
              <CheckCircle className='h-4 w-4 mr-2' />
              <span>Number purchased!</span>
            </div>
          ) : (
            <Button size='sm' className='w-full' onClick={handleGetNumber} disabled={loading || status !== 'idle'}>
              {loading ? <Loader2 className='h-4 w-4 animate-spin mr-2' /> : null}
              {loading ? 'Processing...' : 'Get Number'}
            </Button>
          )}

          {error && (
            <div className='mt-2 text-destructive text-xs flex items-start'>
              <XCircle className='h-3 w-3 mr-1 mt-0.5 flex-shrink-0' />
              <span>{error}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
