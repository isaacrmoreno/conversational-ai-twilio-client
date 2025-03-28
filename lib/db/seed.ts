import { stripe } from '../payments/stripe'

async function createStripeProducts() {
  console.log('Creating Stripe products and prices...')

  const creatorProduct = await stripe.products.create({
    name: 'Creator',
    description: 'Creator subscription plan'
  })

  await stripe.prices.create({
    product: creatorProduct.id,
    unit_amount: 3900, // $39 in cents
    currency: 'usd',
    recurring: {
      interval: 'month',
      trial_period_days: 0
    }
  })

  // Pro Plan (doubled)
  const proProduct = await stripe.products.create({
    name: 'Pro',
    description: 'Pro subscription plan'
  })

  await stripe.prices.create({
    product: proProduct.id,
    unit_amount: 19800, // $198 in cents
    currency: 'usd',
    recurring: {
      interval: 'month',
      trial_period_days: 0
    }
  })

  // Scale Plan (doubled)
  const scaleProduct = await stripe.products.create({
    name: 'Scale',
    description: 'Scale subscription plan'
  })

  await stripe.prices.create({
    product: scaleProduct.id,
    unit_amount: 66000, // $660 in cents
    currency: 'usd',
    recurring: {
      interval: 'month',
      trial_period_days: 0
    }
  })

  console.log('Stripe products and prices created successfully.')
}

async function seed() {
  await createStripeProducts()
}

seed()
  .catch((error) => {
    console.error('Seed process failed:', error)
    process.exit(1)
  })
  .finally(() => {
    console.log('Seed process finished. Exiting...')
    process.exit(0)
  })
