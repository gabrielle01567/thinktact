import Stripe from "stripe"

// Initialize Stripe with the secret key (only used server-side)
let stripe: Stripe | null = null

// Only initialize Stripe on the server side
if (typeof window === 'undefined' && process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16" as Stripe.LatestApiVersion,
  })
}

// Define the product price IDs
export const STRIPE_PRICE_IDS = {
  basic: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_BASIC || "",
  professional: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PROFESSIONAL || "",
  enterprise: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_ENTERPRISE || "",
}

// Helper function to format price for display
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount / 100)
}

// Helper function to validate price IDs
export function isValidPriceId(priceId: string): boolean {
  // Check if it's one of our environment variable price IDs
  if (Object.values(STRIPE_PRICE_IDS).includes(priceId) && priceId.startsWith("price_")) {
    return true
  }

  // Fallback validation - Stripe price IDs typically start with 'price_'
  return priceId.startsWith("price_")
}

export { stripe }

