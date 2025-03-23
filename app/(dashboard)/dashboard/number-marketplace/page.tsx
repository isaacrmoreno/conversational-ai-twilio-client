'use client'

import type React from 'react'
import { useState } from 'react'
import useSWR from 'swr'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, RotateCw, Search } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { fetcher } from '@/utils'
import type { PhoneNumber } from '@/types'

export default function NumberMarketplacePage() {
  const [areaCode, setAreaCode] = useState<string>('')
  const [shouldFetch, setShouldFetch] = useState<boolean>(false)
  const [rotateKey, setRotateKey] = useState<number>(0)

  const { data, error, isLoading, mutate } = useSWR(
    shouldFetch ? `/api/twilio/available-phone-numbers?areaCode=${areaCode}&key=${rotateKey}` : null,
    fetcher
  )

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

  const handleRotate = () => {
    setRotateKey((prevKey) => prevKey + 1)
    mutate()
  }

  const handleButtonClick = () => {
    if (hasResults) {
      handleRotate()
    } else {
      handleSearch()
    }
  }

  return (
    <div className='max-w-3xl mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Number Marketplace</h1>

      <div className='flex space-x-2 mb-4'>
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

      {isLoading && <Loader2 className='animate-spin' />}
      {error && <div className='text-red-500'>Error loading numbers...</div>}

      {numbers && numbers.length === 0 && (
        <div className='p-4 mb-6 bg-red-50 border border-red-200 rounded-md'>
          <p className='text-red-800'>No numbers found for area code {areaCode}</p>
        </div>
      )}

      {hasResults && (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
          {numbers.map((number: PhoneNumber) => (
            <PhoneNumberCard key={number.friendlyName} number={number} />
          ))}
        </div>
      )}
    </div>
  )
}

function PhoneNumberCard({ number }: { number: PhoneNumber }) {
  return (
    <Card>
      <CardContent className='p-4'>
        <h2 className='text-lg font-semibold mb-2'>{number.friendlyName}</h2>
        <p className='text-sm text-gray-600 mb-1'>Region: {number.region}</p>
        <p className='text-sm text-gray-600 mb-2'>Postal Code: {number.postalCode || 'N/A'}</p>
      </CardContent>
    </Card>
  )
}
