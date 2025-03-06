import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get("sessionId")

  if (!sessionId) {
    return NextResponse.json({ success: false, message: "Session ID is required" }, { status: 400 })
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["customer", "line_items", "payment_intent"],
    })

    return NextResponse.json({ success: true, session })
  } catch (error) {
    console.error("Error retrieving checkout session:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve checkout session",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

