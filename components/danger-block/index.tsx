import Link from 'next/link'
import { Button } from '../ui/button'

interface props {
  text: string
  redirect?: boolean
}

export default function DangerBlock({ text, redirect }: props) {
  return (
    <div className='p-4 mb-6 bg-red-50 border border-red-200 rounded-md flex flex-row items-center justify-between'>
      <p className='text-red-800 cursor-default'>{text}</p>
      {redirect && (
        <Link href='/pricing' className='hover:underline'>
          Manage Subscription
        </Link>
      )}
    </div>
  )
}
