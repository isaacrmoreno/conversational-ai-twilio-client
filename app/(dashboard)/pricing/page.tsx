import { checkoutAction } from '@/lib/payments/actions'
import { Check } from 'lucide-react'
import { getStripePrices, getStripeProducts } from '@/lib/payments/stripe'
import { SubmitButton } from './submit-button'

// Prices are fresh for one hour max
export const revalidate = 3600

export default async function PricingPage() {
  const [prices, products] = await Promise.all([getStripePrices(), getStripeProducts()])

  const creatorPlan = products.find((product) => product.name === 'Creator')
  const proPlan = products.find((product) => product.name === 'Pro')
  const scalePlan = products.find((product) => product.name === 'Scale')

  const creatorPrice = prices.find((price) => price.productId === creatorPlan?.id)
  const proPrice = prices.find((price) => price.productId === proPlan?.id)
  const scalePrice = prices.find((price) => price.productId === scalePlan?.id)

  return (
    <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
      <div className='grid md:grid-cols-3 gap-8 max-w-xl mx-auto'>
        <PricingCard
          name={creatorPlan?.name || 'Creator'}
          price={creatorPrice?.unitAmount || 2200} // Doubled to $22
          interval={creatorPrice?.interval || 'month'}
          trialDays={creatorPrice?.trialPeriodDays || 7}
          features={['250 minutes included', 'Priority support']}
          priceId={creatorPrice?.id}
        />
        <PricingCard
          name={proPlan?.name || 'Pro'}
          price={proPrice?.unitAmount || 19800} // Doubled to $198
          interval={proPrice?.interval || 'month'}
          trialDays={proPrice?.trialPeriodDays || 7}
          features={['1,100 minutes included', 'Priority support']}
          priceId={proPrice?.id}
        />
        <PricingCard
          name={scalePlan?.name || 'Scale'}
          price={scalePrice?.unitAmount || 66000} // Doubled to $660
          interval={scalePrice?.interval || 'month'}
          trialDays={scalePrice?.trialPeriodDays || 7}
          features={['3,600 minutes included', 'Dedicated support']}
          priceId={scalePrice?.id}
        />
      </div>
    </main>
  )
}

function PricingCard({
  name,
  price,
  interval,
  trialDays,
  features,
  priceId
}: {
  name: string
  price: number
  interval: string
  trialDays: number
  features: string[]
  priceId?: string
}) {
  return (
    <div className='pt-6'>
      <h2 className='text-2xl font-medium text-gray-900 mb-2'>{name}</h2>
      <p className='text-sm text-gray-600 mb-4'>with {trialDays} day free trial</p>
      <p className='text-4xl font-medium text-gray-900 mb-6'>
        ${price / 100} <span className='text-xl font-normal text-gray-600'>per user / {interval}</span>
      </p>
      <ul className='space-y-4 mb-8'>
        {features.map((feature, index) => (
          <li key={index} className='flex items-start'>
            <Check className='h-5 w-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0' />
            <span className='text-gray-700'>{feature}</span>
          </li>
        ))}
      </ul>
      <form action={checkoutAction}>
        <input type='hidden' name='priceId' value={priceId} />
        <SubmitButton text='Get Started' />
      </form>
    </div>
  )
}
