import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { headers } from "next/headers"

export async function POST(request: Request) {
  const body = await request.text()
  const signature = headers().get("stripe-signature") || ""

  try {
    // Verify the webhook signature
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    if (!webhookSecret) {
      console.error("Missing Stripe webhook secret")
      return NextResponse.json({ success: false, message: "Webhook secret is not configured" }, { status: 500 })
    }

    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret)

    // Handle specific events
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object
        // Handle successful checkout
        console.log("Checkout completed:", session)
        // Here you would typically:
        // 1. Create a customer record in your database
        // 2. Grant access to your product
        // 3. Send a welcome email
        break

      case "invoice.paid":
        // Handle successful payment
        console.log("Invoice paid:", event.data.object)
        break

      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        // Handle subscription changes
        console.log("Subscription changed:", event.data.object)
        break
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Webhook handler failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400 },
    )
  }
}

// Use the new route segment config format
export const dynamic = "force-dynamic"
export const runtime = "nodejs"

