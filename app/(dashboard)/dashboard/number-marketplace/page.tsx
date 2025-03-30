'use client'

import type React from 'react'
import { useState } from 'react'
import useSWR from 'swr'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RotateCw, Search } from 'lucide-react'
import { fetcher } from '@/utils'
import type { PhoneNumber } from '@/types'
import WarningBlock from '@/components/warning-block'
import DangerBlock from '@/components/danger-block'
import LoadingBlock from '@/components/loading-block'
import PhoneNumberCard from '@/components/phone-number-card'

export default function NumberMarketplacePage() {
  const [areaCode, setAreaCode] = useState<string>('')
  const [shouldFetch, setShouldFetch] = useState<boolean>(false)

  const { data, error, isLoading, mutate } = useSWR(
    shouldFetch ? `/api/twilio/available-phone-numbers?areaCode=${areaCode}` : null,
    fetcher
  )

  const { data: subscriptionData, isLoading: loadingSubscriptionData } = useSWR(
    '/api/stripe/check-subscription',
    fetcher
  )

  const { data: numberStatusData } = useSWR('/api/numbers/check-user-number', fetcher)

  const numbers = data?.data
  const hasResults = numbers && numbers.length > 0

  const handleAreaCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAreaCode(e.target.value)
  }

  const handleSearch = () => {
    if (areaCode.length === 3) {
      setShouldFetch(true)
    }
  }

  const handleButtonClick = () => {
    if (hasResults) {
      mutate()
    } else {
      handleSearch()
    }
  }

  if (loadingSubscriptionData) return <LoadingBlock />

  const hasAccess = subscriptionData?.hasAccess

  if (!hasAccess)
    return <DangerBlock text='You cannot get a phone number without an active subscription.' redirect={true} />

  if (numberStatusData?.hasNumber)
    return <WarningBlock text="You already have a phone number. You can't purchase another one." />

  return (
    <section className='flex-1 p-4 lg:p-8'>
      <div className='flex justify-between'>
        <h1 className='text-lg lg:text-2xl font-medium bold text-gray-900 mb-6'>Number Marketplace</h1>
        <div className='flex space-x-2 mb-6'>
          <Input
            type='text'
            value={areaCode}
            onChange={handleAreaCodeChange}
            maxLength={3}
            placeholder='Enter Area Code'
            className='w-40'
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
      </div>

      {isLoading && <LoadingBlock />}

      {error && <DangerBlock text='Error loading numbers. Please try again.' />}

      {numbers && numbers.length === 0 && <WarningBlock text={`No numbers found for area code ${areaCode}`} />}

      {!numberStatusData?.hasNumber && hasResults && (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4'>
          {numbers.map((number: PhoneNumber) => (
            <PhoneNumberCard key={number.friendlyName} number={number} />
          ))}
        </div>
      )}
    </section>
  )
}
