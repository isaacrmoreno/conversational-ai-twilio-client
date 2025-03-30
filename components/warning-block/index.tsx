interface props {
  text: string
}

export default function WarningBlock({ text }: props) {
  return (
    <div className='p-4 mb-6 bg-yellow-50 border border-yellow-200 rounded-md'>
      <p className='text-yellow-800 cursor-default'>{text}</p>
    </div>
  )
}
