import { Button } from '@/components/ui/button'
import { ArrowRight, Users, Phone, Database, Play, DollarSign, BarChart3, Scale } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <main className='bg-gradient-to-b from-white to-gray-100'>
      <section className='py-20'>
        <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center'>
            <h1 className='text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl mb-6'>
              Effortless Outbound Calls for Any Business Need
            </h1>
            <p className='mt-3 text-xl text-gray-600 max-w-2xl mx-auto'>
              Automate follow-ups, appointment reminders, and customer outreach with AI-powered calls—saving you time
              and ensuring every contact is handled professionally.
            </p>
            <Link href='/pricing'>
              <Button className='bg-white text-blue-600 hover:bg-gray-100 rounded-full text-lg px-8 py-4 inline-flex items-center justify-center transition-colors duration-300 mt-4'>
                Get Started Now
                <ArrowRight className='ml-2 h-5 w-5' />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className='py-16 bg-white'>
        <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold text-gray-900'>Why Outbound Calling is Tough for Small Businesses</h2>
            <p className='mt-3 text-lg text-gray-600 max-w-2xl mx-auto'>
              Businesses of all sizes face difficulties when it comes to outbound calling
            </p>
          </div>
          <div className='grid md:grid-cols-3 gap-8'>
            {[
              {
                icon: <DollarSign className='h-6 w-6 text-red-500' />,
                title: 'High Costs',
                description: 'Hiring and training staff for outbound calls is expensive for small teams.'
              },
              {
                icon: <Scale className='h-6 w-6 text-red-500' />,
                title: 'Scaling Difficulties',
                description: 'Growing your outreach means hiring more staff—a slow and costly process.'
              },
              {
                icon: <BarChart3 className='h-6 w-6 text-red-500' />,
                title: 'Missed Opportunities',
                description: 'Leads and customers slip through the cracks without timely outreach.'
              }
            ].map((pain, index) => (
              <div
                key={index}
                className='bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300'>
                <div className='flex items-center mb-4'>
                  <div className='p-2 bg-red-50 rounded-full mr-3'>{pain.icon}</div>
                  <h3 className='font-semibold text-lg text-gray-900'>{pain.title}</h3>
                </div>
                <p className='text-gray-700'>{pain.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='py-16 bg-gray-50'>
        <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl font-bold text-gray-900'>How It Works</h2>
            <p className='mt-4 text-lg text-gray-600 max-w-2xl mx-auto'>
              Get started with your AI-powered assistant in four simple steps
            </p>
          </div>
          <div className='grid md:grid-cols-4 gap-8'>
            {[
              {
                icon: <Users className='h-10 w-10 text-blue-500' />,
                title: '1. Create Your AI Assistant',
                description: 'Set up your AI agent with your preferred messaging and workflows.'
              },
              {
                icon: <Phone className='h-10 w-10 text-blue-500' />,
                title: '2. Assign a Phone Number',
                description: 'Get a dedicated number for your AI to handle outbound calls.'
              },
              {
                icon: <Database className='h-10 w-10 text-blue-500' />,
                title: '3. Define Your Outreach',
                description: 'Customize call scripts for follow-ups, reminders, and customer check-ins.'
              },
              {
                icon: <Play className='h-10 w-10 text-blue-500' />,
                title: '4. Let AI Handle the Calls',
                description: 'Your AI assistant reaches out, gathers responses, and routes important updates to you.'
              }
            ].map((step, index) => (
              <div key={index} className='relative'>
                <div className='bg-white p-6 rounded-lg shadow-md border border-gray-100 h-full'>
                  <div className='flex justify-center mb-6'>
                    <div className='p-4 bg-blue-50 rounded-full'>{step.icon}</div>
                  </div>
                  <h3 className='font-semibold text-xl text-center text-gray-900 mb-3'>{step.title}</h3>
                  <p className='text-gray-700 text-center'>{step.description}</p>
                </div>
                {index < 3 && (
                  <div className='hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2'>
                    <ArrowRight className='h-8 w-8 text-blue-300' />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='py-16 bg-blue-600 text-white'>
        <div className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h2 className='text-3xl font-bold mb-4'>Make Every Call Count—Without the Hassle</h2>
          <p className='text-xl mb-8'>Automate outreach, follow-ups, and reminders with ease.</p>
          <Link href='/pricing'>
            <Button className='bg-white text-blue-600 hover:bg-gray-100 rounded-full text-lg px-8 py-4 inline-flex items-center justify-center transition-colors duration-300'>
              Get Started Now
              <ArrowRight className='ml-2 h-5 w-5' />
            </Button>
          </Link>
        </div>
      </section>
    </main>
  )
}
