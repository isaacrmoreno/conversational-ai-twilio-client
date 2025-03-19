import { Button } from '@/components/ui/button'
import { ArrowRight, BarChart, Bot, Clock } from 'lucide-react'
import { Terminal } from './terminal'

export default function HomePage() {
  return (
    <main>
      <section className='py-20'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='lg:grid lg:grid-cols-12 lg:gap-8'>
            <div className='sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left'>
              <h1 className='text-4xl font-bold text-gray-900 tracking-tight sm:text-5xl md:text-6xl'>
                Your AI Calling Assistant
                {/* <span className='block text-orange-500'>Faster Than Ever</span> */}
              </h1>
              <p className='mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl'>
                Create your own AI agent that automatically calls potential clients and qualifies leads—without the cost
                of virtual assistants.
              </p>
              <div className='mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0'>
                <a href='https://vercel.com/templates/next.js/next-js-saas-starter' target='_blank'>
                  <Button className='bg-white hover:bg-gray-100 text-black border border-gray-200 rounded-full text-lg px-8 py-4 inline-flex items-center justify-center'>
                    Deploy your own
                    <ArrowRight className='ml-2 h-5 w-5' />
                  </Button>
                </a>
              </div>
            </div>
            <div className='mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center'>
              <Terminal />
            </div>
          </div>
        </div>
      </section>

      <section className='py-16 bg-white w-full'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold text-gray-900'>Why Real Estate Agents Love Us</h2>
            <p className='mt-2 text-base text-gray-500 max-w-[600px] mx-auto'>
              Replace your virtual assistants with AI that works 24/7 at a fraction of the cost
            </p>
          </div>
          <div className='lg:grid lg:grid-cols-3 lg:gap-8'>
            <div>
              <div className='flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white'>
                <Bot className='h-6 w-6' />
              </div>
              <div className='mt-5'>
                <h2 className='text-lg font-medium text-gray-900'>AI Calling Assistant</h2>
                <p className='mt-2 text-base text-gray-500'>
                  Create your own AI agent that automatically calls potential clients and follows up without human
                  intervention.
                </p>
              </div>
            </div>

            <div className='mt-10 lg:mt-0'>
              <div className='flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white'>
                <Clock className='h-6 w-6' />
              </div>
              <div className='mt-5'>
                <h2 className='text-lg font-medium text-gray-900'>24/7 Availability</h2>
                <p className='mt-2 text-base text-gray-500'>
                  Your AI agent never sleeps, making calls and following up with leads around the clock for maximum
                  efficiency.
                </p>
              </div>
            </div>

            <div className='mt-10 lg:mt-0'>
              <div className='flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white'>
                <BarChart className='h-6 w-6' />
              </div>
              <div className='mt-5'>
                <h2 className='text-lg font-medium text-gray-900'>Cost Effective</h2>
                <p className='mt-2 text-base text-gray-500'>
                  Save up to 90% compared to hiring virtual assistants while increasing your lead conversion rates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='py-16 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center'>
            <div>
              <h2 className='text-3xl font-bold text-gray-900 sm:text-4xl'>Ready to launch your SaaS?</h2>
              <p className='mt-3 max-w-3xl text-lg text-gray-500'>
                Our template provides everything you need to get your SaaS up and running quickly. Don't waste time on
                boilerplate - focus on what makes your product unique.
              </p>
            </div>
            <div className='mt-8 lg:mt-0 flex justify-center lg:justify-end'>
              <a href='https://github.com/nextjs/saas-starter' target='_blank'>
                <Button className='bg-white hover:bg-gray-100 text-black border border-gray-200 rounded-full text-xl px-12 py-6 inline-flex items-center justify-center'>
                  View the code
                  <ArrowRight className='ml-3 h-6 w-6' />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
