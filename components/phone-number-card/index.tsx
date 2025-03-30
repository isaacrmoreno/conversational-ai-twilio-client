import { PhoneNumber } from '@/types'
import { useState } from 'react'
import { toast } from 'sonner'
import { Card, CardContent } from '../ui/card'
import { Loader2 } from 'lucide-react'
import { Button } from '../ui/button'
import { Badge } from '@/components/ui/badge'
import axios from 'axios'

interface Props {
  number: PhoneNumber
}

export default function PhoneNumberCard({ number }: Props) {
  const [loading, setLoading] = useState<boolean>(false)

  const handleGetNumber = async () => {
    setLoading(true)

    const body = { phoneNumber: number.friendlyName }

    try {
      await axios.post('/api/twilio/create-incoming-phone-number', body)
      toast.success(`Successfully purchased ${number.friendlyName}`)
    } catch (error) {
      toast.error('An error occurred while purchasing the number')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className='overflow-hidden border-muted'>
      <CardContent className='p-0'>
        <div className='flex items-center justify-between p-3 bg-muted/30'>
          <span className='font-medium'>{number.friendlyName}</span>
          {number.locality && (
            <Badge variant='outline' className='text-xs'>
              {number.locality}
            </Badge>
          )}
        </div>
        <div className='px-3 pb-3'>
          <Button size='sm' className='w-full' onClick={handleGetNumber} disabled={loading}>
            {loading ? <Loader2 className='h-4 w-4 animate-spin mr-2' /> : null}
            {loading ? 'Processing...' : 'Get Number'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
