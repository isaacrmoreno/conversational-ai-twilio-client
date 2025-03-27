interface props {
  text: string
}

export default function DangerBlock({ text }: props) {
  return (
    <div className='p-4 mb-6 bg-red-50 border border-red-200 rounded-md mt-4'>
      <p className='text-red-800'>{text}</p>
    </div>
  )
}
