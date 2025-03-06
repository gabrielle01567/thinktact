import { NextResponse } from "next/server"
import { stripe, isValidPriceId } from "@/lib/stripe"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { priceId, planName, successUrl, cancelUrl } = body

    // Validate the input
    if (!priceId || !successUrl || !cancelUrl) {
      return NextResponse.json({ success: false, message: "Missing required parameters" }, { status: 400 })
    }

    // Verify the price ID is valid
    if (!isValidPriceId(priceId)) {
      console.error(`Invalid price ID: ${priceId}. Price IDs should start with 'price_'`)
      return NextResponse.json(
        {
          success: false,
          message: "Invalid price ID. Please check your Stripe configuration.",
        },
        { status: 400 },
      )
    }

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      metadata: {
        planName,
      },
    })

    return NextResponse.json({ success: true, sessionId: session.id, url: session.url })
  } catch (error) {
    console.error("Stripe checkout error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create checkout session",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

